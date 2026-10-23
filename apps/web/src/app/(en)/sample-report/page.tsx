import type { Metadata } from "next";

import { SAMPLE_REPORT_META, SampleReportPage } from "@/components/pages/sample-report-page";
import { localePath, localizedAlternates } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const meta = SAMPLE_REPORT_META.en;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: localizedAlternates("en", "/sample-report"),
  openGraph: {
    title: meta.ogTitle,
    description: meta.ogDescription,
    url: `${SITE_URL}${localePath("en", "/sample-report")}`,
    type: "article",
  },
};

export default function SampleReport() {
  return <SampleReportPage locale="en" />;
}
