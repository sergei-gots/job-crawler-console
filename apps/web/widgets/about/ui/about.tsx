"use client";

import { useRequireAuth } from "@/entities/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageTitle } from "@/shared/ui/page-title";

const STACK_GROUPS = [
  { label: "Backend", items: "Node.js, Express, TypeScript" },
  { label: "Frontend", items: "Next.js, React, Tailwind CSS" },
  { label: "Crawling", items: "Puppeteer, Axios + Cheerio" },
  { label: "Data", items: "PostgreSQL, Elasticsearch, Redis" },
  { label: "Auth", items: "JWT" },
  { label: "AI enrichment", items: "Claude API" },
];

const PIPELINE_STAGES = [
  {
    emphasis: null,
    rest: "Source",
    detail: "A variety of job sites, each with its own shape - static HTML, Cloudflare-gated JS, RSS, JSON-LD.",
  },
  {
    emphasis: "Extract",
    rest: " (CrawlStrategy)",
    detail: "Per-source parser reads that site's own fields.",
  },
  {
    emphasis: "Transform",
    rest: " (RawVacancy)",
    detail: "Normalized into one common shape - title, company, description, location...",
  },
  {
    emphasis: "Load",
    rest: " (upsert)",
    detail: "Deduped by source + external id, written into the Elasticsearch index.",
  },
  {
    emphasis: null,
    rest: "Search UI",
    detail: "Free text, facets, autocomplete, match highlighting.",
  },
];

export function About() {
  const { token } = useRequireAuth();

  if (!token) return null;

  return (
    <main className="flex flex-1 justify-start p-4 md:p-8">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <PageTitle>About</PageTitle>
        <Card>
          <CardHeader>
            <CardDescription>
              <a
                href="https://github.com/sergei-gots/job-crawler-demo"
                target="_blank"
                rel="noopener noreferrer"
                title="https://github.com/sergei-gots/job-crawler-demo"
                className="text-link hover:underline"
              >
                Job-Crawler-Demo
              </a>{" "}
              - a modular demonstration web application that crawls and aggregates developer/tech
              job vacancies, showcasing a modern web crawling and data processing stack.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 text-sm">
              {STACK_GROUPS.map((group) => (
                <li key={group.label}>
                  <span className="font-medium text-foreground">{group.label}: </span>
                  <span className="text-muted-foreground">{group.items}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Architecture: <span className="font-bold">ETL</span> pipeline
            </CardTitle>
            <CardDescription>
              What actually happens when a source is crawled, end to end.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col">
              {PIPELINE_STAGES.map((stage, index) => (
                <li key={stage.rest}>
                  <div
                    className={`flex gap-3 rounded-lg border-2 border-border p-3 ${
                      stage.emphasis ? "bg-muted" : ""
                    }`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border text-xs font-semibold text-heading">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        {stage.emphasis && <span className="font-bold">{stage.emphasis}</span>}
                        {stage.rest}
                      </p>
                      <p className="text-sm text-muted-foreground">{stage.detail}</p>
                    </div>
                  </div>
                  {index < PIPELINE_STAGES.length - 1 && (
                    <div aria-hidden className="flex justify-center py-1 text-muted-foreground">
                      &darr;
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
