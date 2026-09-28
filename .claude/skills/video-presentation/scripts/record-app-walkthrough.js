// Records a LIVE walkthrough of this project's running app (localhost:3000) to a .webm using
// headless Puppeteer + page.screencast() — the "app-walkthrough" content type (see the
// video-presentation SKILL.md). Unlike record-slide.js (which captures a static file:// slide),
// this navigates the real app, performs real interactions (click / scroll / expand / tab-switch),
// and renders a SYNTHETIC MOUSE CURSOR that follows page.mouse so the viewer can see how the app
// is operated. The output is the bare app content with the cursor baked in — no browser chrome and
// no picture-in-picture; those are composited afterward in a wrapper HTML slide (drawn address-bar
// frame + PiP overlays), which record-slide.js then screencasts to the final beat .mp4.
//
// Auth: the app stores its JWT in localStorage under "jobcrawler_token" (entities/session/
// lib/token-storage.ts) and redirects to /login without it. This driver logs in against the API
// and injects the token via evaluateOnNewDocument so it is present BEFORE the app mounts.
//
// Usage: node record-app-walkthrough.js <beat-script.js> <output.webm>
//   beat-script.js is a CommonJS module exporting:
//     module.exports = {
//       seconds,               // total capture length
//       startPath,             // e.g. "/about"
//       viewport,              // optional { width, height } (default 1280x720)
//       run: async (ctx) => {} // ctx: { page, goto, moveTo, click, scrollTo, wait, log }
//     };
//
// Env: APP_URL (default http://localhost:3000), API_URL (default http://localhost:4000),
//      DEMO_EMAIL (default video-demo@example.com), DEMO_PASSWORD (default videodemo123),
//      DEVICE_SCALE (default 2).
const path = require('path');
const puppeteer = require('puppeteer');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:4000';
const DEMO_EMAIL = process.env.DEMO_EMAIL || 'video-demo@example.com';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'videodemo123';
const DEVICE_SCALE = Number(process.env.DEVICE_SCALE || 2);

// Injected into every document before app scripts run: (1) seed the JWT so the app is authed,
// (2) render a cursor sprite that tracks native mouse events dispatched by page.mouse, with a
// click ripple. page.mouse.move(x,y,{steps}) emits intermediate mousemove events, so the sprite
// animates smoothly along the path.
function bootstrapScript(token) {
  return `(() => {
    try { localStorage.setItem('jobcrawler_token', ${JSON.stringify(token)}); } catch (e) {}
    const ensure = () => {
      if (document.getElementById('__wt_cursor')) return;
      const style = document.createElement('style');
      style.textContent = \`
        #__wt_cursor{position:fixed;top:0;left:0;z-index:2147483647;width:22px;height:22px;
          margin:-2px 0 0 -2px;pointer-events:none;transition:transform .05s linear;
          filter:drop-shadow(0 1px 2px rgba(0,0,0,.45));}
        #__wt_ripple{position:fixed;z-index:2147483646;width:14px;height:14px;margin:-7px 0 0 -7px;
          border-radius:50%;background:rgba(18,125,118,.45);pointer-events:none;opacity:0;}
        @keyframes __wt_r{0%{transform:scale(.3);opacity:.7}100%{transform:scale(3.4);opacity:0}}
        /* Hide the Next.js dev-mode overlay/indicator so it never appears in captures. */
        nextjs-portal, #__next-build-watcher, [data-nextjs-toast], [data-next-badge-root]{display:none!important;}
      \`;
      document.head && document.head.appendChild(style);
      const c = document.createElement('div'); c.id = '__wt_cursor';
      c.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M1 1 L1 16 L5 12 L8 19 L11 17.5 L8 11 L14 11 Z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>';
      const r = document.createElement('div'); r.id = '__wt_ripple';
      const add = () => { (document.body||document.documentElement).appendChild(c); (document.body||document.documentElement).appendChild(r); };
      add();
      document.addEventListener('mousemove', (e) => { c.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, true);
      document.addEventListener('mousedown', (e) => {
        r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
        r.style.animation = 'none'; void r.offsetWidth; r.style.animation = '__wt_r .5s ease-out';
      }, true);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensure); else ensure();
    // Re-ensure after client-side (SPA) navigations that may replace body content.
    new MutationObserver(ensure).observe(document.documentElement, { childList: true, subtree: false });
  })();`;
}

async function login() {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  });
  if (!res.ok) throw new Error(`login failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.accessToken;
}

async function run(scriptPath, outPath) {
  const beat = require(path.resolve(scriptPath));
  const vp = beat.viewport || { width: 1280, height: 720 };
  const token = await login();

  const browser = await puppeteer.launch({
    headless: true,
    args: [`--force-device-scale-factor=${DEVICE_SCALE}`, '--no-sandbox'],
    defaultViewport: { width: vp.width, height: vp.height, deviceScaleFactor: DEVICE_SCALE },
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(bootstrapScript(token));

  // Position the cursor off to a neutral spot before anything renders.
  let cursor = { x: vp.width / 2, y: vp.height / 2 };

  const goto = async (p, opts = {}) => {
    const url = p.startsWith('http') ? p : APP_URL + p;
    try {
      await page.goto(url, { waitUntil: opts.waitUntil || 'networkidle2', timeout: opts.timeout || 30000 });
    } catch (e) {
      // external sites (e.g. craigslist) may never reach networkidle; domcontentloaded is enough
      if (opts.waitUntil !== 'domcontentloaded') {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      }
    }
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // Locate an element's viewport-center coords. `target` may be {x,y}, a CSS selector, or
  // {text, tag?, exact?} to find the first element whose trimmed text matches.
  const locate = async (target) => {
    if (typeof target === 'object' && 'x' in target) return { x: target.x, y: target.y };
    if (typeof target === 'object' && 'text' in target) {
      const rect = await page.evaluate(async (t) => {
        const tag = (t.tag || '*').toLowerCase();
        const els = Array.from(document.querySelectorAll(tag));
        const match = els.find((el) => {
          const txt = (el.textContent || '').trim();
          return t.exact ? txt === t.text : txt.includes(t.text);
        });
        if (!match) return null;
        // Prefer the deepest matching descendant to avoid huge container rects.
        let node = match;
        let child = Array.from(node.querySelectorAll(tag)).find((el) => {
          const txt = (el.textContent || '').trim();
          return t.exact ? txt === t.text : txt.includes(t.text);
        });
        while (child) { node = child; child = Array.from(node.querySelectorAll(tag)).find((el) => { const x=(el.textContent||'').trim(); return t.exact ? x===t.text : x.includes(t.text); }); }
        // Scroll into view if off-screen, then let it settle before measuring.
        const r0 = node.getBoundingClientRect();
        if (r0.top < 60 || r0.bottom > window.innerHeight - 20) {
          node.scrollIntoView({ block: 'center', behavior: 'smooth' });
          await new Promise((res) => setTimeout(res, 550));
        }
        const r = node.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }, target);
      if (!rect) throw new Error('text not found: ' + JSON.stringify(target));
      return rect;
    }
    const el = await page.waitForSelector(target, { visible: true, timeout: 8000 });
    await el.evaluate((n) => n.scrollIntoView({ block: 'center' }));
    await wait(300);
    const box = await el.boundingBox();
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  };
  const moveTo = async (target, opts = {}) => {
    const { x, y } = await locate(target);
    await page.mouse.move(x, y, { steps: opts.steps || 25 });
    cursor = { x, y };
    await wait(opts.settle ?? 250);
    return { x, y };
  };
  const click = async (target, opts = {}) => {
    const at = await moveTo(target, opts);
    await page.mouse.down(); await wait(60); await page.mouse.up();
    await wait(opts.after ?? 400);
    return at;
  };
  const waitForPath = async (substr, timeout = 8000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (page.url().includes(substr)) return true;
      await wait(100);
    }
    throw new Error('navigation to ' + substr + ' did not happen (url=' + page.url() + ')');
  };
  const scrollTo = async (selector) => {
    await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, selector);
    await wait(600);
  };
  const log = (...a) => console.log('[beat]', ...a);

  const ctx = { page, goto, locate, moveTo, click, scrollTo, waitForPath, wait, log, cursor: () => cursor, APP_URL };

  await goto(beat.startPath || '/');
  await wait(500);

  const recorder = await page.screencast({ path: outPath });
  const started = Date.now();
  await beat.run(ctx);
  // Pad out to the requested total length if the script finished early.
  const elapsed = (Date.now() - started) / 1000;
  if (beat.seconds && elapsed < beat.seconds) await wait((beat.seconds - elapsed) * 1000);
  await recorder.stop();
  await browser.close();
  console.log('wrote', outPath, `(${((Date.now() - started) / 1000).toFixed(1)}s)`);
}

(async () => {
  const [scriptPath, outPath] = process.argv.slice(2);
  if (!scriptPath || !outPath) {
    console.error('Usage: node record-app-walkthrough.js <beat-script.js> <output.webm>');
    process.exit(1);
  }
  await run(scriptPath, outPath).catch((e) => { console.error(e); process.exit(1); });
})();
