"use client";

import { Globe } from "lucide-react";

import { localePath, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  fr: { short: "FR", name: "Français" },
};

/**
 * Links to the same page in the other language.
 *
 * `path` is the page's English path. The query string (a report id, a
 * prefilled company name) is carried over on click, so switching language on a
 * report keeps the same report open.
 */
export function LanguageSwitcher({
  locale,
  path,
  className,
  tone = "light",
}: {
  locale: Locale;
  path: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const target: Locale = locale === "en" ? "fr" : "en";
  const href = localePath(target, path);

  return (
    <a
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-extrabold transition-colors ${
        tone === "dark" ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
      } ${className ?? ""}`}
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={target === "fr" ? "Voir cette page en français" : "View this page in English"}
      onClick={(event) => {
        if (!window.location.search && !window.location.hash) return;
        event.preventDefault();
        // Each language has its own root layout, so a full page load is what
        // Next.js does here anyway; this only carries the query string along.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `${href}${window.location.search}${window.location.hash}`;
      }}
      data-analytics-event="select_content"
      data-analytics-label={`language_${target}`}
    >
      <Globe className="size-3.5" aria-hidden="true" />
      <span className="sm:hidden">{LABELS[target].short}</span>
      <span className="hidden sm:inline">{LABELS[target].name}</span>
    </a>
  );
}
