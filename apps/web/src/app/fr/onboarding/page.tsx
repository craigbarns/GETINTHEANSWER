import type { Metadata } from "next";

import { OnboardingPage } from "@/components/pages/onboarding-page";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Analyse de visibilité IA gratuite",
  description:
    "Obtenez un rapport de visibilité IA gratuit : réponses des modèles, concurrents cités et actions recommandées pour votre entreprise.",
  alternates: localizedAlternates("fr", "/onboarding"),
};

export default function OnboardingFr() {
  return <OnboardingPage locale="fr" />;
}
