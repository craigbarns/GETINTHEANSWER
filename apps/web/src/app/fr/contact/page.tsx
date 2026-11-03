import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/contact-page";
import { parseContactPlan } from "@/lib/growth";
import { localizedAlternates } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contacter ${SITE_NAME}`,
  url: `${SITE_URL}/fr/contact`,
  inLanguage: "fr-FR",
  about: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export const metadata: Metadata = {
  title: "Parlons de votre accompagnement AI Growth",
  description:
    "Étudions votre projet AI Growth : corrections du site, contenus utiles et suivi mensuel, ou offre agence. Périmètre et devis confirmés avant paiement.",
  alternates: localizedAlternates("fr", "/contact"),
};

export default async function ContactFr({ searchParams }: { searchParams: Promise<{ plan?: string | string[] }> }) {
  const plan = parseContactPlan((await searchParams).plan);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ContactPage key={plan} locale="fr" initialPlan={plan} />
    </>
  );
}
