// Base capture for beat 01_20 "RemoteOK: Cloudflare / 403 / Puppeteer real UA + fingerprint".
// /sources -> click RemoteOK -> detail: Implementation (Puppeteer, listing only), then Strategy
// flow — dwell on the red PROBLEM (Cloudflare bot-check / 403) then the FIX (Puppeteer + realistic
// UA). No external PiP: live curl to remoteok no longer 403s (302 loop), so the in-app red problem
// box carries the "403" story (per plan's verified fallback). Nav to /sources/1 ~1.8s in.
module.exports = {
  seconds: 14.5,
  startPath: '/sources',
  viewport: { width: 1280, height: 680 },
  run: async ({ click, moveTo, waitForPath, wait, log }) => {
    await wait(900);
    await click({ text: 'RemoteOK', tag: 'a', exact: true }, { after: 300 });
    await waitForPath('/sources/1');
    await wait(1000);
    // Implementation: Puppeteer (listing only — Cloudflare-gated)
    await moveTo({ text: 'Implementation:', tag: 'span' }, { steps: 20, settle: 1500 });
    // the decision + red PROBLEM box (Cloudflare bot-check, 403)
    await moveTo({ text: 'PROBLEM - Cloudflare bot-check', tag: 'button' }, { steps: 22, settle: 2600 });
    // the FIX: Puppeteer + realistic desktop UA / fingerprint
    await moveTo({ text: 'FIX - Puppeteer + realistic UA', tag: 'button' }, { steps: 18, settle: 2800 });
    log('done');
  },
};
