# Скрипт (3:00)

## [0:00–0:30] Зачем

Any product that lives on external data — jobs, prices, listings — faces the same production
problem.

Sites actively block scrapers. Every source has its own structure, its own protections.

I built this demo to answer one question: when you add a new source, do you rewrite the core —
or just plug in a new module?

## [0:30–0:48] Что

This is a production-style data ingestion pipeline.

It takes messy, protected external sources and turns them into clean, searchable, deduplicated
data.

Four real sources. Four different problems. One interface.

## [0:48–1:18] Что на входе

Input is deliberately hostile:

- Plain HTML
- RSS feeds
- JavaScript-rendered pages
- Cloudflare protection
- Browser fingerprinting

RemoteOK sits behind Cloudflare — a normal request gets 403.

Habr is server-rendered but needs extra JSON-LD calls.

WeWorkRemotely fingerprints the browser after the first hop.

Craigslist is classic classifieds — we filter by category and fan out across cities.

## [1:18–2:05] Стек и как обрабатываем

Stack is straightforward and deliberate — this is how a production ingestion service is actually
built, not a one-off script.

- Axios + Cheerio for simple cases.
- Puppeteer with a real browser fingerprint when we need to look human.

Everything goes through the same `CrawlStrategy` interface.

Each strategy knows how to talk to its source and how to map the raw response into a single
internal shape — `RawVacancy`.

Field mapping happens inside the strategy, before anything touches the database.

Redis does two jobs: per-source rate limiting with jitter, and a one-hour TTL cache for raw pages
so we don't hit the source again unnecessarily.

## [2:05–2:35] Elasticsearch и поиск

Every vacancy lands in Elasticsearch through a single upsert.

Deduplicated by `sourceId` + `externalId`. Re-crawls never create duplicates.

Schema is versioned — an incompatible change simply rebuilds the index.

On top of that — faceted search: specialization, seniority, remote/on-site, location, company.

Full-text search and autocomplete from the second character.

## [2:35–3:00] Результат

Same interface across four completely different sources.

Anti-bot protections bypassed live, not in theory.

Real data in seconds.

Search behaves like production.

And the architecture is ready to extend — adding a new source means writing a new strategy, not
rewriting the core.

That's the proof that the architecture holds.
