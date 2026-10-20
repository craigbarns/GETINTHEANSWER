import Link from "next/link";

import { LogoMark } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/8 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <Link className="flex items-center gap-2 font-extrabold" href="/" aria-label="GetInTheAnswer, accueil">
            <LogoMark className="size-8" />
            GetInTheAnswer
          </Link>
          <p className="text-sm text-muted-foreground md:ml-3">© 2026 WEMADE. La visibilité IA, rendue actionnable.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-muted-foreground md:ml-auto" aria-label="Navigation de pied de page">
            <Link className="hover:text-foreground" href="/agency">Pour les agences</Link>
            <Link className="hover:text-foreground" href="/tools/schema-generator">Générateur de schema</Link>
            <Link className="hover:text-foreground" href="/ai-seo-for">Métiers</Link>
            <Link className="hover:text-foreground" href="/study">Étude</Link>
            <Link className="hover:text-foreground" href="/guides">Guides</Link>
            <Link className="hover:text-foreground" href="/onboarding">Lancer une analyse</Link>
            <Link className="hover:text-foreground" href="/legal">Mentions légales</Link>
            <Link className="hover:text-foreground" href="/privacy">Confidentialité</Link>
            <Link className="hover:text-foreground" href="/terms">CGU</Link>
          </nav>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          GetInTheAnswer est édité par WEMADE, SASU immatriculée au Registre du commerce et des sociétés de Marseille sous le numéro 832 419 428.
        </p>
      </div>
    </footer>
  );
}
