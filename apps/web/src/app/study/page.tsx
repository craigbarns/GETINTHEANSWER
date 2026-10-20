import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { formatScanDate, getBenchmarkStats } from "@/lib/city-scans";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "AI Visibility Benchmark: do four AI engines recommend the same local businesses?";

export function generateMetadata(): Metadata {
  const stats = getBenchmarkStats();
  const description = stats
    ? `We asked ChatGPT, Claude, Gemini and Perplexity the same ${stats.scans} local questions and recorded every business they named. ${stats.soleMentionShare}% of businesses were named by only one engine.`
    : "Measured comparison of the local businesses ChatGPT, Claude, Gemini and Perplexity recommend.";

  return {
    title: TITLE,
    description,
    alternates: { canonical: "/study" },
    openGraph: { title: TITLE, description, type: "article", url: `${SITE_URL}/study`, siteName: SITE_NAME },
  };
}

export default function StudyPage() {
  const stats = getBenchmarkStats();
  if (!stats) notFound();

  // Dataset markup: this page exists to be cited, so describe it as data.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        name: TITLE,
        description: `Businesses named by ChatGPT, Claude, Gemini and Perplexity in response to ${stats.scans} local recommendation questions across ${stats.cities} US cities and ${stats.industries} industries.`,
        url: `${SITE_URL}/study`,
        creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        dateModified: stats.lastScanDate,
        measurementTechnique:
          "Single-sample live query of each engine with web retrieval enabled; business names extracted from the engine's own answer; directories and marketplaces excluded.",
      },
      {
        "@type": "Article",
        headline: TITLE,
        datePublished: stats.firstScanDate,
        dateModified: stats.lastScanDate,
        mainEntityOfPage: `${SITE_URL}/study`,
        inLanguage: "en-US",
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label={`${SITE_NAME}, home`}>
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">{SITE_NAME}</span>
          </Link>
          <Button asChild className="ml-auto rounded-full px-5">
            <Link href="/onboarding">
              Free AI visibility scan <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">
          Benchmark · updated {formatScanDate(stats.lastScanDate)}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
          Four AI engines, the same question, different answers.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-foreground/70">
          We asked ChatGPT, Claude, Gemini and Perplexity the same {stats.scans} local recommendation
          questions across {stats.cities} US cities and {stats.industries} industries, and recorded
          every business each one named.
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: stats.scans, label: "questions asked" },
            { value: stats.engineAnswers, label: "engine answers recorded" },
            { value: stats.distinctBusinesses, label: "business mentions" },
            { value: `${stats.soleMentionShare}%`, label: "named by only one engine" },
          ].map((tile) => (
            <div key={tile.label} className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
              <p className="text-3xl font-extrabold tracking-[-0.03em]">{tile.value}</p>
              <p className="mt-1.5 text-sm font-semibold text-foreground/60">{tile.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em]">The finding</h2>
          <p className="mt-4 text-lg text-foreground/80">
            <strong className="text-foreground">
              {stats.soleMentionShare}% of the businesses named were named by a single engine.
            </strong>{" "}
            Only {stats.unanimousShare}% were named by every engine that answered. Asked the same
            question on the same day, the four engines largely recommend different companies.
          </p>
          <p className="mt-4 text-foreground/70">
            So &quot;being recommended by AI&quot; is not one status. A business can be the first name
            ChatGPT gives and be absent from Perplexity entirely. Checking one engine tells you almost
            nothing about the others, and a business that only checks ChatGPT is measuring roughly a
            quarter of the surface its customers use.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em]">How generous each engine is</h2>
          <p className="mt-3 text-foreground/70">
            Engines differ in how many businesses they are willing to name at all — which changes how
            hard it is to appear in each.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-foreground/10 bg-white shadow-sm">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-foreground/10 text-foreground/60">
                <tr>
                  <th className="px-5 py-3 font-bold">Engine</th>
                  <th className="px-5 py-3 font-bold">Questions answered</th>
                  <th className="px-5 py-3 font-bold">Businesses named</th>
                  <th className="px-5 py-3 font-bold">Average per answer</th>
                </tr>
              </thead>
              <tbody>
                {stats.engines.map((engine) => (
                  <tr key={engine.engine} className="border-b border-foreground/5 last:border-0">
                    <td className="px-5 py-3 font-bold text-foreground">{engine.engine}</td>
                    <td className="px-5 py-3 text-foreground/70">{engine.answers}</td>
                    <td className="px-5 py-3 text-foreground/70">{engine.namesGiven}</td>
                    <td className="px-5 py-3 font-semibold text-foreground">{engine.averagePerAnswer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-foreground/10 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em]">Method</h2>
          <p className="mt-3 text-foreground/70">
            Stated in full so anyone can reproduce or dispute it.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-foreground/80">
            <li>
              <strong className="text-foreground">Questions.</strong> One question per industry and
              city, phrased the way a customer would ask it — for example &quot;Who is the most
              reliable emergency plumber in Phoenix, AZ for a burst pipe?&quot;. Every question is
              printed on its own city page.
            </li>
            <li>
              <strong className="text-foreground">Engines.</strong> ChatGPT, Claude, Gemini and
              Perplexity, each queried with live web retrieval enabled. Without retrieval a model
              answers from training data and names no local business at all, which measures memory
              rather than recommendation.
            </li>
            <li>
              <strong className="text-foreground">Extraction.</strong> Business names are taken from
              the engine&apos;s own answer. Directories, review sites and marketplaces — Yelp, Google,
              Angi, Thumbtack and the like — are excluded, because they are not businesses a customer
              hires.
            </li>
            <li>
              <strong className="text-foreground">Sampling.</strong> Each figure is a single-sample
              snapshot taken between {formatScanDate(stats.firstScanDate)} and{" "}
              {formatScanDate(stats.lastScanDate)}. Engine answers vary between runs; asking the same
              question tomorrow can return a different set. These numbers describe what was said on
              those dates, not a long-run average.
            </li>
            <li>
              <strong className="text-foreground">Scope.</strong> {stats.cities} US cities,{" "}
              {stats.industries} local service industries, {stats.scans} questions,{" "}
              {stats.engineAnswers} engine answers. No comparison against Google Maps rankings was
              made, and none is claimed.
            </li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-emerald-600/20 bg-emerald-50/60 p-7">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em]">Check your own business</h2>
          <p className="mt-3 text-foreground/75">
            The same four engines, the questions your customers actually ask, and the competitors named
            instead of you. Free, no account.
          </p>
          <Button asChild size="lg" className="mt-5 rounded-full">
            <Link href="/onboarding">
              Run a free scan <ArrowRight className="ml-2 size-5" aria-hidden="true" />
            </Link>
          </Button>
        </section>

        <p className="mt-10 text-sm text-foreground/60">
          Per-city results, including the exact question and every business named:{" "}
          <Link className="font-semibold text-emerald-700 hover:underline" href="/ai-seo-for">
            browse all industries and cities
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
