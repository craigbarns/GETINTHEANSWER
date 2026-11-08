import type { Metadata } from "next";

import { LogoMark } from "@/components/logo";
import { ChangelogContent } from "@/components/changelog-content";
import { WebPageSchema } from "@/components/web-page-schema";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Nouveautés — ce qu'on a construit chez GetInTheAnswer",
  description:
    "On construit en public : l'audit AEO gratuit, la liste d'attente Shopping Intelligence IA, le connecteur MCP, AI Agent Analytics — ce qui change et quand.",
  alternates: localizedAlternates("fr", "/changelog"),
};

export default function ChangelogPageFr() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <a className="flex items-center gap-2.5" href="/fr" aria-label="GetInTheAnswer, accueil">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </a>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <ChangelogContent locale="fr" />
              <WebPageSchema path="/fr/changelog" title="Nouveautés — ce que nous avons construit chez GetInTheAnswer" />
      </main>
    </div>
  );
}
