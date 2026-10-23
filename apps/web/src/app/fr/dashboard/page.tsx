import type { Metadata } from "next";

import { DASHBOARD_META, DashboardPage, type DashboardSearchParams } from "@/components/pages/dashboard-page";

export const metadata: Metadata = {
  ...DASHBOARD_META.fr,
  robots: { index: false, follow: false },
};

export default function DashboardFr({ searchParams }: { searchParams: DashboardSearchParams }) {
  return <DashboardPage locale="fr" searchParams={searchParams} />;
}
