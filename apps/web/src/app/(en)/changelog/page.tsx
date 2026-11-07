import type { Metadata } from "next";

import { LogoMark } from "@/components/logo";
import { ChangelogContent } from "@/components/changelog-content";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Changelog — what we've built at GetInTheAnswer",
  description:
    "Shipping in public: the free AEO audit tool, AI Shopping Intelligence waitlist, MCP connector, AI Agent Analytics — what changed and when.",
  alternates: localizedAlternates("en", "/changelog"),
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <a className="flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, home">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </a>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <ChangelogContent locale="en" />
      </main>
    </div>
  );
}
