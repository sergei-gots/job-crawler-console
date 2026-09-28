// Base capture for beat 01_51 "Craigslist: not a tech board / general classifieds / narrowed to
// the IT category (cat=sof) / in a few selected cities".
// App part: /sources -> Craigslist detail (/sources/6): Implementation + Strategy step that shows
// GET /search/area/<city>?cat=sof. Then SWITCH to the REAL craigslist site (one continuous clip):
// a city classifieds homepage (proves "general classifieds"), then the software/qa/dba (cat=sof)
// results (proves "narrowed to IT category"). Address bar (wrapper) tracks each navigation.
// App part only (~8.5s). The switch to the REAL craigslist site is added by the wrapper as a
// framed screenshot of the live software/qa/dba search results (craigslist's homepage needs JS and
// its JS search UI renders blank headless, but the server-rendered static results list — exactly
// what the Axios+Cheerio strategy parses — is capturable JS-disabled, and is the honest shot).
module.exports = {
  seconds: 8.6,
  startPath: '/sources',
  viewport: { width: 1280, height: 680 },
  run: async ({ click, moveTo, waitForPath, wait, log }) => {
    await wait(800);
    await click({ text: 'Craigslist', tag: 'a', exact: true }, { after: 300 });
    await waitForPath('/sources/6');
    await wait(900);
    await moveTo({ text: 'Implementation:', tag: 'span' }, { steps: 18, settle: 1400 });
    // the strategy step whose title shows the cat=sof scoping + the selected-cities sub-listings
    await moveTo({ text: 'Fetch listing - GET /search/area/<city>?cat=sof', tag: 'button' }, { steps: 20, settle: 2600 });
    log('done');
  },
};
