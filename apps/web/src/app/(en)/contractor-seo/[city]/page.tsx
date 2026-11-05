import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Search, TrendingUp } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cities, getCity } from "@/lib/cities";
import { contractorSeoCities, getContractorSeoCity } from "@/lib/contractor-seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return contractorSeoCities.map(({ city }) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const entry = getContractorSeoCity(citySlug);
  const city = getCity(citySlug);
  if (!entry || !city) return {};

  const title = `Contractor SEO in ${city.name}, ${city.stateCode} | Free AI Visibility Audit`;
  const description = `GetInTheAnswer puts general contractors in ${city.name} in front of homeowners who ask ChatGPT and Google AI for recommendations. Free 60-second visibility audit — no account needed.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/contractor-seo/${city.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/contractor-seo/${city.slug}`,
      siteName: SITE_NAME,
    },
  };
}

export default async function ContractorSeoCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const entry = getContractorSeoCity(citySlug);
  const city = getCity(citySlug);
  if (!entry || !city) notFound();

  const formattedCity = `${city.name}, ${city.stateCode}`;
  const otherCities = cities.filter((c) => c.slug !== city.slug).slice(0, 6);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contractor SEO",
            item: `${SITE_URL}/contractor-seo/${city.slug}`,
          },
        ],
      },
      {
        "@type": "Service",
        name: `Contractor SEO & AI visibility services in ${formattedCity}`,
        provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        areaServed: { "@type": "City", name: city.name, addressRegion: city.stateCode },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is contractor SEO in ${city.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Contractor SEO in ${city.name} means getting your construction business found where homeowners actually search — including AI assistants like ChatGPT, which now recommend specific contractors by name.`,
            },
          },
          {
            "@type": "Question",
            name: `How do I know if AI assistants recommend my ${city.name} business?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "GetInTheAnswer runs a free 60-second audit: real customer questions asked across ChatGPT, Claude, Gemini and Perplexity, and a report of whether your business is named in the answers.",
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <MapPin className="size-4" aria-hidden /> {formattedCity}
      </p>
      <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
        Contractor SEO in {formattedCity} — get found where homeowners now ask
        ChatGPT, not Google
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Millions of {city.name} homeowners no longer scroll through ten blue
        links. They ask an AI assistant: <em>&ldquo;who&rsquo;s the best general contractor
        near me?&rdquo;</em> The assistant names two or three businesses.{" "}
        <strong>
          If yours isn&rsquo;t one of them, those customers never hear about you.
        </strong>
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button asChild size="lg">
          <Link href={`/onboarding?city=${encodeURIComponent(formattedCity)}&industry=General%20Contractor`}>
            Run the free {city.name} audit <ArrowRight className="ml-2 size-4" aria-hidden />
          </Link>
        </Button>
        <Link href="/sample-report" className="text-sm font-medium text-primary underline underline-offset-4">
          See a sample report first
        </Link>
      </div>

      <section className="mt-14 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <Search className="size-6 text-primary" aria-hidden />
          <h2 className="mt-3 text-lg font-bold">Measure before you spend</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Most contractor SEO in {city.name} is guesswork and invoices. We
            start with a measured audit: which AI engines name your business,
            which name your competitors instead, and the exact gaps to close.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <TrendingUp className="size-6 text-primary" aria-hidden />
          <h2 className="mt-3 text-lg font-bold">Fix what actually moves answers</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reviews mentioning specific services, consistent NAP data, schema
            markup and pages that answer real local questions. You approve the
            work; we implement and re-measure monthly.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">
          Which {city.name} trades do you serve?
        </h2>
        <p className="mt-2 text-muted-foreground">
          See measured AI recommendations for {city.name} in your specific trade.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {entry.related.map((slug) => (
            <li key={slug} className="rounded-xl border bg-card p-4">
              <Link
                href={`/ai-seo-for/${slug}/${city.slug}`}
                className="font-medium text-primary underline underline-offset-4"
              >
                AI recommendations: {slug.replace(/-/g, " ")} in {city.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">
          Contractor SEO in other cities
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {otherCities.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/contractor-seo/${c.slug}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Contractor SEO in {c.name}, {c.stateCode}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
