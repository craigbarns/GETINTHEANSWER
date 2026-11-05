import type { Metadata } from "next";

import { OnboardingPage } from "@/components/pages/onboarding-page";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "ChatGPT recommande-t-il votre entreprise ? Scan gratuit",
  description:
    "Vérifiez en 2 minutes si ChatGPT, Claude, Gemini et Perplexity recommandent votre entreprise — ou vos concurrents. Sans carte bancaire.",
  alternates: localizedAlternates("fr", "/onboarding"),
};

export default function OnboardingFr() {
  return <OnboardingPage locale="fr" />;
}
