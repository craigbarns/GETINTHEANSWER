import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyse de visibilité IA gratuite",
  description:
    "Décrivez votre entreprise et obtenez un rapport de visibilité IA gratuit : de vraies questions clients testées sur ChatGPT, Claude, Gemini et Perplexity, avec des recommandations classées par impact.",
  alternates: {
    canonical: "/onboarding",
  },
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
