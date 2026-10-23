import type { Metadata } from "next";

import { AGENCY_META, AgencyPage } from "@/components/pages/agency-page";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  ...AGENCY_META.fr,
  alternates: localizedAlternates("fr", "/agency"),
};

export default function AgencyFr() {
  return <AgencyPage locale="fr" />;
}
