import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Gauge,
  Info,
  MapPin,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sample AI Visibility Report — See What You Get",
  description:
    "A complete example of a GetInTheAnswer report: AI visibility score, coverage by engine, competitor benchmark, website audit and the prioritized action plan. Illustrative sample for a fictional business.",
  alternates: {
    canonical: "/sample-report",
  },
  openGraph: {
    title: "Sample AI Visibility Report — GetInTheAnswer",
    description:
      "See exactly what a GetInTheAnswer report contains before you run your own free scan.",
    url: `${SITE_URL}/sample-report`,
    type: "article",
  },
};

const SAMPLE = {
  companyName: "Lakeside Kitchen Co.",
  city: "Austin, TX",
  industry: "Kitchen remodeling",
  website: "lakesidekitchen.com",
  score: 68,
  totalChecks: 30,
  brandMentions: 20,
  questionCount: 10,
  topCompetitor: "Hill Country Cabinetry",
  topCompetitorMentions: 26,
};

const engineStats = [
  { engine: "ChatGPT", mentions: 8, total: 10, color: "bg-emerald-500" },
  { engine: "Perplexity", mentions: 7, total: 10, color: "bg-lime-500" },
  { engine: "Claude", mentions: 5, total: 10, color: "bg-amber-400" },
];

const siteChecks = [
  {
    key: "schema",
    label: "LocalBusiness structured data",
    passed: false,
    detail: "No LocalBusiness schema found on the homepage. Engines can't verify your address, hours or service area.",
  },
  {
    key: "nap",
    label: "Name, address and phone visible",
    passed: true,
    detail: "Your NAP block is present in the footer and matches the format used by directories.",
  },
  {
    key: "faq",
    label: "Answer-shaped content",
    passed: false,
    detail: "No page answers customer questions directly. Engines prefer content written as questions and answers.",
  },
  {
    key: "services",
    label: "Services and service area described",
    passed: true,
    detail: "Six services are listed, but only one names a neighborhood or suburb.",
  },
];

const queryRows = [
  {
    question: "Which contractor would you recommend to remodel a kitchen in Austin?",
    engine: "ChatGPT",
    mentioned: true,
    instead: "Hill Country Cabinetry, Barton Creek Kitchens",
  },
  {
    question: "Which contractor would you recommend to remodel a kitchen in Austin?",
    engine: "Claude",
    mentioned: false,
    instead: "Hill Country Cabinetry, Congress Ave Remodeling",
  },
  {
    question: "Best custom cabinet makers near downtown Austin?",
    engine: "Perplexity",
    mentioned: true,
    instead: "Hill Country Cabinetry",
  },
  {
    question: "Who does affordable kitchen renovations in Austin?",
    engine: "ChatGPT",
    mentioned: false,
    instead: "Barton Creek Kitchens, Zilker Home Studio",
  },
  {
    question: "I need a kitchen remodeler in Austin who handles permits — any suggestions?",
    engine: "Claude",
    mentioned: false,
    instead: "Congress Ave Remodeling",
  },
  {
    question: "Top-rated kitchen remodeling companies in Austin, TX?",
    engine: "Perplexity",
    mentioned: true,
    instead: "Hill Country Cabinetry, Barton Creek Kitchens",
  },
];

const recommendations = [
  {
    title: "Publish a local FAQ page",
    description:
      "Answer the eight questions your customers actually ask — timelines, permits, budget ranges, neighborhoods you serve. Engines quote answer-shaped content far more readily than marketing copy.",
    priority: "High",
    impact: "+8 pts",
    priorityClass: "bg-red-50 text-red-700",
  },
  {
    title: "Add LocalBusiness structured data",
    description:
      "Mark up your name, address, phone, hours, price range and service area so engines can verify the business behind the website.",
    priority: "High",
    impact: "+3 pts",
    priorityClass: "bg-red-50 text-red-700",
  },
  {
    title: "Name your service areas on the Services page",
    description:
      "List the suburbs and neighborhoods you cover. Half the tested questions were neighborhood-specific, and your site names only one.",
    priority: "Medium",
    impact: "+1 pt",
    priorityClass: "bg-amber-50 text-amber-800",
  },
];

const scoreHistory = [
  { date: "05-12", score: 51 },
  { date: "05-19", score: 55 },
  { date: "05-26", score: 60 },
  { date: "06-02", score: 62 },
  { date: "06-09", score: 68 },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Sample report", item: `${SITE_URL}/sample-report` },
      ],
    },
    {
      "@type": "WebPage",
      name: "Sample AI Visibility Report",
      description:
        "A complete illustrative example of a GetInTheAnswer AI visibility report for a local business.",
      url: `${SITE_URL}/sample-report`,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  ],
};

const mentionRate = Math.round((SAMPLE.brandMentions / SAMPLE.totalChecks) * 100);
const competitorGap = SAMPLE.topCompetitorMentions - SAMPLE.brandMentions;
const passedChecks = siteChecks.filter((check) => check.passed).length;

export default function SampleReportPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center px-5 sm:px-8">
          <Link className="flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, home">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
          <Button asChild className="ml-auto rounded-full px-5">
            <Link href="/onboarding">
              Run my free scan
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl space-y-6 px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <Link className="flex items-center gap-1.5 transition-colors hover:text-foreground" href="/">
            <ArrowLeft className="size-4" aria-hidden="true" /> Home
          </Link>
          <span className="text-foreground/20">/</span>
          <span className="text-foreground">Sample report</span>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-primary/25 bg-white p-5 sm:p-6">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-200 text-primary">
            <Info className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">
              This is an illustrative sample report
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {SAMPLE.companyName} is a fictional business, and every score, competitor and answer below was written
              to show the layout of the report — not measured. Your own report is built from live answers returned by
              the AI engines about your real business, in your real city.
            </p>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] bg-[#173b35] p-6 text-white shadow-xl shadow-primary/10 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-lime-300/12 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-lime-300 text-[#173b35] hover:bg-lime-300">
                  <Check className="mr-1 size-3" aria-hidden="true" /> Analysis complete
                </Badge>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white/55">
                  <MapPin className="size-3.5" aria-hidden="true" /> {SAMPLE.city} · {SAMPLE.industry}
                </span>
              </div>
              <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">
                Here&apos;s how AI engines see {SAMPLE.companyName}.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                {SAMPLE.questionCount} customer questions tested across {engineStats.length} AI engines, for{" "}
                {SAMPLE.totalChecks} answer checks.
              </p>
              <p className="mt-2 text-xs font-semibold text-white/55">
                {SAMPLE.website} — a single-sample snapshot; AI answers can vary between runs.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/7 p-5 text-center backdrop-blur sm:flex-row sm:gap-5 sm:p-4 sm:pr-6 sm:text-left">
              <div
                className="flex size-28 shrink-0 items-center justify-center rounded-full p-2"
                style={{ background: `conic-gradient(#bef264 ${SAMPLE.score * 3.6}deg, rgba(255,255,255,.12) 0deg)` }}
                aria-label={`Visibility score ${SAMPLE.score} out of 100`}
              >
                <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#173b35]">
                  <span className="text-4xl font-black tracking-[-0.06em]">{SAMPLE.score}</span>
                  <span className="text-[11px] font-bold text-white/75">OUT OF 100</span>
                </div>
              </div>
              <div className="max-w-56 sm:max-w-40">
                <p className="font-extrabold text-lime-300">Solid, not safe</p>
                <p className="mt-2 text-sm leading-5 text-white/75">
                  You appear in most answers, but the market leader is cited more often.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Key metrics">
          <Card className="border-foreground/8 bg-white py-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">Mentions</span>
                <Target className="size-5 text-emerald-700" aria-hidden="true" />
              </div>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em]">
                {SAMPLE.brandMentions}
                <span className="text-base font-bold text-muted-foreground">/{SAMPLE.totalChecks}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Your brand is cited in {mentionRate}% of tests.</p>
            </CardContent>
          </Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">Leading competitor</span>
                <Trophy className="size-5 text-amber-500" aria-hidden="true" />
              </div>
              <p className="mt-4 truncate text-2xl font-black tracking-[-0.04em]">{SAMPLE.topCompetitor}</p>
              <p className="mt-2 text-sm text-muted-foreground">{SAMPLE.topCompetitorMentions} mentions detected.</p>
            </CardContent>
          </Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">Competitive gap</span>
                <TrendingUp className="size-5 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em]">-{competitorGap}</p>
              <p className="mt-2 text-sm text-muted-foreground">mentions behind the leader.</p>
            </CardContent>
          </Card>
          <Card className="border-foreground/8 bg-lime-200 py-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary/70">Priority actions</span>
                <FileText className="size-5 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em]">{recommendations.length}</p>
              <p className="mt-2 text-sm text-primary/70">Your roadmap is ready.</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Coverage by engine</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Where are you visible?</h2>
              </div>
              <Gauge className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-7 space-y-6">
              {engineStats.map(({ engine, mentions, total, color }) => {
                const rate = Math.round((mentions / total) * 100);
                return (
                  <div key={engine}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-extrabold">
                        <span className={`size-2.5 rounded-full ${color}`} />
                        {engine}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {mentions}/{total} · {rate}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-foreground/7">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Weekly tracking</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Score history</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Pro re-scans every week, so you can see whether the actions you shipped moved the score.
                </p>
              </div>
              <TrendingUp className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-7 flex items-end gap-3 overflow-x-auto pb-2" aria-label="Visibility score over time">
              {scoreHistory.map((point) => (
                <div className="flex min-w-14 flex-col items-center gap-2" key={point.date}>
                  <span className="text-sm font-extrabold tabular-nums">{point.score}</span>
                  <div className="flex h-28 w-9 items-end overflow-hidden rounded-lg bg-foreground/6">
                    <div className="w-full rounded-lg bg-emerald-600" style={{ height: `${point.score}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground">{point.date}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Website audit</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">
                Your site vs what AI engines need
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We fetch your homepage and check the signals engines use to verify and recommend a business.
              </p>
            </div>
            <Badge variant="outline" className="w-fit bg-white px-3 py-1.5">
              {passedChecks}/{siteChecks.length} signals present
            </Badge>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {siteChecks.map((check) => (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 ${check.passed ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"}`}
                key={check.key}
              >
                <span
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${check.passed ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}
                >
                  {check.passed ? <Check className="size-3.5" aria-hidden="true" /> : <AlertTriangle className="size-3.5" aria-hidden="true" />}
                </span>
                <div>
                  <p className="font-extrabold leading-6">{check.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Action plan</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Your next moves</h2>
            <p className="mt-2 text-muted-foreground">Ranked by urgency and estimated impact.</p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {recommendations.map((recommendation, index) => (
              <article className="rounded-2xl border border-foreground/10 bg-[#f8f8f3] p-5" key={recommendation.title}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${recommendation.priorityClass}`}>
                      {recommendation.priority}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
                      {recommendation.impact}
                    </span>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em]">{recommendation.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{recommendation.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Scan data</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Scan details</h2>
            <p className="mt-2 text-muted-foreground">
              Every question-and-engine check used to calculate the score, with the competitors the engine named
              instead. Six of the {SAMPLE.totalChecks} checks are shown here.
            </p>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-foreground/8">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-[#f3f4ed]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[420px] px-6 py-4 font-extrabold text-foreground">Question tested</TableHead>
                  <TableHead className="font-extrabold text-foreground">Engine</TableHead>
                  <TableHead className="text-center font-extrabold text-foreground">Mention</TableHead>
                  <TableHead className="pr-6 font-extrabold text-foreground">Recommended instead</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queryRows.map((row) => (
                  <TableRow key={`${row.question}-${row.engine}`}>
                    <TableCell className="px-6 py-4 align-top text-sm leading-6 font-medium whitespace-normal">
                      {row.question}
                    </TableCell>
                    <TableCell className="align-top text-sm font-bold">{row.engine}</TableCell>
                    <TableCell className="align-top text-center">
                      {row.mentioned ? (
                        <CheckCircle2 className="inline size-5 text-emerald-600" aria-label="Mentioned" />
                      ) : (
                        <XCircle className="inline size-5 text-red-500" aria-label="Not mentioned" />
                      )}
                    </TableCell>
                    <TableCell className="pr-6 align-top text-sm leading-6 text-muted-foreground whitespace-normal">
                      {row.instead}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-[#173b35] p-7 text-white sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">
              Now run the same report on your business.
            </h2>
            <p className="mt-2 max-w-xl leading-7 text-white/65">
              The free scan gives you your real score, your real engine coverage and your #1 competitor. No credit card.
            </p>
          </div>
          <Button asChild size="lg" className="h-13 shrink-0 rounded-full bg-lime-300 px-6 font-extrabold text-[#173b35] hover:bg-lime-200">
            <Link href="/onboarding">
              Start my free analysis
              <ArrowRight className="ml-2 size-5" aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
