import type { Metadata } from "next";

import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Free AI visibility scan",
  description:
    "Describe your business and get a free AI visibility report: real customer questions tested on ChatGPT, Claude, Gemini and Perplexity, with recommendations ranked by impact.",
  alternates: localizedAlternates("en", "/onboarding"),
};

export default function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
