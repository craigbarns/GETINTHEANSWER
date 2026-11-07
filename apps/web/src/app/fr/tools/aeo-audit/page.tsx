import type { Metadata } from "next";
import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { AeoAuditTool } from "@/components/aeo-audit-tool";
import { localizedAlternates } from "@/lib/i18n";
import { WebPageSchema } from "@/components/web-page-schema";

export const metadata: Metadata = {
  title: "Audit AEO gratuit — votre site est-il citable par ChatGPT ?",
  description:
    "16 vérifications techniques, 6 dimensions de qualité de contenu, une note de A à F et les corrections priorisées. Voyez si ChatGPT, Claude et Perplexity peuvent citer votre site — en une minute.",
  alternates: localizedAlternates("fr", "/tools/aeo-audit"),
};

export default function AeoAuditPageFr() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/fr" aria-label="GetInTheAnswer, accueil">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="max-w-2xl text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Votre site est-il citable par ChatGPT ?</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          16 vérifications techniques, 6 dimensions de qualité de contenu, une note de A à F et les corrections priorisées — l’audit qu’un agent IA ferait sur votre site. Gratuit, une minute, sans inscription.
        </p>
        <div className="mt-10">
          <AeoAuditTool locale="fr" />
        </div>
              <WebPageSchema path="/tools/aeo-audit" title="Audit AEO gratuit — votre site est-il citable par ChatGPT ?" />
      </main>
    </div>
  );
}
