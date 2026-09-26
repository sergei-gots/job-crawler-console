// Records a self-contained animated slide HTML file (from .claude/doc/video-presentation/)
// to a .webm using Puppeteer's built-in page.screencast() (shells out to ffmpeg, which must be on
// PATH). Convert the result to .mp4 separately for Kdenlive/most editors — see the video-presentation
// skill's "Exporting an animated slide as video" section for the ffmpeg command.
//
// Usage: node record-slide.js <path-to-slide.html> <output.webm> [seconds]
//   seconds defaults to 11 — one full loop of this project's 10s animation timeline plus a
//   1s pad, so there's clean head/tail room to trim from in the editor.
const path = require('path');
const puppeteer = require('puppeteer');

async function record(htmlPath, outPath, seconds) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 720 },
  });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(htmlPath), { waitUntil: 'load' });
  const recorder = await page.screencast({ path: outPath });
  await new Promise((r) => setTimeout(r, seconds * 1000));
  await recorder.stop();
  await browser.close();
  console.log('wrote', outPath);
}

(async () => {
  const [htmlPath, outPath, seconds] = process.argv.slice(2);
  if (!htmlPath || !outPath) {
    console.error('Usage: node record-slide.js <slide.html> <output.webm> [seconds=11]');
    process.exit(1);
  }
  await record(htmlPath, outPath, Number(seconds) || 11);
})();
