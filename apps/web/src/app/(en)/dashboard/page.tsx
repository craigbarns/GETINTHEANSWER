import type { Metadata } from "next";

import { DASHBOARD_META, DashboardPage, type DashboardSearchParams } from "@/components/pages/dashboard-page";

export const metadata: Metadata = {
  ...DASHBOARD_META.en,
  robots: { index: false, follow: false },
};

export default function Dashboard({ searchParams }: { searchParams: DashboardSearchParams }) {
  return <DashboardPage locale="en" searchParams={searchParams} />;
}
