import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { PRICES, DONE_FOR_YOU_PRICE, formatPrice } from "@/lib/pricing";
import { GROWTH_PLANS, growthPrice } from "@/lib/growth";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Pricing — Free audit, Pro and done-for-you AI Growth",
  description:
    "Transparent pricing: free AI visibility audit, Pro software at $29/month, AI Growth pilot from $990/month (done for you) and an agency plan. No hidden fees.",
  alternates: localizedAlternates("en", "/pricing"),
};

const OFFERS = [
  {
    name: "AI audit",
    price: "Free",
    note: "No card. No commitment.",
    items: [
      "10 questions tailored to your business",
      "Your visibility score across ChatGPT, Claude, Gemini and Perplexity",
      "Competitors named in AI answers",
      "Up to 3 initial opportunities",
    ],
    cta: { label: "Get my free audit", href: "/onboarding" },
  },
  {
    name: "Pro",
    price: () => formatPrice(PRICES.pro.usd, "usd") + " / month",
    note: "Self-serve software. Cancel anytime.",
    items: [
      "Full visibility report with all 40 answer checks",
      "Ready-to-use drafts: FAQ page, LocalBusiness schema, Google description",
      "Weekly AI-engine tracking",
      "You implement the recommendations yourself",
    ],
    cta: { label: "Start with the free audit", href: "/onboarding" },
  },
  {
    name: "AI Growth",
    price: () => growthPrice("ai_growth", "en") + " / month",
    note: "Done for you. 3-month initial commitment.",
    items: [
      "Technical audit and prioritized action plan",
      "Website fixes within the agreed scope",
      "2 useful customer-focused pages per month",
      "Weekly AI-engine tracking + AI crawler monitoring",
      "Monthly report of work delivered and measured results",
    ],
    cta: { label: "Discuss my plan", href: "/contact?plan=ai-growth" },
    highlight: true,
  },
  {
    name: "AI Growth Plus",
    price: () => growthPrice("ai_growth_plus", "en") + " / month",
    note: "For competitive markets. 3-month initial commitment.",
    items: [
      "The AI Growth foundation",
      "Expanded editorial program, scoped in the quote",
      "Relevant, legitimate external visibility opportunities",
      "Continuous website improvements",
      "Monthly strategic support",
    ],
    cta: { label: "Discuss my plan", href: "/contact?plan=ai-growth-plus" },
  },
];

export default function PricingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is the AI visibility audit really free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The audit runs 10 questions across ChatGPT, Claude, Gemini and Perplexity and shows your score, the competitors named and initial opportunities. No card required.",
            },
          },
          {
            "@type": "Question",
            name: "What is the difference between Pro and AI Growth?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Pro ($29/month) is self-serve software: you get the full report, drafts and weekly tracking, and you implement the changes yourself. AI Growth ($990/month, 3-month initial term) is done for you: our team implements the fixes, publishes content and reports monthly.",
            },
          },
          {
            "@type": "Question",
            name: "Are results guaranteed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No volume of AI citations, traffic or customers is guaranteed — and be wary of anyone who promises that. What is guaranteed: the work delivered, measured and reported every month.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, home">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
          <Button asChild className="ml-auto rounded-full px-5">
            <Link href="/onboarding">Free AI visibility scan <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/">
          <ArrowLeft className="size-4" aria-hidden="true" /> Home
        </Link>
        <div className="mt-6 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Pricing</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Start free. Scale when it works.</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Every plan starts with the same free audit. Pick the software if you want to act yourself, or the done-for-you pilot if you want a team.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {OFFERS.map((offer) => (
            <div
              key={offer.name}
              className={`flex flex-col rounded-[1.5rem] border p-7 shadow-sm ${offer.highlight ? "border-emerald-700/30 bg-[#173b35] text-white" : "border-foreground/8 bg-white"}`}
            >
              <h2 className="text-lg font-extrabold tracking-[-0.02em]">{offer.name}</h2>
              <p className={`mt-3 text-2xl font-extrabold tracking-[-0.03em] ${offer.highlight ? "text-lime-300" : ""}`}>{typeof offer.price === "function" ? offer.price() : offer.price}</p>
              <p className={`mt-1 text-xs ${offer.highlight ? "text-white/60" : "text-muted-foreground"}`}>{offer.note}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {offer.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-5">
                    <Check className={`mt-0.5 size-4 shrink-0 ${offer.highlight ? "text-lime-300" : "text-emerald-700"}`} aria-hidden="true" />
                    <span className={offer.highlight ? "text-white/85" : ""}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className={`mt-6 w-full rounded-full ${offer.highlight ? "bg-lime-300 font-extrabold text-[#173b35] hover:bg-lime-200" : ""}`}>
                <Link href={offer.cta.href}>{offer.cta.label}</Link>
              </Button>
            </div>
          ))}
        </div>

        <section className="mt-12 rounded-[1.75rem] border border-foreground/8 bg-white p-7 sm:p-9">
          <h2 className="text-2xl font-extrabold tracking-[-0.035em]">Other options</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="font-extrabold">One-time done-for-you — {formatPrice(DONE_FOR_YOU_PRICE.usd, "usd")}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">We implement the priority fixes from your audit once, without a subscription. Sold on request after the audit.</p>
            </div>
            <div>
              <p className="font-extrabold">Agency or multi-location — {formatPrice(PRICES.agency.usd, "usd")} / month</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Track several locations or clients from one workspace. See the <Link className="font-semibold text-emerald-700 underline" href="/agency">agency plan</Link>.</p>
            </div>
          </div>
          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            Pilot prices exclude tax. We confirm scope, required access and a quote before any payment. You approve content and changes before publication. AI mentions, traffic and new customers are not guaranteed. Prices are checked against this page by independent directories.
          </p>
        </section>
      </main>
    </div>
  );
}
