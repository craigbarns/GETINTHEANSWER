import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ListChecks,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { GrowthOffers } from "@/components/growth-offers";
import { FrenchAnalysisPreview } from "@/components/french-analysis-preview";
import { HeroForm } from "@/components/hero-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { formatScanDate, getBenchmarkStats, getCityScan, getScannedPairs, type CityScan } from "@/lib/city-scans";
import { contractorSeoCities } from "@/lib/contractor-seo";
import { getCity } from "@/lib/cities";
import { DATE_LOCALE, DEFAULT_CURRENCY_BY_LOCALE, localePath, type Locale } from "@/lib/i18n";
import { CURRENCIES, PRICES } from "@/lib/pricing";
import { GROWTH_PLANS, growthPrice } from "@/lib/growth";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** The real scan shown in the hero. Falls back to any published scan. */
function getHeroScan(): CityScan | null {
  const preferred = getCityScan("plumbers", "dallas-tx");
  if (preferred) return preferred;
  for (const pair of getScannedPairs()) {
    const scan = getCityScan(pair.industry, pair.city);
    if (scan) return scan;
  }
  return null;
}

function formatNumber(value: number, locale: Locale) {
  return value.toLocaleString(DATE_LOCALE[locale]);
}

function scanDate(iso: string, locale: Locale) {
  if (locale === "en") return formatScanDate(iso);
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

type Faq = { question: string; answer: string };

function getCopy(locale: Locale, stats: ReturnType<typeof getBenchmarkStats>) {
  const scans = stats ? formatNumber(stats.scans, locale) : "";
  const unanimous = stats ? `${stats.unanimousShare}` : "";
  const sole = stats ? `${stats.soleMentionShare}` : "";

  const benchmarkLine =
    stats
      ? locale === "fr"
        ? ` — la même mesure que notre étude de ${formatNumber(stats.scans, locale)} recherches locales dans ${formatNumber(stats.cities, locale)} villes américaines.`
        : ` — the same four-engine measurement behind our benchmark of ${formatNumber(stats.scans, locale)} local searches in ${formatNumber(stats.cities, locale)} US cities.`
      : locale === "fr"
        ? " — la même mesure que notre étude de référence sur la visibilité IA locale."
        : " — the same four-engine measurement behind our published AI visibility benchmark.";

  if (locale === "fr") {
    return {
      nav: [
        { href: "#proof", label: "Votre diagnostic" },
        { href: "#method", label: "Comment ça marche" },
        { href: "/fr/sample-report", label: "Exemple de rapport" },
        { href: "#pricing", label: "Tarifs" },
        { href: "/guides", label: "Guides" },
      ],
      eyebrow: "Votre visibilité IA, prise en charge",
      titleA: "Faites de ChatGPT et Google AI",
      titleB: "de nouveaux canaux d’acquisition.",
      intro:
        `Nous analysons votre visibilité sur ChatGPT, Claude, Gemini et Perplexity, préparons les corrections de votre site et les contenus utiles à vos futurs clients, puis mesurons les changements chaque mois. Vous validez les publications ; nous prenons en charge le travail convenu${benchmarkLine}`,
      trust: ["Plan gratuit, sans carte bancaire", "Contenus validés avant publication", "Optimisations et suivi mensuels"],
      proofLabel: "Question réelle posée aux IA",
      proofCity: "Étude GetInTheAnswer",
      proofCountry: " (États-Unis)",
      proofNamed: (count: number) => `${count} noms d’entreprises relevés dans ces réponses.`,
      proofFoot: "Vérifiez si les IA citent votre entreprise dans votre ville.",
      measured: (date: string) => `Mesuré le ${date}`,
      statsLabel: "Ce que montre notre étude",
      stats: stats
        ? [
            { value: scans, label: "recherches locales testées sur 4 moteurs IA" },
            { value: formatNumber(stats.averageBusinessesPerScan, locale), label: "entreprises citées en moyenne par recherche" },
            { value: `${unanimous} %`, label: "seulement sont recommandées par toutes les IA" },
            { value: `${sole} %`, label: "ne sont citées que par une seule IA" },
          ]
        : [],
      statsNote: "Étude menée sur des recherches locales aux États-Unis.",
      statsLink: "Voir l’étude complète",
      methodEyebrow: "Un accompagnement concret",
      methodTitle: "Nous détectons, optimisons et mesurons.",
      steps: [
        {
          title: "Un diagnostic et des priorités",
          description: "L’audit gratuit révèle votre présence et les concurrents cités. Nous étudions ensuite votre site pour vous proposer un périmètre d’intervention adapté.",
        },
        {
          title: "Des corrections et des contenus",
          description: "Dans l’offre mensuelle, nous préparons les optimisations techniques et les pages utiles à vos clients. Chaque publication attend votre validation et les accès convenus.",
        },
        {
          title: "Un suivi et des résultats documentés",
          description: "Nous comparons des relevés IA sur les mêmes questions et documentons le travail réalisé. Le trafic et les demandes sont suivis lorsque vos outils de mesure sont connectés.",
        },
      ],
      step: "Étape",
      demoEyebrow: "Le plan devient du travail réalisé",
      demoTitle: "Vos priorités sont claires. Nous pouvons les mettre en œuvre.",
      demoIntro: "Avec AI Growth, le diagnostic sert à choisir les corrections et les contenus à produire. Nous convenons du périmètre avant de commencer, puis soumettons chaque publication à votre validation.",
      demoCta: "Obtenir mon plan gratuit",
      demoSample: "Voir l’exemple de rapport complet",
      demoPlan: "Exemple de plan d’action",
      demoHeading: "3 exemples de travaux possibles",
      demoPriority: "Exemple illustratif",
      demoActions: [
        ["Créer une page FAQ locale", "Répondre aux questions fréquentes de vos clients", "Contenu"],
        ["Structurer vos données", "Ajouter le balisage schema LocalBusiness", "Balisage"],
        ["Renforcer votre page Prestations", "Détailler vos zones d’intervention et spécialités", "Services"],
      ],
      benefits: [
        { title: "Des optimisations prises en charge", text: "Un périmètre précis, du travail livré." },
        { title: "Vous gardez la main", text: "Votre validation avant chaque publication." },
        { title: "Des résultats mesurés", text: "Des relevés comparables, datés et consultables." },
      ],
      faqTitle: "Vos questions, nos réponses.",
      faqMore: ["Envie d’aller plus loin ? Consultez nos", "guides sur la visibilité IA et le GEO", "(en anglais)."],
      finalTitle: "Transformez le diagnostic en premières actions.",
      finalText: "Obtenez votre plan de visibilité gratuit. Nous pourrons ensuite étudier les optimisations à réaliser avec vous.",
      faqs: [
        {
          question: "Que comprend AI Growth ?",
          answer: "Le pilote à 990 € HT par mois comprend un audit technique, les corrections du site convenues au devis, deux pages utiles par mois, un suivi hebdomadaire des moteurs IA disponibles et un rapport mensuel. L’engagement initial est de trois mois. Nous confirmons le périmètre et les accès avant tout paiement."
        },
        {
          question: "Le plan de visibilité est-il vraiment gratuit ?",
          answer: "Oui, sans carte bancaire. L’analyse teste dix questions adaptées à votre entreprise sur les moteurs disponibles, affiche votre visibilité, les concurrents et jusqu’à trois premières opportunités. Vous êtes libre de réaliser les actions vous-même ou de demander un accompagnement."
        },
        {
          question: "Intervenez-vous sur Google AI Overviews et AI Mode ?",
          answer: "Nous travaillons les fondamentaux du SEO utiles à Google : accès aux pages, contenu fiable, liens internes et données structurées conformes au contenu visible. Le suivi automatisé actuel porte sur les réponses des modèles disponibles, dont Gemini ; il ne mesure pas directement AI Overviews ou AI Mode. Leur examen est distinct du score de visibilité."
        },
        {
          question: "Garantissez-vous des citations ou de nouveaux clients ?",
          answer: "Non. Les moteurs décident des réponses qu’ils affichent et celles-ci varient. Nous nous engageons sur les livrables convenus et la transparence des mesures. Les exemples du site illustrent un diagnostic ; ils ne constituent pas des résultats clients avant/après."
        },
        {
          question: "Comment les contenus sont-ils publiés ?",
          answer: "Nous vous soumettons les textes et les corrections avant publication. La mise en ligne dépend de votre validation et des accès prévus au devis. Les intégrations de publication automatique WordPress et Shopify ne sont pas proposées comme des fonctions déjà disponibles."
        },
        {
          question: "Le logiciel à 29 € par mois existe-t-il toujours ?",
          answer: "Oui. Le Pro reste une offre autonome de rapport complet, de contenus à adapter et de suivi hebdomadaire. Il ne comprend pas le travail de mise en œuvre des offres AI Growth. Les taxes éventuelles sont affichées au paiement Stripe avant confirmation."
        }
      ] satisfies Faq[],
    };
  }

  return {
    nav: [
      { href: "#proof", label: "Your audit" },
      { href: "#method", label: "How it works" },
      { href: "/sample-report", label: "Sample report" },
      { href: "#pricing", label: "Pricing" },
      { href: "/guides", label: "Guides" },
    ],
    eyebrow: "AI visibility, taken care of",
    titleA: "Make ChatGPT and Google AI",
    titleB: "new customer acquisition channels.",
    intro:
      `We audit your visibility on ChatGPT, Claude, Gemini and Perplexity, prepare website improvements and useful content for your future customers, then measure changes each month. You approve publication; we handle the agreed work${benchmarkLine}`,
    trust: ["Free plan, no credit card", "You approve before publication", "Monthly improvements and reporting"],
    proofLabel: "A real question we asked the AIs",
    proofCity: "GetInTheAnswer study",
    proofCountry: "",
    proofNamed: (count: number) => `${count} business names recorded in these responses.`,
    proofFoot: "Check whether AI engines name your business in your city.",
    measured: (date: string) => `Measured on ${date}`,
    statsLabel: "What our study found",
    stats: stats
      ? [
          { value: scans, label: "local searches tested across 4 AI engines" },
          { value: formatNumber(stats.averageBusinessesPerScan, locale), label: "businesses named per search, on average" },
          { value: `${unanimous}%`, label: "of businesses are recommended by every AI" },
          { value: `${sole}%`, label: "are named by just one AI" },
        ]
      : [],
    statsNote: "Study run on local searches across US cities.",
    statsLink: "Read the full study",
    methodEyebrow: "Practical support",
    methodTitle: "We find, improve and measure.",
    steps: [
      {
        title: "A diagnosis and clear priorities",
        description: "Your free audit reveals your presence and the competitors named. We then review your website to propose an appropriate scope of work.",
      },
      {
        title: "Website fixes and useful content",
        description: "With a monthly service plan, we prepare technical improvements and customer-focused pages. Publication follows your approval and the agreed website access.",
      },
      {
        title: "Documented work and measured changes",
        description: "We compare AI checks using the same questions and document the work delivered. Traffic and inquiries are tracked when your measurement tools are connected.",
      },
    ],
    step: "Step",
    demoEyebrow: "From a plan to work delivered",
    demoTitle: "Clear priorities. A team to implement them.",
    demoIntro: "With AI Growth, the audit helps us choose the fixes and pages to produce. We agree on scope before starting and ask you to approve each publication.",
    demoCta: "Get my free visibility plan",
    demoSample: "See the full sample report",
    demoPlan: "Example action plan",
    demoHeading: "3 examples of possible work",
    demoPriority: "Illustrative example",
    demoActions: [
      ["Publish a local FAQ page", "Answer your customers’ common questions", "Content"],
      ["Structure your data", "Add LocalBusiness schema markup", "Markup"],
      ["Strengthen your Services page", "Spell out your service areas and specialties", "Services"],
    ],
    benefits: [
      { title: "Improvements taken care of", text: "Clear scope. Work delivered." },
      { title: "You stay in control", text: "Your approval before publication." },
      { title: "Measured results", text: "Dated, comparable checks you can inspect." },
    ],
    faqTitle: "Your questions, answered.",
    faqMore: ["Want to go deeper? Read our", "guides on AI visibility and GEO", "."],
    finalTitle: "Turn your diagnosis into the first improvements.",
    finalText: "Get your free visibility plan. Then we can review the improvements we could carry out together.",
    faqs: [
      {
        question: "What is included in AI Growth?",
        answer: `The ${growthPrice("ai_growth", "en")} per month pilot, excluding tax, includes a technical audit, agreed website fixes, two useful pages per month, weekly tracking on available AI engines and a monthly report. The initial commitment is three months. Scope and required access are confirmed before any payment.`
      },
      {
        question: "Is the visibility plan really free?",
        answer: "Yes, with no credit card. The audit tests ten questions tailored to your business on available engines, shows your visibility and competitors, and reveals up to three initial opportunities. You can implement them yourself or ask about a service plan."
      },
      {
        question: "Do you work on Google AI Overviews and AI Mode?",
        answer: "We work on SEO fundamentals relevant to Google: accessible pages, reliable content, internal links and structured data matching visible content. Current automated tracking checks available model responses, including Gemini; it does not directly measure AI Overviews or AI Mode. Those reviews are separate from the visibility score."
      },
      {
        question: "Do you guarantee AI mentions or new customers?",
        answer: "No. Engines decide what to show and their answers vary. We commit to agreed deliverables and transparent measurement. The examples on this site illustrate an audit; they are not client before-and-after results."
      },
      {
        question: "How is content published?",
        answer: "We submit copy and fixes for your approval before publication. Publishing depends on your approval and the access specified in the quote. Automated WordPress and Shopify publishing integrations are not offered as existing features."
      },
      {
        question: "Is the $29 per month software plan still available?",
        answer: "Yes. Pro remains a self-service full report, editable content and weekly tracking plan, priced at $29 per month (or €29 on the French site). It does not include the implementation work of AI Growth. Applicable taxes appear at Stripe checkout before confirmation."
      }
    ] satisfies Faq[],
  };
}

const stepIcons = [Search, ListChecks, BarChart3];
const benefitIcons = [BarChart3, CircleDot, ShieldCheck];
const engineDots: Record<string, string> = {
  ChatGPT: "bg-emerald-400",
  Claude: "bg-amber-300",
  Gemini: "bg-sky-400",
  Perplexity: "bg-lime-400",
};

export function HomePage({ locale }: { locale: Locale }) {
  const stats = getBenchmarkStats();
  const scan = locale === "en" ? getHeroScan() : null;
  const copy = getCopy(locale, stats);
  const onboarding = localePath(locale, "/onboarding");
  const homeUrl = `${SITE_URL}${localePath(locale, "/")}`;
  const heroQuery = scan?.query;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
      },
      {
        "@type": "FAQPage",
        "@id": `${homeUrl}#faq`,
        inLanguage: locale === "fr" ? "fr-FR" : "en-US",
        mainEntity: copy.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        url: homeUrl,
        name: SITE_NAME,
        description: copy.intro,
        inLanguage: locale === "fr" ? "fr-FR" : "en-US",
      },
      {
        "@type": "Service",
        "@id": `${homeUrl}#ai-growth`,
        name: "AI Growth",
        serviceType: locale === "fr" ? "Optimisation SEO et visibilité IA" : "SEO and AI visibility optimization",
        provider: { "@id": `${SITE_URL}/#organization` },
        url: `${homeUrl}#pricing`,
        offers: Object.values(GROWTH_PLANS).map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          url: `${homeUrl}#pricing`,
          price: String(plan.monthlyEur),
          priceCurrency: "EUR",
          description: locale === "fr" ? "Tarif pilote HT par mois, engagement initial de 3 mois, sur devis." : "Pilot monthly price excluding tax, 3-month initial commitment, subject to quote.",
        })),
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: [
          {
            "@type": "Offer",
            price: "0",
            priceCurrency: DEFAULT_CURRENCY_BY_LOCALE[locale].toUpperCase(),
            description: locale === "fr" ? "Audit IA gratuit" : "Free AI audit",
          },
          ...CURRENCIES.map((currency) => ({
            "@type": "Offer",
            name: "Pro monitoring",
            url: `${homeUrl}#pricing`,
            price: String(PRICES.pro[currency]),
            priceCurrency: currency.toUpperCase(),
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: String(PRICES.pro[currency]),
              priceCurrency: currency.toUpperCase(),
              unitText: "MONTH",
            },
          })),
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteHeader locale={locale} path="/" links={copy.nav} ctaLong={locale === "fr" ? "Mon plan gratuit" : "My free plan"} ctaShort={locale === "fr" ? "Plan gratuit" : "Free plan"} />

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-foreground/8">
          <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-28 top-24 size-[420px] rounded-full bg-lime-200/35 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-32 top-8 size-[480px] rounded-full bg-emerald-200/30 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto grid min-w-0 max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-24">
            <div className="min-w-0 max-w-2xl animate-fade-in-up">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
                <Sparkles className="size-3.5 text-lime-600" aria-hidden="true" />
                {copy.eyebrow}
              </div>

              <h1 className="text-balance text-[2.6rem] font-extrabold leading-[1] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-[4.1rem]">
                {copy.titleA}{" "}
                <span className="mt-2 block text-emerald-700">{copy.titleB}</span>
              </h1>

              <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">{copy.intro}</p>

              <HeroForm intent="growth" locale={locale} />

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
                {copy.trust.map((item) => (
                  <span className="flex items-center gap-1.5" key={item}>
                    <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> {item}
                  </span>
                ))}
              </div>
            </div>

            {locale === "fr" && <FrenchAnalysisPreview />}
            {scan && (
              <div id="proof" className="relative mx-auto w-full min-w-0 max-w-2xl scroll-mt-24 animate-fade-in-up lg:mx-0" style={{ animationDelay: "120ms" }}>
                <div className="absolute -inset-5 -rotate-2 rounded-[2.25rem] bg-primary/8" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[#173b35] p-3 shadow-2xl shadow-primary/20 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-lime-300">{copy.proofLabel}</p>
                    <p className="text-xs font-semibold text-white/60">{scan.cityLabel}{copy.proofCountry} · {copy.proofCity}</p>
                  </div>

                  <div className="mt-2 rounded-[1.35rem] bg-white p-4 sm:p-6">
                    <p className="text-lg font-extrabold leading-7 tracking-tight sm:text-xl" lang="en">
                      {`“${heroQuery}”`}
                    </p>

                    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {scan.engines.map((engine) => (
                        <div className="min-w-0 rounded-2xl bg-[#f3f4ed] p-3.5" key={engine.engine}>
                          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
                            <span className={`size-2 rounded-full ${engineDots[engine.engine] ?? "bg-slate-400"}`} />
                            {engine.engine}
                          </p>
                          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-semibold marker:font-semibold marker:text-muted-foreground">
                            {engine.businesses.map((business) => (
                              <li className="break-words pl-0.5" key={business}>
                                {business}
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="font-extrabold text-amber-900">{copy.proofNamed(scan.businesses.length)}</p>
                      <p className="mt-1 text-sm leading-6 text-amber-900/75">{copy.proofFoot}</p>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-muted-foreground">{copy.measured(scanDate(scan.scannedAt, locale))}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="border-b border-foreground/8 bg-white" aria-label={copy.benefits[0].title}>
          <div className="mx-auto grid max-w-7xl divide-y divide-foreground/8 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
            {copy.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <div className="flex gap-4 py-7 sm:px-6 sm:first:pl-0 sm:last:pr-0" key={benefit.title}>
                  <Icon className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <div>
                    <p className="font-extrabold">{benefit.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{benefit.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-b border-foreground/8 bg-[#f3f4ed] py-10" aria-labelledby="coverage-heading">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <h2 id="coverage-heading" className="text-xl font-extrabold">{locale === "fr" ? "Google AI, ChatGPT et les moteurs IA : un travail adapté à chaque canal." : "Google AI, ChatGPT and AI search: work suited to each channel."}</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">{locale === "fr" ? "Nous travaillons les fondamentaux SEO pour Google AI Overviews et AI Mode. Le suivi automatisé mesure les réponses des modèles disponibles : ChatGPT, Claude, Gemini et Perplexity, selon la configuration de l’analyse. Gemini n’est pas une mesure de Google AI Overviews ou d’AI Mode." : "We work on SEO fundamentals for Google AI Overviews and AI Mode. Automated tracking measures available model responses: ChatGPT, Claude, Gemini and Perplexity, depending on scan configuration. Gemini is not a measurement of Google AI Overviews or AI Mode."}</p>
            <a className="mt-3 inline-block text-sm font-bold text-emerald-700 underline-offset-4 hover:underline" href="https://developers.google.com/search/docs/appearance/ai-features">{locale === "fr" ? "Les recommandations officielles de Google" : "Google’s official guidance"} →</a>
          </div>
        </section>

        {copy.stats.length > 0 && (
          <section className="bg-[#173b35] py-16 text-white sm:py-20" aria-labelledby="stats-heading">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
              <p id="stats-heading" className="text-sm font-extrabold uppercase tracking-[0.16em] text-lime-300">{copy.statsLabel}</p>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {copy.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-5xl font-black tracking-[-0.05em] text-white">{stat.value}</p>
                    <p className="mt-2 max-w-56 text-sm font-semibold leading-6 text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-sm text-white/60">
                {copy.statsNote}{" "}{locale === "fr" ? "Ces relevés ne sont pas des résultats clients avant/après." : "These measurements are not client before-and-after results."}{" "}
                <Link className="font-bold text-lime-300 hover:underline" href="/study">{copy.statsLink} →</Link>
              </p>
            </div>
          </section>
        )}

        <section id="method" className="scroll-mt-24 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">{copy.methodEyebrow}</p>
              <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">{copy.methodTitle}</h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {copy.steps.map(({ title, description }, index) => {
                const Icon = stepIcons[index];
                return (
                  <article className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-[#f8f8f3] p-7 transition-transform hover:-translate-y-1" key={title}>
                    <span className="absolute right-6 top-6 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{copy.step} 0{index + 1}</span>
                    <span className="relative flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="relative mt-8 text-xl font-extrabold tracking-tight">{title}</h3>
                    <p className="relative mt-3 leading-7 text-muted-foreground">{description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="demo" className="scroll-mt-20 overflow-hidden bg-[#173b35] py-20 text-white sm:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-lime-300">{copy.demoEyebrow}</p>
              <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">{copy.demoTitle}</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">{copy.demoIntro}</p>
              <Button asChild size="lg" className="mt-8 h-13 rounded-full bg-lime-300 px-6 text-[#173b35] hover:bg-lime-200">
                <Link href={onboarding} data-analytics-event="select_content" data-analytics-label="sample_report_scan">
                  {copy.demoCta} <ArrowRight className="ml-2 size-5" aria-hidden="true" />
                </Link>
              </Button>
              <Link
                className="mt-5 block w-fit text-sm font-bold text-lime-300 underline-offset-4 hover:underline"
                href={localePath(locale, "/sample-report")}
                data-analytics-event="select_content"
                data-analytics-label="demo_sample_report"
              >
                {copy.demoSample} →
              </Link>
            </div>

            <div className="rounded-[1.75rem] border border-white/12 bg-white/7 p-3 backdrop-blur sm:p-5">
              <div className="rounded-[1.25rem] bg-[#f8f8f3] p-5 text-foreground sm:p-7">
                <div className="flex flex-col gap-4 border-b border-foreground/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{copy.demoPlan}</p>
                    <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{copy.demoHeading}</h3>
                  </div>
                  <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">{copy.demoPriority}</span>
                </div>
                <div className="mt-5 space-y-3">
                  {copy.demoActions.map(([title, detail, category], index) => (
                    <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-white p-4" key={title}>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold">{title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p>
                      </div>
                      <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 sm:block">{category}</span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <GrowthOffers locale={locale} />

        <section id="faq" className="scroll-mt-20 border-t border-foreground/8 bg-white py-20 sm:py-28" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="text-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">FAQ</p>
              <h2 id="faq-heading" className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">{copy.faqTitle}</h2>
            </div>
            <div className="mt-12 space-y-4">
              {copy.faqs.map((faq) => (
                <details className="group rounded-2xl border border-foreground/8 bg-[#f8f8f3] p-6 open:bg-white open:shadow-sm" key={faq.question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="mt-4 leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="text-muted-foreground">
                {copy.faqMore[0]} <Link className="font-bold text-emerald-700 hover:underline" href="/guides">{copy.faqMore[1]}</Link>{copy.faqMore[2] === "." ? "." : ` ${copy.faqMore[2]}`}
              </p>
            </div>
          </div>
        </section>

        {locale === "en" && (
          <section className="border-t border-foreground/8 bg-white py-14" aria-labelledby="contractor-seo-heading">
            <div className="mx-auto max-w-3xl px-5 sm:px-8">
              <h2 id="contractor-seo-heading" className="text-2xl font-extrabold tracking-[-0.03em]">
                Contractor SEO by city
              </h2>
              <p className="mt-3 text-foreground/75">
                How AI engines answer &ldquo;best contractor&rdquo; questions in each metro — measured across ChatGPT, Claude, Gemini and Perplexity.
              </p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {contractorSeoCities.map(({ city }) => {
                  const cityData = getCity(city);
                  if (!cityData) return null;
                  return (
                    <li key={city}>
                      <Link className="font-semibold text-emerald-700 hover:underline" href={`/contractor-seo/${city}`}>
                        Contractor SEO in {cityData.name}, {cityData.stateCode}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-lime-200 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h2 className="text-balance text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">{copy.finalTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-primary/75">{copy.finalText}</p>
            <div className="mx-auto max-w-xl text-left">
              <HeroForm intent="growth" locale={locale} showSample={false} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
