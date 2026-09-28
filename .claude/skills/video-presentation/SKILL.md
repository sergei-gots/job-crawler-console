---
name: video-presentation
description: Use when creating or editing any presentation slide HTML under .claude/doc/slides/ or .claude/doc/video-presentation/, or when a slide needs to be exported as video for Kdenlive/another editor — covers the light/dark-twin convention (light by default, dark on explicit request), the difference between the multi-slide deck folder and the standalone-video-slide folder, the headless-Chrome print-to-pdf command for PDF decks, and the Puppeteer+ffmpeg recipe for turning an animated slide into an .mp4. Triggers on "new slide", "regenerate the slides PDF", "export slides to PDF", "update the PDF", "video slide", "dark for this", "export to video", "Kdenlive", or right after editing any slides HTML file.
---

# Slide decks: light/dark twins, folder convention, and PDF regeneration

## Storyboard document — the working plan for this video

[`.claude/doc/video-presentation/script/storyboard.md`](../../doc/video-presentation/script/storyboard.md)
is the authoritative beat-by-beat plan for the presentation being built from `subtitles.ass` (both
files live in the `script/` subfolder together with `final-script.md`): beat
timings (taken from the `.ass` word-group timestamps, not estimated), narration, content type,
focal element, and build status (`built` / `planned` / `outline`). **Read it before planning or
building any beat, and update its status/file columns as beats are built, retimed, or reordered**
— it's a living document, not a one-time plan snapshot.

## File naming: `MM_SS_<slug>` prefix

Every new beat's `.html` (and its rendered `.mp4` in `videos/`) is named
`MM_SS_<descriptive-slug>-light.html`, where `MM_SS` is the beat's start timestamp in
`subtitles.ass` — both zero-padded two digits (e.g. a beat starting at `0:09.22` is
`00_09_...`, one starting at `1:05.62` is `01_05_...`). This makes the folder listing sort in
narration order and makes each file's place in the timeline obvious without opening
`storyboard.md`. Applies going forward from when this convention was adopted — the still-earlier
retired `intro-flow-*`/`objective-flow-*` files (pre-dating the storyboard itself) keep their old
plain names, don't rename those.

## Default to light only; dark is opt-in per slide

Every piece of slide HTML in this project shares the same markup and the same design tokens
(`--paper`, `--ink`, `--accent`, etc.) across `*-light.html` / `*-dark.html` — only each theme's
`:root` values differ, so a dark twin is always mechanical to produce from a light one. But **build
only the `*-light.html` file by default.** Produce the matching `*-dark.html` twin for a given
slide only when the user asks for it on that slide specifically (trigger phrase: "dark for this" /
"dark-for-this", or any equivalent explicit ask) — never proactively, and a dark request for one
slide doesn't carry over to the next slide you build. This reverses the deck's own earlier
convention (`job-crawler-demo-slides-*`, `video-slides-dark.html` already ship both, unconditionally
— that's existing, settled work, don't retrofit it) — new individual slides start light-only.

## Two folders, two different jobs

- **`.claude/doc/slides/`** — full multi-slide decks meant to be paginated/exported as one PDF
  (`job-crawler-demo-slides-light.html` / `-dark.html`, one `<section class="slide">` per page) or
  scrolled through as a single long page for screen-recording (`video-slides-dark.html`, one
  `.slide` per full-viewport beat). Files here are **decks**, not individual slides.
- **`.claude/doc/video-presentation/`** — standalone, single-purpose slides built for one
  specific beat of a video presentation (e.g. `objective-flow-dark.html` / `-light.html`), each its
  own self-contained HTML file at a fixed `1280x720` canvas, not part of a larger deck. These are
  free to use CSS/SVG animation (`@keyframes`, SMIL `animateMotion`) since they're captured live via
  screen recording, not paginated to PDF — no `@page` rule needed. Every keyframe in this project's
  slides is written in **percentages**, not fixed times, specifically so the loop length can be
  changed later by editing only the `animation-duration` (e.g. `11s` → `14s`) without touching any
  keyframe rule — keep new slides consistent with that pattern. When timing the loop:
  1. Start from the narration's spoken length as a rough estimate (a ~26-29-word sentence runs
     close to 10-11s spoken at a natural pace) — this is only a first guess.
  2. **The real clip length in the actual video edit (Kdenlive or otherwise) is authoritative and
     overrides the word-count estimate** once it's known — e.g. `intro-flow-light.html`'s loop was
     rescaled from an initial `11s` guess to `14s` once the user reported that's the clip's actual
     length on their timeline. Recompute per slide, per phrase; don't reuse a fixed duration or
     leave a slide on its initial estimate once the real number is known.

## Beat pacing: durations come from subtitles.ass, not estimated

`.claude/doc/video-presentation/script/subtitles.ass` is the source of truth for beat timing — it already
has per-word start/end timestamps (karaoke-style `\t` color-sweep tags). Never estimate a beat's
length from word count or a guessed speaking rate: find the phrase or thesis the beat illustrates
in the `.ass` events, read its actual start/end timestamps, and make the clip/loop exactly that
long. This applies both to picking where a beat starts/ends and to setting a schematic slide's
`animation-duration`.

Default beat length is **5-6 seconds** — shorter than a full narration sentence. A single subtitle
line can run 8-10s+; when it does, split it into two+ beats at a natural clause boundary *using
the `.ass` word timestamps to find that boundary's exact time* (e.g. "...crawl structurally
different and sometimes hostile sites" / "normalize the data and make it searchable" is one
sentence in the narration but two beats, cut at the timestamp between "sites" and "normalize").
This replaces the earlier "one slide per sentence, ~10-14s loop" pattern. The first two beats built
under that older pattern — `intro-flow-*` and `objective-flow-*` — are **retired, not a
reference**: wide-shot, multi-element, slow-build compositions that don't survive a 5-6s cut. Don't
extend or reuse their layout/pacing for new work; new beats follow "Shot size, focus, and dynamics"
below instead.

## Shot size, focus, and dynamics

A schematic slide built for a 5-6s beat needs a different visual language than the retired
10-14s ones:

- **One focal element per beat.** A single subject doing one thing — not a scene with 3-4 things
  moving at once that the eye has to sort out (the retired slides' failure mode: sun + three
  clouds + captions all animating together).
- **Close/large framing.** The focal element should read as large within the `1280x720` canvas —
  not a small icon adrift in mostly empty background. If the idea needs multiple entities (e.g.
  four source names), show them as one compact group treated as a single visual unit, not scattered
  across the frame.
- **Fast, punchy motion, not a slow build.** One or two decisive movements/appearances timed to
  fill the beat's actual `.ass`-derived duration — no gentle multi-second fade-ins or pulses that
  only read as "settling" over 10+ seconds. Motion should look intentional within ~1s, not ambient.

## Content types for a beat

Not every beat is an animated CSS/SVG slide. Pick the type that actually shows the claim being
made, and keep each beat to exactly one of these — don't combine two in one clip:

- **Schematic slide** — the existing animated HTML/CSS/SVG convention (`intro-flow-*`,
  `objective-flow-*`). Use for an abstract, domain-narrow concept (a pipeline shape, a pattern)
  that has no literal on-screen equivalent in the running app or a target site.
- **App capture** — a real screen recording of *this project's own* running app (Sources page,
  Search page, a crawl in progress with its live log panel). The app itself renders in a normal
  headless-capturable page (no devtools chrome), so it's captured headless — but NOT with
  `record-slide.js` (which is hardcoded to `file://` static slides). Use **`record-app-walkthrough.js`**
  (see "App walkthrough" below) for anything on `localhost:3000`.
- **App walkthrough** — the richer form of app capture used for Part 3 (the four sources): a guided,
  continuous journey through the live app with a **synthetic mouse cursor** and a **drawn browser
  address bar**, so the viewer sees how the app is operated. Two layers:
  1. `scripts/record-app-walkthrough.js <beat-script.js> <out.webm>` — headless Puppeteer that logs
     in (demo user `video-demo@example.com` / `videodemo123`, token injected into `localStorage`
     under `jobcrawler_token` via `evaluateOnNewDocument` so the app is authed before mount),
     navigates `localhost:3000`, runs a per-beat script of real interactions (`click`/`moveTo`/
     `scrollTo`/`waitForPath`, auto-scrolling targets into view), and renders a cursor sprite that
     follows `page.mouse` with a click ripple. Output is the bare app (cursor baked in), no chrome,
     no PiP. Beat scripts live in `.claude/doc/video-presentation/beats-src/<beat>.beat.js`
     (`module.exports = { seconds, startPath, viewport, run }`). Captures at deviceScaleFactor 2
     (2560×1440-ish); the Next.js dev overlay is hidden automatically. Detail-page `StrategyFlow`
     steps render **already expanded** (`defaultExpanded`) — dwell with `moveTo`, don't click (a
     click collapses them).
  2. a per-beat **wrapper HTML** (`<beat>-light.html`) that draws the browser frame (titlebar +
     address bar, same look as `00_18`) over the base clip as a `<video>`, swaps the address text on
     a `timeupdate` timer per navigation, and overlays any PiP (see below); `record-slide.js` then
     screencasts the wrapper to the final `.mp4`. The base clip is `videos/<beat>-base.mp4` — a
     git-ignored intermediate, regenerable from the `.beat.js`; only the wrapper HTML + `.beat.js`
     are tracked. PiP overlays that are page-content (a real JSON-LD block, an RSS feed's XML, a
     server-rendered site screenshot) are done headlessly as honest framed panels/screenshots in
     the wrapper (scrim + positioned panel, like `00_09`); only true DevTools/terminal chrome needs
     the `x11grab` path below.

  **PiP background convention:** every *constructed* PiP panel (a code/JSON/XML/DOM panel you build
  in the wrapper HTML — e.g. the Habr JSON-LD panel, the WWR RSS panel) uses a **light** background,
  matching the deck's light theme. The ONLY exceptions are **screenshots and live captures**, which
  carry their own color scheme (a real site screenshot, a real DevTools/terminal `x11grab` clip) —
  don't recolor those, embed them as-is. So: hand-built panels = light; real captured pixels = leave
  as captured.

  **PiP pacing — leave the source context readable.** A PiP should start a beat or two *later* than
  the beat begins and end *earlier* than the beat ends, so the app underneath (the "source context" —
  e.g. the source-detail page describing the source) is readable both before and after the insert.
  Never let the PiP fade in at 0s or end exactly with the beat's last frame. Keep the dimming scrim
  behind the PiP **light** (≈`rgba(15,25,24,.28)`, not `.5`) so that source context stays visible
  through it — the PiP is an accent over the app, not a full takeover. Tune the PiP's in-point
  (`PIP_AT` in the wrapper JS) to sit under the narration phrase it illustrates, not to fill the clip.

  **DOM-context convention (for a PiP that shows one extracted element).** When a PiP shows a single
  element lifted from a page (e.g. Habr's `<script type="application/ld+json">`), render a few of its
  **DOM ancestors in muted grey** (`<html>`→`<head>`→`<meta>`/`<title>`… and the closing
  `</head>`/`<body>`/`</html>` after it) and highlight **only the target element** (accent colour +
  one continuous highlight band, contents syntax-coloured inside). This makes it read as "this is
  lifted straight out of the page's HTML," not free-floating text. See `01_05_habr-career-light.html`.

  **Feed/list PiP as a scrolling flow.** For a PiP that shows a feed or result list (RSS items, search
  results), don't freeze on one static frame — build the inner content taller than the panel window
  (`overflow:hidden`) and animate a vertical `translateY` pan through several **real** items with
  short pauses (fixation) on each, ending on a "… N items" tail. See the RSS panel in
  `01_35_weworkremotely-light.html` (`@keyframes rssScroll` with hold-steps).
- **Site inspection capture** — DevTools (Elements/Network) open on a real *external* target site
  (career.habr.com, remoteok.com, etc.) to show how its data is actually structured, or a live
  429/403/block response. Devtools UI is host-window chrome, not page content — CDP screencast
  (what `record-slide.js` uses) cannot capture it, so this requires a real, visible browser window
  captured via `x11grab` (see "Live window capture" below), not the headless pipeline.
- **Terminal/log capture** — a real terminal window (crawl logs streaming, a `curl`/axios request
  hitting a live 403) captured the same `x11grab` way as site inspection. Prefer this over a
  stylized log-replay slide whenever the actual live behavior is the point being made (e.g. the
  403 beat below) — staging a fake response undercuts a demo whose whole premise is showing real
  engineering obstacles.
- **Framed screenshot** — a real static screenshot (headless `page.screenshot()`, no live capture
  needed) composited inside a drawn CSS "browser frame" (rounded titlebar, three dots, an address
  bar showing the actual URL). Honest because the content is a real screenshot and the frame is
  just presentational chrome, not a claim about anything — unlike a 403/blocked-response beat,
  where the live behavior itself *is* the claim being made. Use for beats that need to show what
  several real websites/pages look like without the dynamics of a video capture (e.g. `sources-
  to-index-light.html`'s cascade of the 4 source homepages, each a real screenshot in this frame).
  Multiple framed screenshots can cascade as one grouped visual (staggered punch-in, offset
  down-right) and still count as "one focal element" per "Shot size, focus, and dynamics" — the
  group is the single unit.
- **Code capture** — a syntax-highlighted source snippet, built as a normal HTML slide (no browser
  target needed) — same schematic-slide pipeline, optionally with a typing/line-highlight
  animation. Use to show the actual `CrawlStrategy`/model code behind a claim just made in
  narration, not a paraphrase of it.
- **Structure-to-code beat** — a two-phase pattern combining a framed screenshot with code
  capture as one continuous clip spanning two adjacent narration beats, rather than two separately
  cut clips: phase 1 is a framed screenshot of one real element (e.g. one `tr.job` row) with a
  highlight box that moves sequentially through its fields (whole element → one sub-field → another
  sub-field), each stop labeled with the *real* value/attribute name found live; phase 2, timed to
  the next beat's boundary, slides a code panel in from the side to overlay (not replace) the still-
  visible phase-1 shot, showing the real `CrawlStrategy` lines that read/normalize those exact
  fields, each line flashing in the *same order* the fields were highlighted in phase 1 — the
  repeated order is what makes the structure↔code correspondence read clearly. Built with one
  headless screenshot + measured `getBoundingClientRect()` offsets for the highlight-box keyframes
  (see `remoteok-inspection-to-code-light.html`) — no live window/x11grab needed, since it's a
  static screenshot underneath, not a live page. Use when a "here's the raw structure" beat is
  immediately followed by a "here's how we parse it" beat for the *same* concrete example.

## Live window capture (site inspection, terminal, real error responses)

Unlike a schematic/code slide, these need an actual visible, non-headless browser or terminal
window on the real desktop (`DISPLAY=:0` in this environment), recorded with `ffmpeg -f x11grab`
over that window's geometry — CDP screencast only captures page content, not devtools/terminal
chrome. This briefly takes over the visible screen for the duration of the recording; confirm with
the user before opening the window if they might be using that monitor.

This environment has two monitors — `HDMI-0` (2560x1440, primary, offset `+0+0`) and `DP-1`
(1920x1080, offset `+2560+0`). **Open the capture window on `DP-1`, not `HDMI-0`**, so the
recording doesn't interrupt whatever's on the primary/working monitor; re-check with `xrandr` if
the monitor layout ever changes, don't hardcode these offsets blindly.

For user-driven captures on monitor 2 (DP-1) there are two ready-to-run local helpers:
- **`utils/record-screen2.sh`** — full-screen DP-1 capture (auto-detects geometry from `xrandr`).
- **`utils/record-chrome.sh`** — a single Chrome *window* at its own size (geometry via `xwininfo`,
  prefers the window on DP-1; pass a title substring or `WIN=<id>` to disambiguate).
Both write to `~/Videos/<name>_<timestamp>.mp4` (H.264), **draw the mouse cursor by default** (it's
needed — it explains the on-screen user's actions; `DRAW_MOUSE=0` to hide), and stop cleanly on
`q`/Ctrl+C.

**Caveat — `utils/` is git-ignored and may be absent** (the user keeps it local, not committed): on
a fresh checkout these scripts won't exist. This recipe (the section above/below) is the tracked
source of truth — recreate the scripts from it if `utils/` is missing, don't assume they're present.
Use `record-chrome.sh` for a windowed capture; use the windowed `xwininfo` recipe below when you need
to script the capture yourself headless-style.

```bash
# 1. Get the target window's EXACT geometry. Find the id with `wmctrl -l`, then read absolute
#    coords with `xwininfo` — do NOT use `wmctrl -l -G`'s x/y: they're offset from the real content
#    (seen +10,+36 off), which crops the top of the capture. xwininfo's Absolute upper-left is right.
WIN=$(DISPLAY=:0 wmctrl -l | grep -i "<window title substring>" | awk '{print $1}')
INFO=$(DISPLAY=:0 xwininfo -id "$WIN")
X=$(echo "$INFO"|awk '/Absolute upper-left X/{print $4}'); Y=$(echo "$INFO"|awk '/Absolute upper-left Y/{print $4}')
W=$(echo "$INFO"|awk '/Width:/{print $2}');  H=$(echo "$INFO"|awk '/Height:/{print $2}')
W=$((W-W%2)); H=$((H-H%2))   # H.264 needs even dimensions

# 2. Record that exact region for N seconds (x offset must be >= 2560 if the window is on DP-1)
ffmpeg -y -video_size ${W}x${H} -f x11grab -framerate 30 -draw_mouse 1 -i :0.0+${X},${Y} -t 12 \
  /tmp/<beat>.webm

# 3. Same H.264 conversion as the headless pipeline
ffmpeg -y -i /tmp/<beat>.webm -c:v libx264 -pix_fmt yuv420p -crf 18 -preset veryfast -r 25 \
  .claude/doc/video-presentation/videos/<beat>.mp4
```

For a **real 403/429 demo** (e.g. RemoteOK/Cloudflare): run the actual request live in the
recorded terminal (`curl` without the browser-like headers the real strategy sends, or a
deliberately-stripped-down axios call) so the response in the clip is the target site's real
answer at record time, not a pre-saved transcript — the whole point of this beat is that the
obstacle is real, not staged. Same applies to any "here's what naive/wrong looks like" beat.
(Verify the block still reproduces before recording — e.g. RemoteOK stopped returning a plain
`403` and now 302-loops, so that beat fell back to the in-app red `problem` box instead of a staged
terminal. Never fake a response that doesn't happen live.)

### User-driven live site tour → PiP (the craigslist recipe)

When a beat needs a real external site navigated *the way a person would* (hover a menu, pick a
category, scroll a result list) — richer than a single screenshot and impossible to drive reliably
headless (many JS-SPA sites, incl. craigslist's search, render **blank** headless; craigslist's
homepage even needs JS) — have the **user perform the tour in a real Chrome window** on `DP-1` and
capture the whole window with `x11grab`. Protocol used and confirmed:

1. User puts the site's start page in a Chrome window on `DP-1`; you read its geometry with
   `xwininfo` (as above).
2. You launch the capture in the background with a long safety cap and mouse drawn:
   `ffmpeg -y -video_size WxH -f x11grab -framerate 30 -draw_mouse 1 -i :0.0+X,Y -t 3600 … out.mp4`
   (run_in_background), confirm it's running, then tell the user **"можно работать"**.
3. User performs the scripted route (agree it first), then says **"готово"**; you stop it gracefully
   with **`pkill -INT -f x11grab`** (SIGINT, so ffmpeg finalizes the mp4 — a plain kill/SIGTERM can
   leave a broken moov atom). The background task reports a non-zero exit on SIGINT — that's expected.
4. The result is a real capture with its own browser chrome + real address bar → embed as-is (PiP
   colour-scheme exception), as a PiP over the source-detail app context (light scrim), NOT a full
   takeover — the app "source context" stays visible around it (`01_51_craigslist-light.html`).

**Editing the raw tour into a tight PiP** (`ffmpeg` segment + speed-ramp + concat): cut the take into
segments, apply `setpts=PTS/<speed>` per segment, and `concat`. Hold the **start and transition
positions at 1×** (so the viewer registers "we're in SF Bay", "now Washington DC", "picking
software"); **speed up the boring parts** (page scroll, page loads) at 3–4×; and **cut out unneeded
motion entirely** (e.g. jump straight to the destination page instead of showing the scroll to a
menu). End on an unhurried 1×–2× scan of the result list. See `scratchpad` recipe: per-segment
`ffmpeg -ss IN -t DUR -vf "setpts=PTS/SPD,scale=WxH" …` then `concat`. A ~73s raw take edited down
to ~9s this way. Iterate on `PIP_AT`/segment holds against the narration until the flow lands under
the right phrases.

### Zoom in before recording, don't rely on cropping after

"Shot size, focus, and dynamics" (close/large framing) applies to live captures too, but a normal
desktop/browser/terminal at its regular working size is far too small and detail-dense for a video
frame — text, DevTools panels, and terminal output are sized for a monitor viewed at arm's length,
not for a compressed video beat. **Increase zoom/font-size at the source before recording**, don't
capture at normal size and crop/scale up afterward — an upscaled crop from a normal-resolution
capture is soft and pixelated, while recording already-zoomed content stays sharp:

- **Page content** (app capture, the target site's own DOM, most of a site-inspection beat) is
  fully scriptable, no manual Chrome setup needed: launch Puppeteer with
  `--force-device-scale-factor=2` (or higher) and/or a `page.setViewport` smaller than the physical
  window so content renders larger. Can even be **animated during the recording itself** — a
  scripted CSS `transform: scale()` / `zoom` punch-in onto one specific element, timed to the
  beat's `.ass`-derived duration — which fits "fast, punchy motion" better than a static zoomed
  frame, so prefer that over a fixed zoom level when the beat is about one specific detail.
- **The DevTools panel UI itself** is host chrome, not page DOM — `page.evaluate`/CSS zoom has no
  effect on it. Two options: a one-time manual zoom (focus the DevTools panel, `Ctrl +`) which
  Chrome persists in the profile across sessions, so it's a single setup step, not a per-recording
  one; or script it via CDP `Input.dispatchKeyEvent` sending `Ctrl+=` after opening DevTools if a
  fully hands-off pipeline matters more than the extra fragility.
- **Terminal** — increase the terminal emulator's font size (not the OS-wide font) before opening
  it for the capture; a dedicated larger-font profile for recordings is fine.
- Then `x11grab` the same real window geometry as before — the zoom happened inside the window, so
  the capture recipe above doesn't change, only what's rendered inside that window.

## Narration is spoken, not printed

When a `.claude/doc/video-presentation/` slide is built for a specific line of voiceover,
**do not print that line verbatim on the slide.** The audio already carries the full sentence; the
slide's job is a short, title-style label the eye can take in almost instantly while listening —
not a second reading of the same text. Prefer an existing project shorthand over inventing new
wording: e.g. for a sentence about extracting/normalizing/indexing hostile sources, the slide title
became `Extract → Transform → Load` (the ETL vocabulary already established in
`job-crawler-demo-slides-dark.html`'s "mapping" slide), styled at title size (not body-copy size),
with a thin `.title-rule` separator marking where the title ends and the supporting visualization
(the actual pipeline/diagram) begins. If no existing shorthand fits, write one short label (2-5
words, or a `Word → Word → Word` formula) rather than compressing the narration sentence.

Any edit to a `.claude/doc/slides/` file must be followed by regenerating its PDF as part of that
same step (see below). Files in `.claude/doc/video-presentation/` normally have **no PDF
counterpart** — a print-to-pdf only captures one frozen animation frame, which defeats the point of
an animated slide — so skip PDF regeneration there unless the user explicitly asks for a static
frame export.

Each `.claude/doc/slides/` deck's `@page { size: 1280px 720px; margin: 0; }` rule already fixes the
correct page size (confirmed live: renders as 7 pages at 960×540pt, one per `<section class="slide">`)
— no extra flags needed to get one page per slide at the right dimensions.

## Command

Applies to decks in `.claude/doc/slides/`. Run from the repo root, one call per file:

```bash
google-chrome --headless --disable-gpu --no-sandbox \
  --print-to-pdf=.claude/doc/slides/job-crawler-demo-slides-dark.pdf \
  --no-pdf-header-footer \
  "file://$(pwd)/.claude/doc/slides/job-crawler-demo-slides-dark.html"

google-chrome --headless --disable-gpu --no-sandbox \
  --print-to-pdf=.claude/doc/slides/job-crawler-demo-slides-light.pdf \
  --no-pdf-header-footer \
  "file://$(pwd)/.claude/doc/slides/job-crawler-demo-slides-light.html"
```

- `--no-sandbox` is needed when running as the sandboxed/CI user this environment normally runs
  as — omit it if running as a regular desktop user where the Chrome sandbox works normally.
- `--no-pdf-header-footer` strips Chrome's default page-number/date/URL header-footer, which the
  slides' own `@page` styling doesn't expect.
- `google-chrome` (binary at `/usr/bin/google-chrome`) was confirmed present in this environment;
  `chromium`/`chromium-browser` is a drop-in substitute if only that's installed.

## Verifying the result

```bash
pdfinfo .claude/doc/slides/job-crawler-demo-slides-dark.pdf
```

Expect `Pages: 7` (one per `<section class="slide">` — recount if slides were added/removed) and
`Page size: 960 x 540 pts` (the `1280x720` `@page` size converted to points). A mismatch here
usually means the `@page` rule was edited or removed.

## Exporting an animated slide as video (for Kdenlive/other editors)

**Only render video after the user has approved the HTML version of that slide.** Editing the HTML
(new copy, layout change, retimed loop) is cheap to iterate on and to review as a screenshot/live
preview; re-encoding to `.webm`/`.mp4` is not, and a stale render left in the repo after a follow-up
HTML edit is worse than no render at all. Show or describe the HTML change and get an explicit go-
ahead (or a direct "render/export the video" request that implies the current HTML is final) before
running `record-slide.js` — don't chain a render onto an HTML edit automatically just because the
user asked for video earlier in the conversation.

Applies to `.claude/doc/video-presentation/` slides. Same default as the HTML itself (see
"Default to light only; dark is opt-in per slide" above): **render only the `*-light.html` slide to
video by default.** Only render/export the `*-dark.html` twin — and only if it already exists —
when the user explicitly asks for the dark version, of that slide's video specifically or of the
slide in general ("dark for this"); a dark-HTML request earlier in the conversation does not by
itself mean render its video too, ask if unclear.

An editor like Kdenlive can't import raw HTML, so render the slide to a real video file first — `scripts/record-slide.js` (this skill's
own helper) drives headless Chrome via Puppeteer (already a hoisted dependency at the repo root,
from `apps/api/package.json`) and uses its built-in `page.screencast()`, which shells out to
`ffmpeg` (confirmed present at `/usr/bin/ffmpeg` in this environment) to write a `.webm` directly —
no virtual display or screen-capture tooling needed, since it's a headless capture of the page's
own render, not of a visible window.

**The final `.mp4` lives in `.claude/doc/video-presentation/videos/`** — same basename as the
HTML (`<slide>-light.html` → `videos/<slide>-light.mp4`), but a separate subfolder from the HTML
source, not next to it. This folder is git-ignored (`.gitignore`: `.claude/doc/video-presentation/
videos/` and a blanket `*.mp4`) — rendered clips are large binaries fully reproducible from the
HTML via this same recipe, so they aren't committed; only the `.html` source is tracked. The
intermediate `.webm` is throwaway and belongs in the scratchpad, never the repo either.

```bash
node .claude/skills/video-presentation/scripts/record-slide.js \
  .claude/doc/video-presentation/<slide>.html \
  /tmp/<slide>.webm \
  11
```

The third argument is seconds to record — default `11` (one full loop of this project's `10s`
animation timeline, see "Narration is spoken, not printed" above, plus a `1s` pad for clean in/out
points to trim in the editor). Recompute it if a slide's loop duration differs from `10s`.

Then convert to `.mp4` (H.264) — Kdenlive accepts `.webm`/VP9 too, but `.mp4`/H.264 is the safer
default across editors and versions — writing directly into the slide's own folder:

```bash
ffmpeg -y -i /tmp/<slide>.webm -c:v libx264 -pix_fmt yuv420p -crf 18 -preset veryfast -r 25 \
  .claude/doc/video-presentation/videos/<slide>.mp4
```

`-r 25` matches this project's Kdenlive timeline framerate — keep the two in sync if the
Kdenlive project's fps ever changes.

**Capture/verify gotchas** (hit repeatedly this session):
- The `.webm` that `page.screencast()` / `x11grab` writes often has **`duration=N/A`** (no container
  duration metadata). `ffmpeg -sseof`/`ffprobe` then seek wrong (return the *first* frame), so a
  "final frame" check silently shows the start. **Convert to `.mp4` first**, then extract frames /
  seek — the mp4 has a real duration. Verifying beats = convert → `ffmpeg -ss <t> -i out.mp4
  -frames:v 1 -update 1 f.png` at each sub-timecode boundary.
- `record-app-walkthrough.js` captures at `deviceScaleFactor:2`, so its base `.webm` is ~2560×1440;
  the wrapper embeds it in a 1280×720 slide and the final render downscales cleanly — expect the
  base clip to be double-resolution, that's intended (crisper downscale), not a bug.
- Wall-clock time of a headless capture ≫ the clip length (ffmpeg finalize on a 2560×1440 screencast
  can add ~20s after the scripted run). Judge length by the **rendered mp4 duration**, not how long
  the command took.

Import the resulting `.mp4` into Kdenlive via Project Bin → Add Clip (or drag-and-drop) like any
other video clip; it loops cleanly since the animation's own CSS/SMIL timeline already resets on a
fixed cycle, so trimming to any `10s` window from a stable start point reproduces the full loop.
