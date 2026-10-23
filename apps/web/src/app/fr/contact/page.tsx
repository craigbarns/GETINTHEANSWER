import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/contact-page";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Offre agence et prise en charge complète",
  description:
    "Demandez une offre de suivi de visibilité IA pour agences et réseaux d’établissements, ou confiez-nous la mise en œuvre de votre plan d’action.",
  alternates: localizedAlternates("fr", "/contact"),
};

export default function ContactFr() {
  return <ContactPage locale="fr" />;
}
