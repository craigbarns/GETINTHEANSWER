import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  alternates: localizedAlternates("en", "/"),
};

export default function Home() {
  return <HomePage locale="en" />;
}
