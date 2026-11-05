import type { Metadata } from "next";

import { OnboardingPage } from "@/components/pages/onboarding-page";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Does ChatGPT Recommend Your Business? Free AI Scan",
  description:
    "Run a free AI visibility scan and see whether ChatGPT, Claude, Gemini and Perplexity recommend your business — or your competitors. 2 minutes, no card.",
  alternates: localizedAlternates("en", "/onboarding"),
};

export default function Onboarding() {
  return <OnboardingPage locale="en" />;
}
