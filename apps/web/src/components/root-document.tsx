import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { DEFAULT_CURRENCY_BY_LOCALE, OG_LOCALE, localePath, type Locale } from "@/lib/i18n";
import { CURRENCY_STORAGE_KEY } from "@/lib/pricing";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const ROOT_COPY: Record<Locale, { title: string; template: string; description: string; ogTitle: string; ogDescription: string; skip: string }> = {
  en: {
    title: "GetInTheAnswer — AI visibility, taken care of",
    template: "%s | GetInTheAnswer",
    description:
      "Get a free AI visibility plan, then let us handle website fixes, useful content and monthly measurement. AI Growth pilot service from EUR 990 per month.",
    ogTitle: "GetInTheAnswer — Turn AI visibility into action",
    ogDescription:
      "A free visibility plan, website improvements and useful content. You approve publication; we handle the agreed work and measure changes.",
    skip: "Skip to main content",
  },
  fr: {
    title: "GetInTheAnswer — Votre visibilité IA, prise en charge",
    template: "%s | GetInTheAnswer",
    description:
      "Obtenez votre plan de visibilité IA gratuit, puis confiez-nous corrections, contenus utiles et suivi mensuel. Accompagnement pilote AI Growth dès 990 € HT par mois.",
    ogTitle: "GetInTheAnswer — Du diagnostic aux optimisations",
    ogDescription:
      "Un plan gratuit, des corrections du site et des contenus utiles. Vous validez les publications ; nous prenons en charge le travail convenu et mesurons les changements.",
    skip: "Aller au contenu principal",
  },
};

export function rootMetadata(locale: Locale): Metadata {
  const copy = ROOT_COPY[locale];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: copy.title, template: copy.template },
    description: copy.description,
    keywords: [
      "AI visibility",
      "AI SEO",
      "generative engine optimization",
      "GEO",
      "ChatGPT recommendations",
      "AI search optimization",
      "local business visibility",
      "AI visibility score",
      "LLM SEO",
    ],
    applicationName: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
    },
    openGraph: {
      title: copy.ogTitle,
      description: copy.ogDescription,
      url: `${SITE_URL}${localePath(locale, "/")}`,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: Object.values(OG_LOCALE).filter((value) => value !== OG_LOCALE[locale]),
      type: "website",
    },
    twitter: { card: "summary_large_image", title: copy.ogTitle, description: copy.ogDescription },
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

export const rootViewport: Viewport = {
  colorScheme: "light",
  themeColor: "#173b35",
};

/** The <html> document shared by the English and French root layouts. */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className="h-full antialiased" data-currency={DEFAULT_CURRENCY_BY_LOCALE[locale]}>
      {/* This component is the root layout's document for both languages. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Applies a stored currency choice before first paint, so a visitor who
            picked the other currency never sees the default flash first. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var c=localStorage.getItem(${JSON.stringify(CURRENCY_STORAGE_KEY)});if(c==="eur"||c==="usd"){document.documentElement.dataset.currency=c}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden font-sans">
        <a className="skip-link" href="#main-content">
          {ROOT_COPY[locale].skip}
        </a>
        {children}
        <SiteFooter locale={locale} />
        <Analytics locale={locale} />
      </body>
    </html>
  );
}
