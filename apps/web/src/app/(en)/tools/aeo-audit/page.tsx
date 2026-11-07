import type { Metadata } from "next";
import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { AeoAuditTool } from "@/components/aeo-audit-tool";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Free AEO audit — is your website citation-worthy for ChatGPT?",
  description:
    "16 technical checks, 6 content-quality dimensions, an A-F grade and prioritized fixes. See how citation-worthy your site is for ChatGPT, Claude and Perplexity — in one minute.",
  alternates: localizedAlternates("en", "/tools/aeo-audit"),
};

export default function AeoAuditPage() {
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
      <main id="main-content" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="max-w-2xl text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Is your website citation-worthy for ChatGPT?</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          16 technical checks, 6 content-quality dimensions, an A-F grade and a prioritized fix list — the audit an AI agent would run on your site. Free, one minute, no signup.
        </p>
        <div className="mt-10">
          <AeoAuditTool locale="en" />
        </div>
      </main>
    </div>
  );
}
