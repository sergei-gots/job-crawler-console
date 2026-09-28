// Base capture for beat 01_35 "WeWorkRemotely: headless Puppeteer got fingerprinted and blocked
// after a single detail-page navigation -> switched to their official RSS feed, pulled via Axios".
// /sources -> click WeWorkRemotely -> detail: Implementation (Puppeteer listing + RSS via Axios),
// then dwell on the SECOND problem/solution pair — "PROBLEM - headless session fingerprinted" and
// "FIX v2 - category RSS feed via Axios" (the RSS-feed XML PiP is added by the wrapper here).
// Nav to /sources/2 ~1.8s in.
module.exports = {
  seconds: 16.6,
  startPath: '/sources',
  viewport: { width: 1280, height: 680 },
  run: async ({ click, moveTo, waitForPath, wait, log }) => {
    await wait(900);
    await click({ text: 'WeWorkRemotely', tag: 'a', exact: true }, { after: 300 });
    await waitForPath('/sources/2');
    await wait(1000);
    // Implementation: Puppeteer (listing — Cloudflare-gated) + RSS feed via Axios
    await moveTo({ text: 'Implementation:', tag: 'span' }, { steps: 20, settle: 1700 });
    // the real twist: headless session got fingerprinted after the first detail fetch
    await moveTo({ text: 'PROBLEM - headless session fingerprinted', tag: 'button' }, { steps: 22, settle: 3200 });
    // the fix: switch the detail pass to the category RSS feed via Axios (RSS PiP shows here)
    await moveTo({ text: 'FIX v2 - category RSS feed via Axios', tag: 'button' }, { steps: 18, settle: 3600 });
    log('done');
  },
};
