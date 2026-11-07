import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3, ShoppingBag, Target, Wrench } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { AiShoppingWaitlist } from "@/components/ai-shopping-waitlist";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "AI Shopping Intelligence — are ChatGPT shoppers recommended your products?",
  description:
    "Coming soon: track whether ChatGPT, Gemini and Perplexity recommend your store's products when shoppers ask what to buy — and which competitors they place in front of you. Join the waitlist.",
  alternates: localizedAlternates("en", "/ai-shopping"),
};

const PILLARS = [
  { icon: ShoppingBag, title: "Catalog import", text: "Shopify, CSV or Merchant Center feed — your products, prices and variants." },
  { icon: Target, title: "Shopping questions", text: "20-50 real buyer prompts per category: what to buy, which brand, which store." },
  { icon: BarChart3, title: "Product-level visibility", text: "Which of your SKUs are recommended, your average position, and who is cited instead." },
  { icon: Wrench, title: "Fix and re-measure", text: "Product-page audit (Product/Offer schema, specs, comparisons) then measure again after the fixes." },
];

export default function AiShoppingPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, home">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/">
          <ArrowLeft className="size-4" aria-hidden="true" /> Home
        </Link>
        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Coming soon — AI Shopping Intelligence</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Your competitors appear in ChatGPT shopping recommendations. Do you?</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            The same platform that measures AI visibility for local businesses is opening a vertical for online stores: which of your products AI engines recommend, at what position, and which competitors they place in front of you.
          </p>
        </div>

        <div className="mt-10">
          <AiShoppingWaitlist locale="en" />
          <p className="mt-3 text-center text-xs text-muted-foreground">Waitlist — the audit opens in early 2027. No spam, no card.</p>
        </div>

        <div className="mt-14 rounded-[1.75rem] border border-foreground/10 bg-white p-7 shadow-sm sm:p-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Simulation — illustrative, fictitious data</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">What your dashboard will look like</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f8f8f3] p-5"><p className="text-3xl font-extrabold text-[#173b35]">34%</p><p className="mt-1 text-sm text-muted-foreground">AI shopping visibility</p></div>
            <div className="rounded-2xl bg-[#f8f8f3] p-5"><p className="text-3xl font-extrabold text-[#173b35]">27/120</p><p className="mt-1 text-sm text-muted-foreground">Products cited</p></div>
            <div className="rounded-2xl bg-[#f8f8f3] p-5"><p className="text-3xl font-extrabold text-[#173b35]">3.2</p><p className="mt-1 text-sm text-muted-foreground">Average position in lists</p></div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3"><span className="w-36 shrink-0 text-sm font-bold">Competitor A</span><div className="h-6 flex-1 overflow-hidden rounded-lg bg-foreground/6"><div className="h-full w-[58%] rounded-lg bg-[#173b35]" /></div><span className="w-9 text-right text-sm font-extrabold">58%</span></div>
            <div className="flex items-center gap-3"><span className="w-36 shrink-0 truncate text-sm font-extrabold text-emerald-700">Your brand</span><div className="h-6 flex-1 overflow-hidden rounded-lg bg-foreground/6"><div className="h-full w-[34%] rounded-lg bg-lime-500" /></div><span className="w-9 text-right text-sm font-extrabold text-emerald-700">34%</span></div>
            <div className="flex items-center gap-3"><span className="w-36 shrink-0 text-sm font-bold">Competitor B</span><div className="h-6 flex-1 overflow-hidden rounded-lg bg-foreground/6"><div className="h-full w-[22%] rounded-lg bg-[#173b35]" /></div><span className="w-9 text-right text-sm font-extrabold">22%</span></div>
          </div>
          <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <p className="font-extrabold">Opportunity: Bluetooth headset X200 — cited in 0 of 12 relevant answers.</p>
            <p className="mt-1">Recommended action: complete specs, verify Product/Offer structured data, enrich the comparison content.</p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <div className="rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-sm" key={pillar.title}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-lime-200 text-[#173b35]"><pillar.icon className="size-5" aria-hidden="true" /></span>
              <h3 className="mt-4 text-lg font-extrabold">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 rounded-2xl bg-[#f8f8f3] p-5 text-xs leading-5 text-muted-foreground">
          Measurement runs through model APIs and covers AI answers, not the ChatGPT Shopping commercial surface. This page describes a product in development — join the waitlist to shape its scope.
        </p>
      </main>
    </div>
  );
}
