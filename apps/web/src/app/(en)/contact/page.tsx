import { ContactPage } from "@/components/pages/contact-page";
import { parseContactPlan } from "@/lib/growth";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${SITE_NAME}`,
  url: `${SITE_URL}/contact`,
  about: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export default async function Contact({ searchParams }: { searchParams: Promise<{ plan?: string | string[] }> }) {
  const plan = parseContactPlan((await searchParams).plan);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ContactPage key={plan} locale="en" initialPlan={plan} />
    </>
  );
}
