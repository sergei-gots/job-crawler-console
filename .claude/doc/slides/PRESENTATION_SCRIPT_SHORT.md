# Сценарий презентации Job-Crawler-Demo — короткая версия (3:33)

Формат под screening-раскадровку: **Problem & Why (0:40) → Solution (2:35) → Result (0:18)** —
итого 3:33. Таймкоды привязаны к слайдам и живым фрагментам демо. Полная версия со всеми
деталями и без таймкодов (для чтения/печати) — [`PRESENTATION_SCRIPT.md`](PRESENTATION_SCRIPT.md).

Слайды: [`job-crawler-demo-slides-light.html`](job-crawler-demo-slides-light.html) /
[`-dark.html`](job-crawler-demo-slides-dark.html) (7 слайдов) — либо готовые PDF рядом.

**Язык документа:** русский — это рабочий/разработческий язык этого файла (правки, структура,
пометки). **Целевой язык самого доклада — английский**: именно English script внизу — то, что
реально произносится на выступлении. Russian script — рабочая версия для контроля смысла при
написании и правке текста, не основной сценарий выступления.

**Правило этой версии:** ниже — только структура (таймкоды, слайд/действие, тезис одной строкой),
без полного текста реплик — чтобы не дублировать сам текст. Полный текст на каждом языке — только
в разделах "Скрипт целиком" внизу документа.

---

## Act 1 — Problem & Why (0:00–0:40)

**Показываем:** слайд 1.

**Тезис:** любой продукт, зависящий от внешних данных, сталкивается с анти-бот защитой и
разнородной структурой каждого сайта — это классическая задача production data-ingestion; демо
проверяет, закрывает ли её ограниченный набор приёмов без переделки архитектуры под каждый
источник.

## Act 2 — Solution (0:40–3:15)

### 0:40–1:10 — Запуск live crawl (`/sources`)

**Действие:** переключаемся в браузер, `/sources`, кликаем RemoteOK → **Run crawl**.

**Тезис:** RemoteOK за Cloudflare, обычный запрос — 403; запускаем прогон, под капотом Puppeteer с
реальным browser fingerprint; статус → `RUNNING`, идут Execution logs.

### 1:10–1:35 — Разные структуры данных (Слайд 4, краулинг идёт в фоне)

**Показываем:** слайд 4 (только тезисы, без деталей по каждому пункту).

**Тезис:** Habr — server-rendered + отдельный JSON-LD запрос на вакансию; RemoteOK — Cloudflare;
WeWorkRemotely — browser fingerprinted после первого перехода, решение RSS вместо Puppeteer;
Craigslist — generic classifieds, фильтр категорией + fan-out по городам. Один интерфейс
`CrawlStrategy` закрывает все четыре.

### 1:35–1:48 — Результат live crawl

**Действие:** переключаемся на вкладку RemoteOK — статус `COMPLETED`, видно число вакансий.

**Тезис:** за секунды — реальные данные с сайта, защищённого от ботов.

### 1:48–2:08 — Mapping: два значения одного слова (Слайд 5)

**Показываем:** слайд 5.

**Тезис:** ETL mapping — внутри каждой `CrawlStrategy`, до записи в базу: например
`hiringOrganization.name` из JSON-LD у Craigslist → `company`, `jobLocationType ===
"TELECOMMUTE"` у Habr → `isRemote`. Elasticsearch mapping — буквальный ES-термин, схема индекса
(`keyword` под фасеты, `text` под полнотекстовый поиск), определяется на upsert. Два разных
смысла одного слова, оба реально есть в системе.

### 2:08–2:28 — Redis: кэш + вежливость by design

**Тезис:** Redis здесь на два дела — rate-limiter на каждый источник (джиттер между запросами,
чтобы не долбить сайт) и кэш сырых страниц (`page:raw:sourceId:hash`, TTL час), чтобы повторный
краулинг не бил по источнику заново. Кэш можно точечно чистить на уровне одного источника, не
трогая остальные и не сбрасывая rate-limiter.

### 2:28–2:50 — Upsert + Elasticsearch (Слайд 6)

**Показываем:** слайд 6.

**Тезис:** каждая вакансия — один upsert, дедупликация по `sourceId:externalId`, повторный
краулинг не плодит дубли. Схема версионируется: несовместимое изменение — индекс пересоздаётся,
данные возвращаются через повторный краулинг.

### 2:50–3:15 — Search live-демо (`/search`)

**Действие:** переключаемся на подготовленную вкладку `/search`. Вводим `python`, включаем
1–2 facet-чекбокса, начинаем печатать `Je` — показываем autocomplete.

**Тезис:** итог всей цепочки — поиск по всему собранному корпусу: свободный текст, фасеты
(специализация, seniority, remote, локация, компания), autocomplete от двух символов.

## Act 3 — Result (3:15–3:33)

**Показываем:** слайд 7 (если время есть — иначе просто фраза, без слайда).

**Тезис:** один и тот же интерфейс не изменился ни разу на четырёх разных сайтах, anti-bot защита
обойдена не в теории, а прямо здесь, поиск ведёт себя как production — это и есть доказательство.

---

## Скрипт целиком (RU) — рабочая версия

Любой продукт, который зависит от внешних данных — вакансии, цены, объявления — сталкивается с
одной и той же проблемой: сайты не хотят, чтобы их скрейпили, и у каждого своя структура. Это
классическая задача production data-ingestion. Я сделал этот demo, чтобы проверить на практике:
есть ли ограниченный набор приёмов, который закрывает произвольный сайт — без изменения
архитектуры под каждый новый источник.

Вот 4 источника. У RemoteOK — Cloudflare, обычный запрос получает 403. Запускаю прогон прямо
сейчас — под капотом Puppeteer с реальным browser fingerprint. Статус переходит в `RUNNING`, идут
Execution logs.

Четыре сайта — четыре разных проблемы: Habr — server-rendered, но с отдельным JSON-LD запросом на
каждую вакансию. RemoteOK — Cloudflare. WeWorkRemotely — поймали браузер по fingerprint, решение —
RSS вместо Puppeteer. Craigslist — generic classifieds, фильтруем категорией и собираем по
нескольким городам. Один и тот же интерфейс `CrawlStrategy` закрывает все четыре.

Готово. За секунды — реальные данные с сайта, защищённого от ботов.

Здесь стоит развести два значения слова "mapping". Первое — ETL mapping: каждый сайт отдаёт свою
структуру полей, и приведение их к единой модели `RawVacancy` происходит внутри каждой стратегии,
ещё до базы — например, `hiringOrganization.name` из JSON-LD у Craigslist превращается в наше поле
`company`, а `jobLocationType === "TELECOMMUTE"` у Habr — в `isRemote`. Второе значение — mapping в
смысле Elasticsearch: схема индекса, типы полей, `keyword` для фасетов, `text` для полнотекстового
поиска — это уже происходит на upsert'е, отдельная история.

Отдельно — про Redis. Он здесь на два дела: rate-limiter на каждый источник, с джиттером между
запросами, чтобы вежливо не долбить сайт, и кэш сырых страниц с TTL в час, чтобы повторный
краулинг не бил по источнику заново без необходимости. Кэш можно точечно почистить на уровне
одного источника, не трогая остальные и не сбрасывая rate-limiter.

Каждая вакансия попадает в Elasticsearch одним upsert'ом — дедупликация по
`sourceId:externalId`, повторный краулинг не плодит дубли. Схема версионируется: несовместимое
изменение — индекс просто пересоздаётся, данные возвращаются через повторный краулинг.

А вот и итог всей цепочки. Поиск по всему собранному корпусу — свободный текст, фасеты по
специализации, seniority, remote, локации, компании, и autocomplete от двух символов.

Итог: один и тот же интерфейс не изменился ни разу на четырёх разных сайтах, anti-bot защита
обойдена не в теории, а прямо здесь, и поиск ведёт себя как production. Это и есть доказательство.

## Script in full (EN) — target delivery version

Any product that depends on external data — jobs, prices, listings — hits the same problem: sites
don't want to be scraped, and each one has its own structure. That's the classic production
data-ingestion problem. I built this demo to test, in practice, whether a limited set of
techniques can cover an arbitrary site — without redesigning the architecture for every new
source.

Here are the 4 sources. RemoteOK sits behind Cloudflare — a plain request gets a 403. I'm starting
a crawl right now — under the hood it's Puppeteer with a real browser fingerprint. Status flips to
`RUNNING`, execution logs start coming in.

Four sites, four different problems: Habr is server-rendered, but needs a separate JSON-LD request
per vacancy. RemoteOK is behind Cloudflare. WeWorkRemotely fingerprinted the browser after the
first hop — the fix was RSS instead of Puppeteer. Craigslist is generic classifieds — we filter by
category and fan out across cities. The same `CrawlStrategy` interface covers all four.

Done. In seconds, we got real data from a site that's actively protected against bots.

Worth separating two meanings of "mapping" here. First — ETL mapping: every site returns its own
field structure, and translating it into one target shape, `RawVacancy`, happens inside each
strategy, before anything touches the database — for example, `hiringOrganization.name` from
Craigslist's JSON-LD becomes our `company` field, and `jobLocationType === "TELECOMMUTE"` on Habr
becomes `isRemote`. Second — Elasticsearch mapping: the literal ES term, the index schema, field
types, `keyword` for facets, `text` for full-text search — that's defined at upsert time, a
separate story.

Quick note on Redis. It does two jobs here: a per-source rate limiter with jitter, so we're polite
and don't hammer a site, and a raw-page cache with a one-hour TTL, so a re-crawl doesn't hit the
source again unnecessarily. The cache can be cleared for just one source without touching the
others or resetting the rate limiter.

Every vacancy lands in Elasticsearch through a single upsert — deduplicated by
`sourceId:externalId`, so a re-crawl never creates duplicates. The schema is versioned: an
incompatible change just rebuilds the index, and the data comes back through a re-crawl.

And here's the payoff of the whole pipeline. Search across the entire collected corpus — free
text, facets for specialization, seniority, remote/on-site, location, company, and autocomplete
from two characters in.

Bottom line: the same interface never changed across four different sites, the anti-bot defenses
were bypassed live, not in theory, and search behaves like production. That's the proof.
