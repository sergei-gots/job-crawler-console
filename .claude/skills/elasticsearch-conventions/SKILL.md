---
name: elasticsearch-conventions
description: Use when touching apps/api/src/search (the Elasticsearch/Coveo-like layer) — covers that Elasticsearch is a derived index (not source of truth), how schema changes are versioned and rebuilt, and how a rebuild relates to crawl history. Triggers on "crawler_results index", "CRAWLER_RESULTS_SCHEMA_VERSION", "ensureCrawlerResultsIndex", or editing files under apps/api/src/search.
---

# Elasticsearch conventions

- **Elasticsearch is a derived search index, not the source of truth.** The `crawler_results`
  index is a rebuildable projection — every vacancy is re-fetchable via re-crawl (`upsertVacancy`
  is idempotent by `sourceId:externalId`). PostgreSQL holds the authoritative records.
- **Schema changes go through index versioning, not in-place migration.**
  [`crawlerResultsIndex.ts`](/apps/api/src/search/crawlerResultsIndex.ts)'s
  `CRAWLER_RESULTS_SCHEMA_VERSION` is stamped into the mapping's `_meta`; on a mismatch,
  `ensureCrawlerResultsIndex` deletes + recreates the index empty and the next crawl repopulates
  it — touching only the ES index, never `CrawlRun`/`CrawlLog` history. Bump the constant on any
  mapping change existing docs won't satisfy. Full rebuild mechanics, and how this differs from
  the heavier admin "Clear search data" action, are in
  [`/.claude/features/03_FEATURE_CRAWL_SEARCH_SEPARATION.md`](/.claude/features/03_FEATURE_CRAWL_SEARCH_SEPARATION.md).
- **Staleness is a read-time filter, not deletion.** `upsertVacancy` bumps `lastSeenAt` on every
  re-crawl but never deletes docs a run didn't re-see.
  [`queryVacancies.ts`](/apps/api/src/search/queryVacancies.ts)'s `staleCutoffIso()` filters query
  results to `lastSeenAt >= now - MAX_VACANCY_AGE_DAYS` (env var, default 14 days) — old docs just
  stop showing up, they aren't removed from the index. The only actual deletion path is the manual
  "Clear data" admin action (`clearSourceData` / `deleteVacanciesForSource`), which wipes a whole
  source at once. This is deliberate — see the "Considered and rejected: clearing a source's ES
  data before every crawl restart" section and the "Known gap: unbounded ES index growth" note in
  [`/.claude/features/02b_FEATURE_VACANCY_DETAIL_CRAWL.md`](/.claude/features/02b_FEATURE_VACANCY_DETAIL_CRAWL.md).
