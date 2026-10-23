import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  alternates: localizedAlternates("fr", "/"),
};

export default function HomeFr() {
  return <HomePage locale="fr" />;
}
