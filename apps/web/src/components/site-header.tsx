import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { localePath, type Locale } from "@/lib/i18n";

const COPY: Record<Locale, { home: string; nav: string; ctaLong: string; ctaShort: string }> = {
  en: { home: "GetInTheAnswer, home", nav: "Main navigation", ctaLong: "Run my free scan", ctaShort: "Free scan" },
  fr: { home: "GetInTheAnswer, accueil", nav: "Navigation principale", ctaLong: "Analyser mon entreprise", ctaShort: "Analyser" },
};

/** Sticky header for the marketing pages. `path` is the current page's English
 *  path, used by the language switcher. */
export function SiteHeader({
  locale,
  path,
  links,
  ctaLong,
  ctaShort,
}: {
  locale: Locale;
  path: string;
  links: { href: string; label: string }[];
  ctaLong?: string;
  ctaShort?: string;
}) {
  const copy = COPY[locale];
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
        <Link className="group flex items-center gap-2.5" href={localePath(locale, "/")} aria-label={copy.home}>
          <LogoMark className="size-9 transition-transform group-hover:-rotate-3" />
          <span className="hidden text-xl font-extrabold tracking-[-0.04em] min-[420px]:inline">GetInTheAnswer</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex" aria-label={copy.nav}>
          {links.map((link) => (
            <Link
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <LanguageSwitcher locale={locale} path={path} className="ml-auto md:ml-5" />

        <Button asChild className="ml-2 rounded-full px-5 sm:ml-3">
          <Link
            href={localePath(locale, "/onboarding")}
            data-analytics-event="select_content"
            data-analytics-label="header_scan"
          >
            <span className="hidden sm:inline">{ctaLong ?? copy.ctaLong}</span>
            <span className="sm:hidden">{ctaShort ?? copy.ctaShort}</span>
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
