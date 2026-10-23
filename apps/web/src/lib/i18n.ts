import type { Currency } from "@/lib/pricing";

export type Locale = "en" | "fr";

export const LOCALES: Locale[] = ["en", "fr"];

/** English is served at the root, French under /fr. The SEO content (industries,
 *  cities, guides, study) targets the US market and exists in English only. */
export const DEFAULT_LOCALE: Locale = "en";

/** Pages that exist in both languages. Every other path is English-only, so a
 *  French page linking to it keeps the plain English URL. */
export const LOCALIZED_PATHS = ["/", "/onboarding", "/sample-report", "/agency", "/contact", "/dashboard"] as const;

export const DEFAULT_CURRENCY_BY_LOCALE: Record<Locale, Currency> = {
  en: "usd",
  fr: "eur",
};

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
};

export const DATE_LOCALE: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
};

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "fr";
}

function splitPath(path: string) {
  const match = path.match(/^([^?#]*)(.*)$/);
  return { pathname: match?.[1] || "/", rest: match?.[2] ?? "" };
}

export function isLocalizedPath(pathname: string) {
  return (LOCALIZED_PATHS as readonly string[]).includes(pathname);
}

/** The URL of `path` (an English path, possibly with a query or hash) in `locale`. */
export function localePath(locale: Locale, path: string) {
  if (locale === DEFAULT_LOCALE) return path;
  const { pathname, rest } = splitPath(path);
  if (!isLocalizedPath(pathname)) return path;
  return `${pathname === "/" ? "/fr" : `/fr${pathname}`}${rest}`;
}

/** Canonical plus hreflang alternates for a page that exists in both languages. */
export function localizedAlternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      en: path,
      fr: localePath("fr", path),
      "x-default": path,
    },
  };
}
