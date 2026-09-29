# Video presentation — storyboard

Working document for the video built from `subtitles.ass`. Beat boundaries and durations are
taken directly from `subtitles.ass`'s own word-group timestamps, per the `video-presentation`
skill's "Beat pacing" rule — don't re-derive them from word counts. Update this table as beats are
built, retimed, or reordered on the Kdenlive timeline; it's the source of truth for what's built,
not a one-time plan.

Status values: **built** (html + mp4 exist, on the timeline), **planned** (content type + focus
agreed, not built yet), **outline** (narration chunk identified, beat split not decided yet).

## Part 1 — Intro (0:00–0:28.16)

| Beat | Time (.ass) | Dur. | Narration | Content type | Focal element | Status | File |
|---|---|---|---|---|---|---|---|
| A | 0:00.00–0:03.57 | 3.57s | "Hello. Today I'll show you a full-stack data pipeline" | schematic | Project wordmark, punch-in + hold, no narration text printed | **built** | `00_00_wordmark-intro-light.html` / `videos/00_00_wordmark-intro-light.mp4` |
| B | 0:03.57–0:09.22 | **4.63s actual** (timeline clip; .ass estimate was 5.65s — actual overrides, per skill's authoritative-clip-length rule) | "designed to aggregate unstructured data from very different websites into one searchable index" | schematic (framed screenshots) + real ES query | Cascaded browser-frame screenshots of the 4 real source homepages (address bar = real URL), then a single browser-frame with the real `GET localhost:9200/crawler_results/_search` response (4 real hits, one per source) | **built** | `00_03_sources-to-index-light.html` / `videos/00_03_sources-to-index-light.mp4` |
| C+D | 0:09.22–0:18.65 | **9s6f (9.24s) exactly, +2 frames tail reserve = 9.32s render**, retimed to the real Kdenlive slot starting at 09.15 (supersedes the 9.43s `.ass` estimate) | C: "The goal is to demonstrate the engineering required to crawl structurally different and sometimes" — D: "hostile sites, normalize the data and make it searchable" | **one continuous clip**: framed screenshot + live-field highlight → live terminal insert → code capture, all overlaid on the same scene (not cut) | Real screenshot of one live `tr.job` row from remoteok.com (id 1137428, iMerit Technology), sequential highlight box moving row → `h2` title → `.tags .tag` (row/title/tags phases compressed ×0.661 to land the tags-highlight fade-out exactly at 4.68s); at "...sometimes **hostile** sites" (starts 4s17f / 4.68s exactly, 1.8s window) a big, centered card — with a dimming scrim behind it so it reads as the scene's accent, not a small aside — plays a real `<video>` capture (full terminal window height, not a cropped sliver) of a live `curl → weworkremotely.com` request genuinely blocked (`403`, `cf-mitigated: challenge`, `server: cloudflare`; captured live via x11grab per the `video-presentation` skill's "Live window capture" recipe; the embedded clip is edited down from the raw live capture — command + a brief real pause, hard-cut to the real response held on a freeze-frame); the code panel + `skills-unfold` + all `flash-*` lines (post-insert phases, compressed ×0.539) then run from 6.48s to exactly 9.24s, showing the real `remoteOkStrategy.ts` lines (72-89) that read/normalize those exact fields, each flashing in the same row→title→tags order | **built** | `00_09_remoteok-inspection-to-code-light.html` (embeds `videos/00_09b_hostile-site-403-terminal.mp4` as a `<video>` overlay, JS-timed) / `videos/00_09_remoteok-inspection-to-code-light.mp4` (9.32s / 233 frames @25fps) |
| E+F+G | 0:18.65–0:28.16 | 9.51s combined | E: "The domain I chose is IT job vacancies" — F: "The architecture is a classic ETL pipeline" — G: "The backend is Node.js, Express and TypeScript" | **one continuous clip, app capture**: real `/about` page, framed with `localhost:3000/about` in the address bar, single zoom-pan across three real regions | Full-page view (establishes "this is our own running app" — replaces the earlier craigslist-zoom E), zooms on the description paragraph ("Job-Crawler-Demo - a modular...", scale tuned so each line fits the frame width) for the domain line — the fake address bar dims (not scales; it's a fixed sibling of the zoomed content, never inside the transform) while this is on screen — then zooms into the real "Architecture: ETL pipeline" card (soft 1.0s transition into it, plus a continuous top-to-bottom drift for the entire hold, not just a settle-at-the-end nudge) (added to the app itself as a permanent feature, not just a video asset — 5 numbered stages boxed with arrow connectors, `Extract`/`Transform`/`Load` bolded and background-tinted), then pan up to the real "Backend: Node.js, Express, TypeScript" line in the stack card | **built** | `00_18_about-etl-stack-zoom-light.html` / `videos/00_18_about-etl-stack-zoom-light.mp4` (superseded/removed: `domain-vacancies-zoom-light.html`, the standalone craigslist-zoom E) |

## Part 2 — ETL breakdown, PostgreSQL, hypothesis (0:28.16–1:00.57)

Calmer pacing than Part 1's punchy intro — fewer, slower cuts, built from the already-running
app (real code/schema/data) rather than fresh schematic slides where a real artifact exists.

| Beat | Time (.ass) | Dur. | Narration | Content type | Focal element | Status | File |
|---|---|---|---|---|---|---|---|
| Extraction | 0:28.16–0:32.02 | 3.86s | "Extraction: Axios + Cheerio, or Puppeteer" | code capture, split panel | Two real snippets side by side: `habrCareerStrategy.ts` (axios.get + cheerio.load) vs `remoteOkStrategy.ts` (puppeteer.launch/goto/content) — real line numbers, the actual "or" branching | **built** | `00_28_extraction-axios-vs-puppeteer-light.html` / `videos/00_28_extraction-axios-vs-puppeteer-light.mp4` |
| Transformation | 0:32.02–0:37.21 | **7.0s actual** (extended for the 3-field cycle; retime once placed on the real timeline) | "Transformation: everything is normalized into a single Vacancy model" | code capture, debug-animation | Real `RawVacancy` type (`types.ts`) with 4 real per-source selectors, all 3 fields shown at once per chip in declaration order (`externalId` / `title` / `company`, e.g. craigslist's `company` is genuinely `null` — "not on listing page") — a highlight (same accent flash as `RawVacancy`'s own line) walks down each chip in lockstep with which `RawVacancy` line is highlighted, plus a plain `...` under each chip and after the shown `RawVacancy` fields to signal there's more than the 3 demoed | **built** | `00_32_transformation-vacancy-model-light.html` / `videos/00_32_transformation-vacancy-model-light.mp4` |
| Loading | 0:37.21–0:42.07 | **6.0s actual** (extended for the split reveal; retime on the real timeline) | "Loading: Redis as a cache, and then Elasticsearch for faceted search" | code capture, split-screen (not replace) | Real `pageCache.ts` `getOrFetch` (Redis get/set) starts centered, then slides+shrinks into the left half instead of being replaced, while the real `upsertVacancy.ts` `esClient.update(...)` call slides in from the right — both stay visible together, since "and then" is a continuation not a swap; avoids the earlier version's jarring code→code hard-cut (JSON doc replaced by an unrelated-looking snippet) | **built** | `00_37_loading-redis-then-es-light.html` / `videos/00_37_loading-redis-then-es-light.mp4` |
| PostgreSQL | 0:42.07–0:46.46 | 4.39s | "And PostgreSQL stores metadata, crawl state and logs" | schematic (reused ERD) → real DB rows | ER diagram reused from the PDF deck (`CrawlSource`/`CrawlListing`/`CrawlRun`/`CrawlLog`, solid-required vs dashed-optional FK, `CrawlLog` box pulses), then fades into the 5 real most-recent `crawl_logs` rows (ids 762-766, queried live via `psql` — a genuine run including a real `ERROR` timeout, not staged) streaming in one by one | **built** | `00_42_postgresql-erd-and-logs-light.html` / `videos/00_42_postgresql-erd-and-logs-light.mp4` |
| Hypothesis | 0:46.46–0:54.71 | 8.25s | "The main goal is to test a specific hypothesis: can we crawl completely different websites using a limited, unified set of tools?" | schematic, calm | 4 real source-name chips (Habr Career/RemoteOK/WeWorkRemotely/Craigslist) converging via slow-drawn lines onto one toolkit box (Axios+Cheerio / Puppeteer / one `CrawlStrategy` interface) — quiet hold, no punchy cuts; `objective-flow-light.html` considered and rejected (thematically ETL-mapping, already covered concretely by the Extraction/Transformation/Loading beats) | **built** | `00_46_hypothesis-unified-toolset-light.html` / `videos/00_46_hypothesis-unified-toolset-light.mp4` |
| Strategy pattern | 0:54.71–1:00.57 | 5.86s | "To answer this, I rely on one key design choice: the Strategy pattern" | code capture | Real `CrawlStrategy` interface (`types.ts`) with 4 real implementing strategy files fanning out (habrCareerStrategy/remoteOkStrategy/weWorkRemotelyStrategy/craigslistStrategy, each with its real transport) | **built** | `00_54_strategy-pattern-light.html` / `videos/00_54_strategy-pattern-light.mp4` |

## Part 3 — Four sources (1:00.57–2:05.74) — built (live app walkthrough)

A single continuous journey through the running app at `localhost:3000`: /about → /sources → each
source's detail page, driven with a **synthetic mouse cursor** and a **drawn browser address bar**
that updates per navigation. Built with the new **app-walkthrough** pipeline (see the
`video-presentation` skill): `scripts/record-app-walkthrough.js` captures the live authed app (cursor
baked in) to a base `.mp4`; a per-beat wrapper HTML adds the browser frame + address bar (and any PiP)
and `record-slide.js` renders the final beat. Beat sources live in `beats-src/*.beat.js`; base clips
are `videos/<beat>-base.mp4` (git-ignored intermediates, regenerable from the `.beat.js`).

| Beat | Time (.ass) | Dur. | Narration | Content type | Focal element | Status | File |
|---|---|---|---|---|---|---|---|
| Sources overview | 1:00.57–1:05.62 | ~7.2s (trim to .ass on timeline) | "I selected four real-world sources / each with its own challenge" | app walkthrough | /about ETL callback → cursor clicks **Sources** in the sidebar → /sources list of the 4 source rows; address bar `/about`→`/sources` | **built** | `01_00_sources-overview-light.html` / `videos/01_00_sources-overview-light.mp4` |
| Habr Career | 1:05.62–1:20.66 | ~15.2s | "Habr Career: the easiest case / clean server-rendered / Axios from a stable JSON-LD / details in a second pass" | app walkthrough + JSON-LD PiP | detail `/sources/3`: `Implementation:` (Axios+Cheerio two-pass) + Strategy flow (listing→server-rendered?→parse→**second-pass detail**→**JSON-LD**); PiP = honest framed panel of the REAL `<script type="application/ld+json">` JobPosting fetched live from a career.habr.com dev vacancy | **built** | `01_05_habr-career-light.html` / `videos/01_05_habr-career-light.mp4` |
| RemoteOK | 1:20.66–1:35.14 | ~14.7s | "RemoteOK: gated behind Cloudflare / 403 / Puppeteer with a real desktop user-agent and fingerprint" | app walkthrough | detail `/sources/1`: `Implementation:` (Puppeteer, listing only) + Strategy flow dwelling on the red **PROBLEM – Cloudflare bot-check** ("rejects non-browser requests with a 403") → **FIX – Puppeteer + realistic UA**. NOTE: the earlier live-terminal 403 plan was dropped — a live `curl` to remoteok.com no longer 403s (302 loop; verified 2026-09-27), so the in-app red problem box carries the 403 story instead of staging a fake response | **built** | `01_20_remoteok-light.html` / `videos/01_20_remoteok-light.mp4` |
| WeWorkRemotely | 1:35.14–1:51.73 | ~16.8s | "WeWorkRemotely: headless Puppeteer got fingerprinted and blocked after a single detail-page navigation / switched to their official RSS feed / pulled via Axios" | app walkthrough + RSS PiP | detail `/sources/2`: `Implementation:` + Strategy flow dwelling on the SECOND problem/solution — red **PROBLEM – headless session fingerprinted** ("Only 1/5 detail fetches found a JobPosting block…") → **FIX v2 – category RSS feed via Axios** ("mirrors the HTML listing 1:1 by slug… 25/25, 0 errors"); PiP = honest LIGHT panel of the REAL category `.rss` feed (fetched live) that **pans/scrolls through several real vacancy `<item>` blocks** (Dremio, Toptal, STEUART NUTRITION, Glean, Adventure Travel 365 — title/region/type) with fixation pauses, ending on "…25 items, mirrors the HTML listing 1:1 by slug" | **built** | `01_35_weworkremotely-light.html` / `videos/01_35_weworkremotely-light.mp4` |
| Craigslist | 1:51.73–2:05.74 | ~12s | "Craigslist: not a tech job board / general classifieds / narrowed to the IT category / in a few selected cities" | app walkthrough + real-site PiP | detail `/sources/6`: `Implementation:` + Strategy step **GET /search/area/<city>?cat=sof** + the 5 seeded city sub-listings; then a **PiP of the user's own live screen recording of the REAL craigslist site** fades in over the (still-visible, lightly dimmed) source-detail context — hovering the **software / qa / dba** jobs category → the live `craigslist.org/search/area/washingtondc?cat=sof` results (real Chrome window + real address bar, real listings; stays on the results LIST, no detail drill, to avoid big company logos). Real capture = kept as-is per the PiP colour-scheme exception. Source asset: `videos/01_51_craigslist-realsite.mp4` (git-ignored; the user's recording) | **built** | `01_51_craigslist-light.html` / `videos/01_51_craigslist-light.mp4` |

## Part 4 — Sub-listings, mapping, live app, search, extensibility, close (2:06.52–3:16.68) — outline

**Retimed 2026-09-28 (v2):** the "Mapping: there are two kinds of mapping here / The ETL mapping
happens inside each Strategy – it converts site-specific fields into Vacancy" passage, cut in the
previous script pass, has been **restored** in both `final-script.md` and `subtitles.ass` — timings
below for that passage are back to their original values. The closing "That is the main point of
this demo" sentence stays cut — the close still goes straight from "The rest of the pipeline stays
the same" to "Thanks for watching," which is why that one gap is still oversized (see note below).

The sub-listings beat (2:06.52–2:10.86), the two "Mapping" narration beats (2:10.86–2:23.08), and
the Elasticsearch-mapping pair (2:23.08–2:32.23) are all **built**. Everything from "Here is the
crawler running" (2:32.23) onward is still outline.

| Beat | Time (.ass) | Dur. | Narration | Content type | Focal element | Status | File |
|---|---|---|---|---|---|---|---|
| Sub-listings | 2:06.52–2:10.86 | ~4.3s | "Some sources have sub-listings / which are crawled separately" | app walkthrough | /sources list: cursor clicks the `+` expand toggles on **WeWorkRemotely** (Full-Stack/Backend) then **Craigslist** (5 cities); each revealed nested listing row has its own StatusBadge and Start/Stop — i.e. each listing is crawled separately | **built** | `02_06_sub-listings-light.html` / `videos/02_06_sub-listings-light.mp4` |
| Mapping (two kinds) | 2:10.86–2:16.12 | 5.26s | "Mapping: there are two kinds of mapping here" | schematic (new) | 3 "barrels" left→right — **Source → Redis → Elasticsearch** — connected by an animated flow-pipe; two pulsing callouts appear on the pipe: "Strategy mapping" (site fields → Vacancy) between Source/Redis, "Index mapping" (Vacancy → ES schema) at Elasticsearch. Deliberately NOT a reuse of the `/about` ETL card (already shown in `00_18`) — illustrates the same idea (two mapping points) a different way | **built** | `02_10_mapping-pipeline-barrels-light.html` |
| ETL mapping (Strategy) | 2:16.12–2:23.34 | 7.22s | "The ETL mapping happens inside each Strategy – it converts site-specific fields into Vacancy" | structure-to-code | Real WeWorkRemotely RSS `<item>` (STEUART NUTRITION, same real item already panned in `01_35`'s PiP) — highlight walks `<region>` → `<pubDate>` → `<skills>`; code panel slides in with the real `parseWeWorkRemotelyRssFeed` lines (`location: region`, `postedAt: new Date(pubDate).toISOString()`, conditional `skillsSummary`), flashing in the same order; ends on a debug-style rendering of the resulting Vacancy fields. Deliberately NOT Habr Career (already fully covered in `01_05`'s JSON-LD PiP, and its fields are Russian-flavored) | **built** | `02_16_wwr-mapping-to-code-light.html` |
| Elasticsearch mapping (1/2) | 2:23.08–2:26.23 | 3.15s (+6 static frames tail reserve) | "The Elasticsearch mapping is the index schema" | Redis→ES data flow + schema code | Retimed to real edit timecodes (supersedes the `.ass` estimate 2:23.34–2:26.99). Left: real `RawVacancy` cache card (cascade, key-boxed `sourceId`/`externalId`); middle: three unlabeled arrows growing simultaneously; right: `Elasticsearch` store barrel (labeled `CRAWLER_RESULTS_INDEX`) with a `CrawlerResultDoc` materializing inside it, cascade-style, only once the arrows finish; below: the real `upsertVacancy.ts` source (lines 5-57 in full, doc-comment included) with a continuous linear scroll landing on the real `esClient.update(...)` call — replaces the earlier `02_23_es-index-mapping-light.html` (now superseded/orphaned, safe to delete) | **built** | `02_23_rawvacancy-to-es-schema-light.html` / `videos/02_23_rawvacancy-to-es-schema-light.mp4` |
| Elasticsearch mapping (2/2) | 2:26.23–2:32.23 | 6.0s | "And it is versioned: if the schema changes, the index is rebuilt from scratch" | code → real terminal log | Real `ensureCrawlerResultsIndex()` (lines 125-148) with a green stepping highlight (row background + text) walking the actually-executed path (exists → liveVersion → condition false → warn+delete → createIndex+info); separate, spacious `output` panel (sized for ~14 lines) below shows the **real captured log** from forcing a version mismatch on the live dev ES index (`schema version 3 != 4; rebuilding index...` / `index ready at schema version 4`) — not staged text. Side effect: this emptied the local `crawler_results` index (0 docs) — re-crawl before relying on real search results locally | **built** | `02_26_schema-version-rebuild-light.html` / `videos/02_26_schema-version-rebuild-light.mp4` |
## Live app segment (2:33.01–3:02.16) — built (manual screen recording — do NOT regenerate)

**Recorded and cut by Sergei personally — do NOT regenerate or attempt to rebuild this segment
via any capture pipeline.** This is a hand-made asset, final.

**Real start/end confirmed** (2:33.01 / 3:02.16, 29.15s total). Recorded as one continuous **manual
screen capture** of the live app (not via `record-app-walkthrough.js`/a `beats-src/*.beat.js`
script — that pipeline was drafted but not used for this segment) and cut directly on the Kdenlive
timeline, covering the 4 logical steps below in order: crawler running/politeness on `/sources`,
comparing strategies side by side, the `/search` page with the unified index, and clicking through
facets. The sub-boundaries in the narration table are still a proportional `.ass` estimate, not
individually re-measured against the real cut.

| Time (.ass-proportional, not real) | Narration |
|---|---|
| 2:33.01–2:35.21 | "Here is the crawler running" |
| 2:35.21–2:37.38 | "It is deliberately polite –" |
| 2:37.38–2:40.85 | "rate limits and jitter on every source" |
| 2:40.85–2:44.08 | "You can also compare the strategies side by side" |
| 2:44.08–2:46.17 | "on the Sources page" |
| 2:46.17–2:48.96 | "And this is the search interface" |
| 2:48.96–2:53.70 | "Data from all four sources is already in one index" |
| 2:53.70–2:55.72 | "Free-text search highlighting" |
| 2:55.72–2:58.98 | "and facets for specialization, seniority" |
| 2:58.98–3:02.16 | "remote status, location and company" |

## Part 4 — Extensibility payoff (3:02.17–3:12.23) — built (one continuous multi-phase clip)

**Real span confirmed: 3:02.17–3:12.23 (~10.06s).** One `MM_SS` file (`03_02_...`) deliberately
covers **both** closing sentences (per the skill's "one file may cover several consecutive narration
beats" rule) — the whole point is the spatial payoff that only works in one clip: the two authored
things you write at the top (① scraping, ② mapping) reappear as the two dashed ①/② nodes on the
pipeline rail below, showing exactly where they plug into the otherwise-unchanged pipeline.
Considered splitting into `03_02` (authored delta) + `03_08` (rail); kept as one so that ①②→rail
connection survives — fall back to a split only if the combined clip reads too busy in the real edit.

| Beat | Time (.ass) | Dur. | Narration | Content type | Focal element | Status | File |
|---|---|---|---|---|---|---|---|
| Extensibility | 3:02.17–3:12.23 | ~10.06s (one clip; retime on the real timeline) | Phase 1 (~0–6s): "To add another source, we only need to implement the scraping and the source-specific mapping" — Phase 2 (~6–10s): "The rest of the pipeline stays the same" | schematic — **code-morph + pipeline conveyor** (two phases, one continuous clip) | **Phase 1 (top): "what you implement".** Editor-tab code card `<source>Strategy.ts` (map site fields → Vacancy). 4 real source tabs (habr_career/weworkremotely/remoteok/craigslist) cycle in sequence, morphing only the RHS of the `specialization:` line while the key stays fixed — each site's **real** derivation: habr `skillsSummary ? extractLabeledClause(…, "Специализации") : null` ([`habrCareerStrategy.ts#L119`](../../../../apps/api/src/crawler/strategies/habrCareerStrategy.ts#L119)), wwr `listing.label` ([`weWorkRemotelyStrategy.ts#L99`](../../../../apps/api/src/crawler/strategies/weWorkRemotelyStrategy.ts#L99)), remoteok `guessSpecialization([title, ...tags].join(" "))` ([`remoteOkStrategy.ts#L106`](../../../../apps/api/src/crawler/strategies/remoteOkStrategy.ts#L106)), craigslist `guessSpecialization(jobPosting.title ?? "")` ([`craigslistStrategy.ts#L126`](../../../../apps/api/src/crawler/strategies/craigslistStrategy.ts#L126)); shared helper [`guessSpecialization.ts`](../../../../apps/api/src/crawler/guessSpecialization.ts). **After** the 4, a 5th ghost `<NewSite?>` tab (dashed, **NEW** badge) pops in — the source you're adding — with its **own** bespoke `parseSpec(item.category)` deriving a new value `"Technical Engineer"`. All derivations normalize into one `Vacancy.specialization` chip (right). Caption: "N sites, N different derivations — the mess stays here." **Phase 2 (bottom): "the rest stays the same".** A 5-node conveyor — scraping① (dashed authored; `Axios · Puppeteer · RSS`, the transport zoo where ~50% of the Part-3 obstacles lived: Cloudflare 403 → Puppeteer, fingerprint → RSS) → **Redis** (page cache · rate-limit, reused) → mapping② (dashed authored; `site → Vacancy`, sits **between Redis and ES** per the real `strategy.crawl()` → `upsertVacancy()` flow in [`crawlRunner.ts#L114`](../../../../apps/api/src/crawler/crawlRunner.ts#L114)) → **Elasticsearch** (reused) → **Search + Facets** (reused). The two authored stages ①/② (matching the step-1 label) are dashed accent = "you write these"; the three reused stages light teal as the flow runs through; ends on `Search + Facets → Specialization ✓` (callback to the live-demo Specialization facet at 2:55+). | **built** (html; mp4 render pending user approval of the HTML) | `03_02_add-source-mapping-morph-light.html` |

## Tail (still `.ass`-estimate, shifted — not real)

| Time (.ass) | Narration | Status |
|---|---|---|
| 3:02.17–3:12.23 | "To add another source … The rest of the pipeline stays the same" | **built** — see Extensibility beat above (`03_02_...`) |
| 3:13.39–3:14.56 | "Thanks for watching –" | outline |
| 3:14.56–3:16.89 | "the source code is on my GitHub" | outline |

**Note:** the tail rows above are the same placeholder-shift approach as before (now shifted by the
residual +0.21s between the old 3:01.95 estimate and the new real 3:02.16 boundary) — still not a
fresh real measurement each. Re-timecode for real once each is actually built.

"Here is the crawler running" (2:33.01+) and "this is the search interface" (2:46.17+) are app
capture beats against the real, live app — not schematic.

**Pause artifact before the close (still present):** the gap between "stays the same" ending
(3:12.87) and "Thanks for watching" starting (3:14.04) is **1.17s** — the same size as before the
Mapping restore, and still noticeably longer than any other beat-to-beat gap in this part (typically
0.1–0.3s once a word's hold ends). This is the leftover from cutting "That is the main point of this
demo" out of the narration audio without tightening the join. **Fix:** trim about half of it —
roughly **0.6s** — out of the master narration audio/video at that join (not just the `.ass`
timestamps, which are derived from the real audio and will only be correct once the audio itself is
re-cut), then re-export `subtitles.ass` from the corrected audio so the word timings stay in sync.
