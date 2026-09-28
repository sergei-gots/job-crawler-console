# Final presentation script

Hello. Today I'll show you a full-stack data pipeline designed to aggregate unstructured data from very different websites into one searchable index.

The goal is to demonstrate the engineering required to crawl structurally different and sometimes hostile sites, normalize the data, and make it searchable.

The domain I chose is IT job vacancies.

The architecture is a classic ETL pipeline.

The backend is Node.js, Express and TypeScript.

Extraction: Axios + Cheerio, or Puppeteer.

Transformation: everything is normalized into a single Vacancy model.

Loading: Redis as a cache, and then Elasticsearch for faceted search.

And PostgreSQL stores metadata, crawl state and logs.

The main goal is to test a specific hypothesis:

can we crawl completely different websites using a limited, unified set of tools?

To answer this, I rely on one key design choice: the Strategy pattern.

I selected four real-world sources, each with its own challenge:

1. Habr Career: the easiest case. It has clean server-rendered pages; I extract data with Axios from a stable JSON-LD block and fetch the details in a second pass.

2. RemoteOK: gated behind Cloudflare. Standard HTTP requests return a 403 error. To bypass this, I use Puppeteer with a real desktop user-agent and browser fingerprint.

3. WeWorkRemotely: headless Puppeteer got fingerprinted and blocked after a single detail-page navigation. So I switched to their official RSS feed, which isn't gated at all and is pulled via Axios.

4. Craigslist: this is not a tech job board, but a general classifieds site. To align it with the other sources, I narrowed the scope down to the IT category in a few selected cities.

Some sources have sub-listings, which are crawled separately.

Mapping: there are two kinds of mapping here.

The ETL mapping happens inside each Strategy – it converts site-specific fields into Vacancy.

The Elasticsearch mapping is the index schema. And it is versioned: if the schema changes, the index is rebuilt from scratch.

Here is the crawler running. It is deliberately polite – rate limits and jitter on every source.

You can also compare the strategies side by side on the Sources page.

And this is the search interface. Data from all four sources is already in one index.

Free-text search, highlighting, and facets for specialization, seniority, remote status, location and company.

To add another source, we only need to implement the scraping and the source-specific mapping.

The rest of the pipeline stays the same.

Thanks for watching – the source code is on my GitHub.

