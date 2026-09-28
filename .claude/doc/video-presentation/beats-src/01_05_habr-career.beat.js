// Base capture for beat 01_05 "Habr Career: easiest / clean server-rendered / Axios + JSON-LD /
// second pass". /sources -> click Habr Career -> detail: Implementation line, then Strategy flow;
// expand the "detail page" (second pass) and "JSON-LD" steps. App-only capture; frame + address
// bar + DevTools JSON-LD PiP are added by the wrapper.
// Nav to /sources/3 happens ~1.6s in (for the wrapper address swap).
module.exports = {
  seconds: 15,
  startPath: '/sources',
  viewport: { width: 1280, height: 680 },
  run: async ({ click, moveTo, scrollTo, waitForPath, wait, log }) => {
    await wait(900);
    await click({ text: 'Habr Career', tag: 'a', exact: true }, { after: 300 });
    await waitForPath('/sources/3');
    await wait(1000);
    // dwell on the Implementation line (Axios + Cheerio, two-pass server-rendered)
    await moveTo({ text: 'Implementation:', tag: 'span' }, { steps: 20, settle: 1600 });
    // Strategy steps are already expanded (detail page uses defaultExpanded) — dwell, don't click
    // (a click would collapse them). Second pass: per-vacancy detail page.
    await moveTo({ text: "Fetch each vacancy's detail page", tag: 'button' }, { steps: 22, settle: 1900 });
    // the JSON-LD extraction step (the "stable JSON-LD block" beat)
    await moveTo({ text: 'Parse JobPosting JSON-LD', tag: 'button' }, { steps: 20, settle: 2800 });
    log('done');
  },
};
