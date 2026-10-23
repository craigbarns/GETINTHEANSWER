import type { Metadata } from "next";

import { SAMPLE_REPORT_META, SampleReportPage } from "@/components/pages/sample-report-page";
import { localePath, localizedAlternates } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const meta = SAMPLE_REPORT_META.fr;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: localizedAlternates("fr", "/sample-report"),
  openGraph: {
    title: meta.ogTitle,
    description: meta.ogDescription,
    url: `${SITE_URL}${localePath("fr", "/sample-report")}`,
    type: "article",
  },
};

export default function SampleReportFr() {
  return <SampleReportPage locale="fr" />;
}
