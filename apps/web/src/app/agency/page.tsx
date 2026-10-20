import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Gauge,
  ListChecks,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroForm } from "@/components/hero-form";
import { LogoMark } from "@/components/logo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "White Label AI SEO Tool for Local Agencies",
  description:
    "Generate white-label ChatGPT & Claude visibility reports for your local clients. Batch scanning and priority support for SEO agencies.",
  alternates: {
    canonical: "/agency",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/agency`,
      url: `${SITE_URL}/agency`,
      name: "White Label AI SEO Tool for Local Agencies | GetInTheAnswer",
      description: "Generate white-label ChatGPT & Claude visibility reports for your local clients. Batch scanning and priority support for SEO agencies.",
    },
  ],
};

const benefits = [
  {
    title: "White-label client reports",
    description: "Export beautiful PDF reports with your agency logo to close more local SEO deals.",
  },
  {
    title: "Batch AI re-scanning",
    description: "Monitor up to 25 business locations automatically every week.",
  },
  {
    title: "Competitor tracking per city",
    description: "Know exactly which competitors ChatGPT recommends instead of your clients.",
  },
];

export default function AgencyPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="group flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, home">
            <LogoMark className="size-9 transition-transform group-hover:-rotate-3" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-7 md:flex" aria-label="Main navigation">
            <Link className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="#features">
              Features
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/#pricing">
              Pricing
            </Link>
          </nav>
          <Button asChild className="ml-auto rounded-full px-5 md:ml-7">
            <Link
              href="/onboarding"
              data-analytics-event="select_content"
              data-analytics-label="header_scan"
            >
              <span className="hidden sm:inline">Try it free</span>
              <span className="sm:hidden">Try it</span>
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-foreground/8">
          <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-28 top-24 size-[420px] rounded-full bg-lime-200/35 blur-3xl" aria-hidden="true" />
          
          <div className="relative mx-auto grid min-w-0 max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-24">
            <div className="min-w-0 max-w-2xl animate-fade-in-up">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
                <Briefcase className="size-3.5 text-lime-600" aria-hidden="true" />
                For Local SEO Agencies
              </div>

              <h1 className="text-balance text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-[4.2rem]">
                Sell AI Visibility to Your Clients with
                <span className="mt-2 block text-emerald-700">White-Label Reports</span>
              </h1>

              <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
                Traditional local SEO tools miss ChatGPT and Claude traffic. Win more clients by showing them exactly who AI engines recommend instead of them.
              </p>

              <HeroForm />

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> Close more deals</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> Retain local clients</span>
              </div>
            </div>

            <div className="relative mx-auto min-w-0 w-full max-w-2xl animate-fade-in-up lg:mx-0" style={{ animationDelay: "120ms" }}>
              <div className="absolute -inset-5 -rotate-2 rounded-[2.25rem] bg-primary/8" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[#173b35] p-3 shadow-2xl shadow-primary/20 sm:p-4">
                <div className="flex items-center justify-between px-3 py-2 text-primary-foreground/65">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <LogoMark variant="on-dark" className="size-4" />
                    White-label AI Report
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="size-2 rounded-full bg-lime-300" />
                    Generated for Client
                  </div>
                </div>

                <div className="mt-2 rounded-[1.35rem] bg-white p-4 sm:p-6">
                  <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Client analyzed</p>
                      <p className="mt-1 text-lg font-extrabold tracking-tight">Lakeside Kitchen Co. · Austin</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      <TrendingUp className="size-3.5" aria-hidden="true" />
                      +12 pts potential
                    </span>
                  </div>

                  <div className="grid gap-4 py-5 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl bg-[#f3f4ed] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">AI Score</p>
                        <Gauge className="size-4 text-primary" aria-hidden="true" />
                      </div>
                      <div className="mt-4 flex items-end gap-1">
                        <span className="text-5xl font-black tracking-[-0.06em]">68</span>
                        <span className="pb-1.5 text-sm font-bold text-muted-foreground">/100</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                        <div className="h-full w-[68%] rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">Query tested</p>
                      <p className="mt-2 text-sm font-bold leading-5">&ldquo;Which contractor would you recommend to remodel a kitchen in Austin?&rdquo;</p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        Brand cited by 2 of 3 AIs
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Agency Plan</p>
              <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Everything you need to upsell AI SEO.</h2>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {benefits.map((benefit, i) => (
                <article className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-[#f8f8f3] p-7 transition-transform hover:-translate-y-1" key={i}>
                  <span className="relative flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                    <Sparkles className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-8 text-xl font-extrabold tracking-tight">{benefit.title}</h3>
                  <p className="relative mt-3 leading-7 text-muted-foreground">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#173b35] py-20 text-white sm:py-28 text-center">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Ready to scale your local SEO agency?</h2>
            <p className="mt-5 text-lg text-white/70">Join early adopters leveraging Generative Engine Optimization.</p>
            <Button asChild size="lg" className="mt-8 h-14 rounded-full bg-lime-300 px-8 text-[#173b35] hover:bg-lime-200">
              <Link href="/contact">Talk to us about the Agency Plan</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
