import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/contact-page";
import { parseContactPlan } from "@/lib/growth";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Parlons de votre accompagnement AI Growth",
  description:
    "Étudions votre projet AI Growth : corrections du site, contenus utiles et suivi mensuel, ou offre agence. Périmètre et devis confirmés avant paiement.",
  alternates: localizedAlternates("fr", "/contact"),
};

export default async function ContactFr({ searchParams }: { searchParams: Promise<{ plan?: string | string[] }> }) {
  const plan = parseContactPlan((await searchParams).plan);
  return <ContactPage key={plan} locale="fr" initialPlan={plan} />;
}
