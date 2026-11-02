import type { Metadata } from "next";

import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Discuss AI Growth and your visibility plan",
  description:
    "Discuss a pilot AI Growth service, website improvements and monthly content, or request an agency monitoring plan. Scope and quote confirmed before payment.",
  alternates: localizedAlternates("en", "/contact"),
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
