// Base capture for beat 02_06 "Some sources have sub-listings / which are crawled separately".
// /sources list: cursor clicks the +/- expand toggles on WeWorkRemotely then Craigslist, revealing
// their nested listing rows (WWR: Full-Stack/Backend; Craigslist: 5 cities) — each nested row has
// its own StatusBadge and Start/Stop, i.e. each listing is crawled separately. App-only capture.
module.exports = {
  seconds: 6.5,
  startPath: '/sources',
  viewport: { width: 1280, height: 680 },
  run: async ({ click, wait, log }) => {
    await wait(900);
    // expand WeWorkRemotely's listings (first "Show listings" toggle)
    await click('button[title="Show listings"]', { after: 900 });
    // now the only remaining "Show listings" toggle is Craigslist's — expand it too
    await click('button[title="Show listings"]', { after: 1600 });
    await wait(1600);
    log('done');
  },
};
