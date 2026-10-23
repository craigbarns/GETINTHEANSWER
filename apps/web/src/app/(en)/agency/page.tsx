import type { Metadata } from "next";

import { AGENCY_META, AgencyPage } from "@/components/pages/agency-page";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  ...AGENCY_META.en,
  alternates: localizedAlternates("en", "/agency"),
};

export default function Agency() {
  return <AgencyPage locale="en" />;
}
