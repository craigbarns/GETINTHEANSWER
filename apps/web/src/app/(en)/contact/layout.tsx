import type { Metadata } from "next";

import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Agency plan & done-for-you fix",
  description:
    "Request an AI visibility monitoring plan for agencies and multi-location businesses, or have us implement your AI visibility action plan for you.",
  alternates: localizedAlternates("en", "/contact"),
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
