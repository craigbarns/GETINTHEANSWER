import type { Metadata } from "next";

import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Free AI visibility scan",
  description:
    "Get a free AI visibility report for your business. Compare model responses, discover named competitors and review recommended actions.",
  alternates: localizedAlternates("en", "/onboarding"),
};

export default function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
