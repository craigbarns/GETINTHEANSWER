import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { localePath, type Locale } from "@/lib/i18n";

const COPY: Record<Locale, {
  home: string;
  tagline: string;
  navLabel: string;
  links: [string, string][];
  publisher: string;
}> = {
  en: {
    home: "GetInTheAnswer, home",
    tagline: "© 2026 WEMADE. AI visibility, made actionable.",
    navLabel: "Footer navigation",
    links: [
      ["/agency", "For agencies"],
      ["/tools/schema-generator", "Schema generator"],
      ["/ai-seo-for", "Industries"],
      ["/study", "Study"],
      ["/guides", "Guides"],
      ["/onboarding", "Run a free scan"],
      ["/legal", "Legal notice"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
    ],
    publisher:
      "GetInTheAnswer is published by WEMADE, a French SASU registered with the Marseille Trade and Companies Register under number 832 419 428.",
  },
  fr: {
    home: "GetInTheAnswer, accueil",
    tagline: "© 2026 WEMADE. La visibilité IA, rendue actionnable.",
    navLabel: "Navigation de pied de page",
    links: [
      ["/agency", "Pour les agences"],
      ["/tools/schema-generator", "Générateur de schema"],
      ["/ai-seo-for", "Métiers"],
      ["/study", "Étude"],
      ["/guides", "Guides"],
      ["/onboarding", "Lancer une analyse"],
      ["/legal", "Mentions légales"],
      ["/privacy", "Confidentialité"],
      ["/terms", "CGU"],
    ],
    publisher:
      "GetInTheAnswer est édité par WEMADE, SASU immatriculée au Registre du commerce et des sociétés de Marseille sous le numéro 832 419 428.",
  },
};

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const copy = COPY[locale];
  return (
    <footer className="border-t border-foreground/8 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <Link className="flex items-center gap-2 font-extrabold" href={localePath(locale, "/")} aria-label={copy.home}>
            <LogoMark className="size-8" />
            GetInTheAnswer
          </Link>
          <p className="text-sm text-muted-foreground md:ml-3">{copy.tagline}</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-muted-foreground md:ml-auto" aria-label={copy.navLabel}>
            {copy.links.map(([href, label]) => (
              <Link className="hover:text-foreground" href={localePath(locale, href)} key={href}>
                {label}
              </Link>
            ))}
            <a className="hover:text-foreground" href={locale === "en" ? "/fr" : "/"} hrefLang={locale === "en" ? "fr" : "en"}>
              {locale === "en" ? "Français" : "Anglais"}
            </a>
          </nav>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">{copy.publisher}</p>
      </div>
    </footer>
  );
}
