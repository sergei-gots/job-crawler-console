// Base capture for beat 01_00 "four real-world sources / each with its own challenge".
// /about (brief ETL callback) -> click Sources -> /sources list of 4 sources, gentle cursor
// pan down the rows. Captured app-only (cursor baked in); the drawn browser frame + address bar
// are added by the wrapper slide 01_00_sources-overview-light.html.
// Nav to /sources is timed at ~2.0s so the wrapper can swap the address bar text there.
module.exports = {
  seconds: 6.4,
  startPath: '/about',
  viewport: { width: 1280, height: 680 },
  run: async ({ click, moveTo, waitForPath, wait, log }) => {
    // /about establishing callback (stack + ETL card already shown in 00_18)
    await wait(1400);
    // navigate to Sources
    await click({ text: 'Sources', tag: 'a', exact: true }, { after: 300 });
    await waitForPath('/sources');
    await wait(900); // let the 4 source rows render
    // gentle pan across the four source rows (acknowledging "four sources, each its own challenge")
    await moveTo({ text: 'RemoteOK', tag: 'a', exact: true }, { steps: 20, settle: 500 });
    await moveTo({ text: 'WeWorkRemotely', tag: 'a', exact: true }, { steps: 18, settle: 500 });
    await moveTo({ text: 'Habr Career', tag: 'a', exact: true }, { steps: 18, settle: 500 });
    await moveTo({ text: 'Craigslist', tag: 'a', exact: true }, { steps: 18, settle: 700 });
    log('done');
  },
};
