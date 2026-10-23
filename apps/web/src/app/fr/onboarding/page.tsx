import type { Metadata } from "next";

import { OnboardingPage } from "@/components/pages/onboarding-page";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Analyse de visibilité IA gratuite",
  description:
    "Décrivez votre entreprise et obtenez un rapport de visibilité IA gratuit : de vraies questions clients testées sur ChatGPT, Claude, Gemini et Perplexity, avec des recommandations classées par impact.",
  alternates: localizedAlternates("fr", "/onboarding"),
};

export default function OnboardingFr() {
  return <OnboardingPage locale="fr" />;
}
