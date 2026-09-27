---
name: video-presentation
description: Use when creating or editing any presentation slide HTML under .claude/doc/slides/ or .claude/doc/video-presentation/, or when a slide needs to be exported as video for Kdenlive/another editor — covers the light/dark-twin convention (light by default, dark on explicit request), the difference between the multi-slide deck folder and the standalone-video-slide folder, the headless-Chrome print-to-pdf command for PDF decks, and the Puppeteer+ffmpeg recipe for turning an animated slide into an .mp4. Triggers on "new slide", "regenerate the slides PDF", "export slides to PDF", "update the PDF", "video slide", "dark for this", "export to video", "Kdenlive", or right after editing any slides HTML file.
---

# Slide decks: light/dark twins, folder convention, and PDF regeneration

## Storyboard document — the working plan for this video

[`.claude/doc/video-presentation/storyboard.md`](../../doc/video-presentation/storyboard.md) is
the authoritative beat-by-beat plan for the presentation being built from `subtitles.ass`: beat
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

`.claude/doc/video-presentation/subtitles.ass` is the source of truth for beat timing — it already
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
  Search page, a crawl in progress with its live log panel). Captured the same way as a schematic
  slide — `record-slide.js` against a `localhost` URL instead of a static HTML file — since the
  app itself renders in a normal headless-capturable page, no devtools chrome involved.
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

```bash
# 1. Get the target window's position/size after opening it on DP-1 (Puppeteer non-headless for a
#    devtools capture, or a normal terminal emulator window for a log/curl capture)
wmctrl -l -G   # lists open windows with x,y,width,height

# 2. Record that exact region for N seconds (x offset must be >= 2560 if the window is on DP-1)
ffmpeg -y -video_size 1280x800 -f x11grab -i :0.0+<x>,<y> -t 12 \
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

Import the resulting `.mp4` into Kdenlive via Project Bin → Add Clip (or drag-and-drop) like any
other video clip; it loops cleanly since the animation's own CSS/SMIL timeline already resets on a
fixed cycle, so trimming to any `10s` window from a stable start point reproduces the full loop.
