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

## Part 3 — Four sources (1:00.57–2:05.74) — outline

| Time (.ass) | Narration |
|---|---|
| 1:00.57–1:03.52 | "I selected four real-world sources" |
| 1:03.52–1:05.62 | "each with its own challenge:" |
| 1:05.62–1:07.60 | "1. Habr Career:" |
| 1:07.60–1:08.92 | "the easiest case" |
| 1:08.92–1:12.79 | "It has clean server-rendered pages" |
| 1:12.79–1:17.61 | "I extract data with Axios from a stable JSON-LD" |
| 1:17.61–1:20.66 | "block and fetch the details in a second pass" |
| 1:20.66–1:22.38 | "2. RemoteOK:" |
| 1:22.38–1:24.67 | "gated behind Cloudflare" |
| 1:24.67–1:29.25 | "Standard HTTP requests return a 403 error" |
| 1:29.25–1:32.34 | "To bypass this, I use Puppeteer with a real" |
| 1:32.34–1:35.14 | "desktop user-agent and browser fingerprint" |
| 1:35.14–1:37.78 | "3. WeWorkRemotely:" |
| 1:37.78–1:40.57 | "headless Puppeteer got fingerprinted and blocked" |
| 1:40.57–1:43.86 | "after a single detail-page navigation" |
| 1:43.86–1:47.10 | "So I switched to their official RSS feed" |
| 1:47.10–1:51.73 | "which isn't gated at all and is pulled via Axios" |
| 1:51.73–1:53.06 | "4. Craigslist:" |
| 1:53.06–1:55.21 | "this is not a tech job board" |
| 1:55.21–1:57.82 | "but a general classifieds site" |
| 1:57.82–2:00.66 | "To align it with the other sources" |
| 2:00.66–2:03.68 | "I narrowed the scope down to the IT category" |
| 2:03.68–2:05.74 | "in a few selected cities" |

The RemoteOK 403 beat (1:24.67–1:29.25) is the live-terminal/real-403-response beat agreed earlier
— capture on `DP-1`, real `curl` request in frame, no staged/pre-saved response (see skill's "Live
window capture" and "Zoom in before recording" sections).

## Part 4 — Sub-listings, mapping, live app, search, extensibility, close (2:06.52–3:21.26) — outline

| Time (.ass) | Narration |
|---|---|
| 2:06.52–2:08.92 | "Some sources have sub-listings" |
| 2:08.92–2:10.86 | "which are crawled separately" |
| 2:10.86–2:11.44 | "Mapping:" |
| 2:11.44–2:15.28 | "there are two kinds of mapping here" |
| 2:16.12–2:19.04 | "The ETL mapping happens inside each Strategy –" |
| 2:19.04–2:23.26 | "it converts site-specific fields into Vacancy" |
| 2:23.34–2:26.91 | "The Elasticsearch mapping is the index schema" |
| 2:26.99–2:29.06 | "And it is versioned:" |
| 2:29.10–2:30.51 | "if the schema changes" |
| 2:30.51–2:32.96 | "the index is rebuilt from scratch" |
| 2:33.09–2:35.33 | "Here is the crawler running" |
| 2:35.33–2:37.55 | "It is deliberately polite –" |
| 2:37.55–2:40.76 | "rate limits and jitter on every source" |
| 2:41.08–2:44.38 | "You can also compare the strategies side by side" |
| 2:44.38–2:46.34 | "on the Sources page" |
| 2:46.51–2:49.17 | "And this is the search interface" |
| 2:49.35–2:53.84 | "Data from all four sources is already in one index" |
| 2:54.18–2:56.24 | "Free-text search highlighting" |
| 2:56.24–2:59.57 | "and facets for specialization, seniority" |
| 2:59.57–3:02.63 | "remote status, location and company" |
| 3:02.81–3:04.19 | "To add another source" |
| 3:04.19–3:06.67 | "we only need to implement the scraping" |
| 3:06.67–3:08.81 | "and the source-specific mapping" |
| 3:08.81–3:12.87 | "The rest of the pipeline stays the same" |
| 3:13.52–3:17.24 | "That is the main point of this demo" |
| 3:17.76–3:18.93 | "Thanks for watching –" |
| 3:18.93–3:21.26 | "the source code is on my GitHub" |

"Here is the crawler running" (2:33.09+) and "this is the search interface" (2:46.51+) are app
capture beats against the real, live app — not schematic.
