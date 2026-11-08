import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { contractorSeoCities, getContractorSeoCity } from "@/lib/contractor-seo";
import { getCity } from "@/lib/cities";
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
    tagline: "© 2026 WEMADE. AI visibility, taken care of.",
    navLabel: "Footer navigation",
    links: [
      ["/pricing", "Pricing"],
      ["/agency", "For agencies"],
      ["/tools/ai-chat", "Ask ChatGPT about you"],
      ["/tools/aeo-audit", "Free AEO audit"],
      ["/tools/schema-generator", "Schema generator"],
      ["/ai-seo-for", "Industries"],
      ["/study", "Study"],
      ["/changelog", "Changelog"],
      ["/guides", "Guides"],
      ["/onboarding", "Run a free scan"],
      ["/sample-report", "See a sample report"],
      ["/contact", "Contact"],
      ["/legal", "Legal notice"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
    ],
    publisher:
      "GetInTheAnswer is published by WEMADE, a French SASU registered with the Marseille Trade and Companies Register under number 832 419 428.",
  },
  fr: {
    home: "GetInTheAnswer, accueil",
    tagline: "© 2026 WEMADE. Votre visibilité IA, prise en charge.",
    navLabel: "Navigation de pied de page",
    links: [
      ["/pricing", "Tarifs"],
      ["/agency", "Pour les agences"],
      ["/tools/ai-chat", "Demander à ChatGPT"],
      ["/tools/aeo-audit", "Audit AEO gratuit"],
      ["/tools/schema-generator", "Générateur de schema"],
      ["/ai-seo-for", "Métiers"],
      ["/study", "Étude"],
      ["/changelog", "Nouveautés"],
      ["/guides", "Guides"],
      ["/onboarding", "Lancer une analyse"],
      ["/sample-report", "Voir un exemple de rapport"],
      ["/contact", "Contact"],
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
        <a
          className="w-fit"
          href="https://geocitely.com/tools/getintheanswer?utm_source=badge&utm_medium=referral&utm_campaign=listed-on"
          target="_blank"
          rel="noopener"
          title="GetInTheAnswer on Geocitely"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://geocitely.com/badges/listed-on-geocitely-light.svg"
            alt="GetInTheAnswer is listed on Geocitely, the GEO tools directory"
            width={220}
            height={56}
            loading="lazy"
          />
        </a>
        {locale === "en" ? (
          <div className="border-t border-foreground/8 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contractor SEO
            </h3>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {contractorSeoCities.map(({ city: slug }) => {
                const city = getCity(slug);
                if (!city) return null;
                return (
                  <li key={slug}>
                    <Link href={`/contractor-seo/${slug}`} className="hover:text-foreground">
                      Contractor SEO in {city.name}, {city.stateCode}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
