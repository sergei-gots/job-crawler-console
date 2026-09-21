---
name: slides-pdf
description: Use when creating or editing any presentation slide HTML under .claude/doc/slides/ or .claude/doc/video-presentation-slides/, or when a slide needs to be exported as video for Kdenlive/another editor — covers the light/dark-twin convention (light by default, dark on explicit request), the difference between the multi-slide deck folder and the standalone-video-slide folder, the headless-Chrome print-to-pdf command for PDF decks, and the Puppeteer+ffmpeg recipe for turning an animated slide into an .mp4. Triggers on "new slide", "regenerate the slides PDF", "export slides to PDF", "update the PDF", "video slide", "dark for this", "export to video", "Kdenlive", or right after editing any slides HTML file.
---

# Slide decks: light/dark twins, folder convention, and PDF regeneration

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
- **`.claude/doc/video-presentation-slides/`** — standalone, single-purpose slides built for one
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

## Narration is spoken, not printed

When a `.claude/doc/video-presentation-slides/` slide is built for a specific line of voiceover,
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
same step (see below). Files in `.claude/doc/video-presentation-slides/` normally have **no PDF
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

Applies to `.claude/doc/video-presentation-slides/` slides. Same default as the HTML itself (see
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

**The final `.mp4` lives next to its slide in `.claude/doc/video-presentation-slides/`** — same
basename as the HTML (`<slide>-light.html` → `<slide>-light.mp4`) — not in a scratch/temp
directory, so the exported video is committed and discoverable alongside the slide it came from.
The intermediate `.webm` is throwaway and belongs in the scratchpad, never the repo.

```bash
node .claude/skills/slides-pdf/scripts/record-slide.js \
  .claude/doc/video-presentation-slides/<slide>.html \
  /tmp/<slide>.webm \
  11
```

The third argument is seconds to record — default `11` (one full loop of this project's `10s`
animation timeline, see "Narration is spoken, not printed" above, plus a `1s` pad for clean in/out
points to trim in the editor). Recompute it if a slide's loop duration differs from `10s`.

Then convert to `.mp4` (H.264) — Kdenlive accepts `.webm`/VP9 too, but `.mp4`/H.264 is the safer
default across editors and versions — writing directly into the slide's own folder:

```bash
ffmpeg -y -i /tmp/<slide>.webm -c:v libx264 -pix_fmt yuv420p -crf 18 -preset veryfast -r 30 \
  .claude/doc/video-presentation-slides/<slide>.mp4
```

Import the resulting `.mp4` into Kdenlive via Project Bin → Add Clip (or drag-and-drop) like any
other video clip; it loops cleanly since the animation's own CSS/SMIL timeline already resets on a
fixed cycle, so trimming to any `10s` window from a stable start point reproduces the full loop.
