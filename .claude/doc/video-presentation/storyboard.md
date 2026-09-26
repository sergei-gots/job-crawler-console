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
| A | 0:00.00–0:03.57 | 3.57s | "Hello. Today I'll show you a full-stack data pipeline" | schematic | Project wordmark, punch-in + hold, no narration text printed | **built** | `wordmark-intro-light.html` / `videos/wordmark-intro-light.mp4` |
| B | 0:03.57–0:09.22 | **4.63s actual** (timeline clip; .ass estimate was 5.65s — actual overrides, per skill's authoritative-clip-length rule) | "designed to aggregate unstructured data from very different websites into one searchable index" | schematic (framed screenshots) + real ES query | Cascaded browser-frame screenshots of the 4 real source homepages (address bar = real URL), then a single browser-frame with the real `GET localhost:9200/crawler_results/_search` response (4 real hits, one per source) | **built** | `sources-to-index-light.html` / `videos/sources-to-index-light.mp4` |
| C+D | 0:09.22–0:18.65 | 9.43s combined | C: "The goal is to demonstrate the engineering required to crawl structurally different and sometimes" — D: "hostile sites, normalize the data and make it searchable" | **one continuous clip**: framed screenshot + live-field highlight → code capture, overlaid (not cut) | Real screenshot of one live `tr.job` row from remoteok.com (id 1137428, iMerit Technology), sequential highlight box moving row → `h2` title → `.tags .tag`, each with a real-value label (`data-id`/`data-company`, `title`, `skillsSummary`); at the D boundary (5.38s in) a code panel slides in from the right and overlays the still-visible row, showing the real `remoteOkStrategy.ts` lines (72-89) that read/normalize those exact fields, each flashing in the same row→title→tags order | **built** | `remoteok-inspection-to-code-light.html` / `videos/remoteok-inspection-to-code-light.mp4` |
| E | 0:18.65–0:21.66 | 3.01s | "The domain I chose is IT job vacancies" | app capture | One real vacancy card from the live search UI, large in frame | planned | — |
| F | 0:21.66–0:24.82 | 3.16s | "The architecture is a classic ETL pipeline" | schematic | Large typographic mark `E → T → L`, nothing else in frame | planned | — |
| G | 0:24.82–0:28.16 | 3.34s | "The backend is Node.js, Express and TypeScript" | code capture | One close-up `package.json`/terminal fragment, Node/Express/TS highlighted | planned | — |

## Part 2 — ETL breakdown, PostgreSQL, hypothesis (0:28.16–1:00.57) — outline, not yet split into beats

| Time (.ass) | Narration |
|---|---|
| 0:28.16–0:28.96 | "Extraction:" |
| 0:28.96–0:32.02 | "Axios + Cheerio or Puppeteer" |
| 0:32.02–0:33.21 | "Transformation:" |
| 0:33.21–0:37.21 | "everything is normalized into a single Vacancy model" |
| 0:37.21–0:37.90 | "Loading:" |
| 0:37.90–0:40.56 | "Redis as a cache and then Elasticsearch" |
| 0:40.56–0:42.07 | "for faceted search" |
| 0:42.07–0:46.46 | "And PostgreSQL stores metadata, crawl state and logs" |
| 0:46.46–0:49.48 | "The main goal is to test a specific hypothesis:" |
| 0:49.48–0:52.20 | "can we crawl completely different websites using" |
| 0:52.20–0:54.71 | "a limited unified set of tools?" |
| 0:54.71–0:59.05 | "To answer this, I rely on one key design choice:" |
| 0:59.05–1:00.57 | "the Strategy pattern" |

Likely content types once split: code capture (Extraction/Transformation/Loading each showing the
real `CrawlStrategy`/`Vacancy` model/Redis+ES code), schematic (hypothesis statement, Strategy
pattern shape).

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
