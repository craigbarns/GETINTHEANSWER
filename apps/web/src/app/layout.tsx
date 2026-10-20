import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GetInTheAnswer — ChatGPT recommande-t-il votre entreprise ?",
    template: "%s | GetInTheAnswer",
  },
  description:
    "Vérifiez si les moteurs IA comme ChatGPT, Claude, Gemini et Perplexity recommandent votre entreprise locale. Score de visibilité IA gratuit, comparaison des concurrents et plan d'action priorisé en quelques minutes.",
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
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "GetInTheAnswer — Votre entreprise est-elle visible dans les réponses des IA ?",
    description:
      "Mesurez votre visibilité dans ChatGPT, Claude, Gemini et Perplexity en quelques minutes. Score de visibilité IA gratuit, sans carte bancaire.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetInTheAnswer — Votre entreprise est-elle visible dans les réponses des IA ?",
    description:
      "Mesurez votre visibilité dans ChatGPT, Claude, Gemini et Perplexity en quelques minutes. Score de visibilité IA gratuit, sans carte bancaire.",
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#173b35",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden font-sans">
        <a className="skip-link" href="#main-content">
          Aller au contenu principal
        </a>
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
