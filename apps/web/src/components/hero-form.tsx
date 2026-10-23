"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { localePath, type Locale } from "@/lib/i18n";

const COPY: Record<Locale, { placeholder: string; label: string; submit: string; sample: string }> = {
  en: {
    placeholder: "Your business name…",
    label: "Business name",
    submit: "Run my free AI scan",
    sample: "See a sample report",
  },
  fr: {
    placeholder: "Le nom de votre entreprise…",
    label: "Nom de l’entreprise",
    submit: "Lancer mon analyse gratuite",
    sample: "Voir un exemple de rapport",
  },
};

export function HeroForm({ locale = "en", showSample = true }: { locale?: Locale; showSample?: boolean }) {
  const copy = COPY[locale];
  const [company, setCompany] = useState("");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    window.gtag?.("event", "scan_intent", {
      language: locale,
      entry_point: "hero_form",
    });
    const onboarding = localePath(locale, "/onboarding");
    router.push(company.trim() ? `${onboarding}?companyName=${encodeURIComponent(company.trim())}` : onboarding);
  };

  return (
    <div className="mt-9 flex flex-col gap-3 lg:flex-row lg:flex-wrap">
      <form onSubmit={handleSubmit} className="flex min-w-fit flex-1 flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder={copy.placeholder}
          aria-label={copy.label}
          autoComplete="organization"
          required
          className="h-14 w-full min-w-[200px] rounded-full sm:flex-1 border-2 border-foreground/15 bg-white/80 px-6 text-base shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
        <Button type="submit" size="lg" className="h-14 shrink-0 rounded-full px-7 text-base shadow-lg shadow-primary/15">
          {copy.submit}
          <ArrowRight className="ml-2 size-5" aria-hidden="true" />
        </Button>
      </form>
      {showSample && (
        <Button asChild size="lg" variant="outline" className="h-14 shrink-0 rounded-full border-foreground/15 bg-white/60 px-7 text-base">
          <Link href={localePath(locale, "/sample-report")} data-analytics-event="select_content" data-analytics-label="hero_sample_report">
            {copy.sample}
          </Link>
        </Button>
      )}
    </div>
  );
}
