import Link from "next/link";
import { Briefcase, CheckCircle2, Gauge, Sparkles, TrendingUp } from "lucide-react";

import { HeroForm } from "@/components/hero-form";
import { LogoMark } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { localePath, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const AGENCY_META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "AI Visibility Reports for SEO Agencies",
    description:
      "Generate white-label ChatGPT and Claude visibility reports for your local clients. Batch scans and priority support for SEO agencies.",
  },
  fr: {
    title: "Rapports de visibilité IA pour agences",
    description:
      "Mesurez la visibilité IA de vos clients locaux. Rapports en marque blanche, analyses par lots et support pour les agences SEO.",
  },
};

const COPY = {
  en: {
    nav: [
      { href: "#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
    ],
    ctaLong: "Try it free",
    ctaShort: "Try it",
    eyebrow: "For local SEO agencies",
    titleA: "Sell AI visibility to your clients with",
    titleB: "white-label reports",
    intro:
      "Classic local SEO tools ignore ChatGPT and Claude. Win clients by showing them exactly who AI engines recommend instead of them.",
    trust: ["Close more deals", "Keep your local clients longer"],
    cardTitle: "White-label AI report",
    cardStatus: "Illustrative example",
    clientLabel: "Fictitious business",
    client: "Lakeside Kitchen Co. · Austin",
    potential: "Example action plan",
    score: "Example score",
    questionLabel: "Question tested",
    question: "Which contractor would you recommend for a kitchen remodel in Austin?",
    cited: "Brand named by 2 of 3 AIs",
    featuresEyebrow: "Agency plan",
    featuresTitle: "Everything you need to add AI visibility to your services.",
    benefits: [
      { title: "White-label client reports", description: "Polished reports in your agency’s colors to win more local SEO contracts." },
      { title: "Batch AI scans", description: "Track up to 25 locations automatically every week." },
      { title: "City-level competitor tracking", description: "Know exactly which competitors ChatGPT recommends instead of your clients." },
    ],
    finalTitle: "Ready to grow your local SEO agency?",
    finalText: "Get ahead on GEO — generative engine optimization.",
    finalCta: "Talk to us about the agency plan",
  },
  fr: {
    nav: [
      { href: "#features", label: "Fonctionnalités" },
      { href: "/fr#pricing", label: "Tarifs" },
    ],
    ctaLong: "Essayer gratuitement",
    ctaShort: "Essayer",
    eyebrow: "Pour les agences de SEO local",
    titleA: "Vendez la visibilité IA à vos clients avec des",
    titleB: "rapports en marque blanche",
    intro:
      "Les outils de SEO local classiques ignorent ChatGPT et Claude. Gagnez des clients en leur montrant précisément qui les moteurs IA recommandent à leur place.",
    trust: ["Signez plus de missions", "Fidélisez vos clients locaux"],
    cardTitle: "Rapport IA en marque blanche",
    cardStatus: "Exemple illustratif",
    clientLabel: "Entreprise fictive",
    client: "Cuisines du Vieux-Port · Marseille",
    potential: "Exemple de plan d’action",
    score: "Score d’exemple",
    questionLabel: "Question testée",
    question: "Quel artisan recommanderiez-vous pour rénover une cuisine à Marseille ?",
    cited: "Marque citée par 2 IA sur 3",
    featuresEyebrow: "Offre agence",
    featuresTitle: "Tout ce qu’il faut pour vendre la visibilité IA en plus.",
    benefits: [
      { title: "Rapports clients en marque blanche", description: "Des rapports soignés aux couleurs de votre agence pour signer plus de missions en SEO local." },
      { title: "Analyses IA par lots", description: "Suivez automatiquement jusqu’à 25 établissements chaque semaine." },
      { title: "Suivi des concurrents par ville", description: "Sachez exactement quels concurrents ChatGPT recommande à la place de vos clients." },
    ],
    finalTitle: "Prêt à faire grandir votre agence de SEO local ?",
    finalText: "Prenez de l’avance sur le GEO, l’optimisation pour les moteurs génératifs.",
    finalCta: "Parlons de l’offre agence",
  },
};

export function AgencyPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const url = `${SITE_URL}${localePath(locale, "/agency")}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: `${AGENCY_META[locale].title} | GetInTheAnswer`,
        description: AGENCY_META[locale].description,
        inLanguage: locale === "fr" ? "fr-FR" : "en-US",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteHeader locale={locale} path="/agency" links={copy.nav} ctaLong={copy.ctaLong} ctaShort={copy.ctaShort} />

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-foreground/8">
          <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-28 top-24 size-[420px] rounded-full bg-lime-200/35 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto grid min-w-0 max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-24">
            <div className="min-w-0 max-w-2xl animate-fade-in-up">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
                <Briefcase className="size-3.5 text-lime-600" aria-hidden="true" />
                {copy.eyebrow}
              </div>

              <h1 className="text-balance text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-[4.2rem]">
                {copy.titleA}
                <span className="mt-2 block text-emerald-700">{copy.titleB}</span>
              </h1>

              <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">{copy.intro}</p>

              <HeroForm locale={locale} showSample={false} />

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
                {copy.trust.map((item) => (
                  <span className="flex items-center gap-1.5" key={item}><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> {item}</span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full min-w-0 max-w-2xl animate-fade-in-up lg:mx-0" style={{ animationDelay: "120ms" }}>
              <div className="absolute -inset-5 -rotate-2 rounded-[2.25rem] bg-primary/8" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[#173b35] p-3 shadow-2xl shadow-primary/20 sm:p-4">
                <div className="flex items-center justify-between px-3 py-2 text-primary-foreground/65">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <LogoMark variant="on-dark" className="size-4" />
                    {copy.cardTitle}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="size-2 rounded-full bg-lime-300" />
                    {copy.cardStatus}
                  </div>
                </div>

                <div className="mt-2 rounded-[1.35rem] bg-white p-4 sm:p-6">
                  <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{copy.clientLabel}</p>
                      <p className="mt-1 text-lg font-extrabold tracking-tight">{copy.client}</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      <TrendingUp className="size-3.5" aria-hidden="true" />
                      {copy.potential}
                    </span>
                  </div>

                  <div className="grid gap-4 py-5 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl bg-[#f3f4ed] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{copy.score}</p>
                        <Gauge className="size-4 text-primary" aria-hidden="true" />
                      </div>
                      <div className="mt-4 flex items-end gap-1">
                        <span className="text-5xl font-black tracking-[-0.06em]">68</span>
                        <span className="pb-1.5 text-sm font-bold text-muted-foreground">/100</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                        <div className="h-full w-[68%] rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{copy.questionLabel}</p>
                      <p className="mt-2 text-sm font-bold leading-5">&ldquo;{copy.question}&rdquo;</p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        {copy.cited}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">{copy.featuresEyebrow}</p>
              <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">{copy.featuresTitle}</h2>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {copy.benefits.map((benefit) => (
                <article className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-[#f8f8f3] p-7 transition-transform hover:-translate-y-1" key={benefit.title}>
                  <span className="relative flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                    <Sparkles className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-8 text-xl font-extrabold tracking-tight">{benefit.title}</h3>
                  <p className="relative mt-3 leading-7 text-muted-foreground">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#173b35] py-20 text-center text-white sm:py-28">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">{copy.finalTitle}</h2>
            <p className="mt-5 text-lg text-white/70">{copy.finalText}</p>
            <Button asChild size="lg" className="mt-8 h-14 rounded-full bg-lime-300 px-8 text-[#173b35] hover:bg-lime-200">
              <Link href={localePath(locale, "/contact")}>{copy.finalCta}</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
