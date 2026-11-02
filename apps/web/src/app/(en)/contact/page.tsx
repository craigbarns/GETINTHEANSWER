import { ContactPage } from "@/components/pages/contact-page";
import { parseContactPlan } from "@/lib/growth";

export default async function Contact({ searchParams }: { searchParams: Promise<{ plan?: string | string[] }> }) {
  const plan = parseContactPlan((await searchParams).plan);
  return <ContactPage key={plan} locale="en" initialPlan={plan} />;
}
