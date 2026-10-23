import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ListChecks,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { CurrencyToggle } from "@/components/currency-toggle";
import { HeroForm } from "@/components/hero-form";
import { Price } from "@/components/price";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { formatScanDate, getBenchmarkStats, getCityScan, getScannedPairs, type CityScan } from "@/lib/city-scans";
import { DATE_LOCALE, DEFAULT_CURRENCY_BY_LOCALE, localePath, type Locale } from "@/lib/i18n";
import { CURRENCIES, DONE_FOR_YOU_PRICE, PRICES } from "@/lib/pricing";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** French translations of the hero questions. The engines were asked in
 *  English; the French page shows the translation and says so. */
const HERO_QUERY_FR: Partial<Record<string, string>> = {
  "plumbers__dallas-tx": "Quel est le plombier d’urgence le plus fiable à Dallas, au Texas, pour une canalisation qui a éclaté\u202f?",
};

/** The real scan shown in the hero. Falls back to any published scan. */
function getHeroScan(locale: Locale): CityScan | null {
  const hasTranslation = (scan: CityScan) =>
    locale === "en" || Boolean(HERO_QUERY_FR[`${scan.industry}__${scan.city}`]);
  const preferred = getCityScan("plumbers", "dallas-tx");
  if (preferred && hasTranslation(preferred)) return preferred;
  for (const pair of getScannedPairs()) {
    const scan = getCityScan(pair.industry, pair.city);
    if (scan && hasTranslation(scan)) return scan;
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

  if (locale === "fr") {
    return {
      nav: [
        { href: "#proof", label: "Preuve" },
        { href: "#method", label: "Comment ça marche" },
        { href: "/fr/sample-report", label: "Exemple de rapport" },
        { href: "#pricing", label: "Tarifs" },
        { href: "/guides", label: "Guides" },
      ],
      eyebrow: "La visibilité IA pour les entreprises locales",
      titleA: "ChatGPT recommande vos concurrents.",
      titleB: "Et vous\u00a0?",
      intro:
        "Vos clients demandent désormais à une IA quel artisan, quel dentiste ou quel avocat choisir. GetInTheAnswer vous montre en 2 minutes qui elle recommande à votre place, et ce qu’il faut corriger pour être dans la réponse.",
      trust: ["Gratuit, sans carte bancaire", "Résultat en 1 à 2 minutes", "ChatGPT, Claude, Gemini, Perplexity"],
      proofLabel: "Question réelle posée aux IA",
      proofCity: "Étude GetInTheAnswer",
      proofCountry: " (États-Unis)",
      proofNote: "Question traduite en français. Les entreprises sont affichées sous leur nom d’origine.",
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
      methodEyebrow: "Simple par construction",
      methodTitle: "De votre site à un plan d’action en trois étapes.",
      steps: [
        {
          title: "Décrivez votre entreprise",
          description: "Votre métier, votre ville et vos prestations suffisent pour générer les questions que vos prospects posent vraiment.",
        },
        {
          title: "Nous interrogeons les IA",
          description: "GetInTheAnswer pose ces questions à ChatGPT, Claude, Gemini et Perplexity, et relève qui est cité : vous ou vos concurrents.",
        },
        {
          title: "Vous savez quoi corriger",
          description: "Chaque faiblesse est reliée à une action concrète, classée par priorité et par impact estimé.",
        },
      ],
      step: "Étape",
      demoEyebrow: "Un rapport qui mène quelque part",
      demoTitle: "Voyez ce que voient les IA. Corrigez ce qu’elles ignorent.",
      demoIntro: "Le rapport relie chaque faiblesse détectée à une action éditoriale ou technique, avec une priorité et un impact estimé.",
      demoCta: "Créer mon premier rapport",
      demoSample: "Voir l’exemple de rapport complet",
      demoPlan: "Exemple de plan d’action",
      demoHeading: "3 opportunités à fort impact",
      demoPriority: "Priorité haute",
      demoActions: [
        ["Créer une page FAQ locale", "Répondre aux questions fréquentes de vos clients", "Contenu"],
        ["Structurer vos données", "Ajouter le balisage schema LocalBusiness", "Balisage"],
        ["Renforcer votre page Prestations", "Détailler vos zones d’intervention et spécialités", "Services"],
      ],
      benefits: [
        { title: "Un score compréhensible", text: "Votre position en un coup d’œil." },
        { title: "Des preuves, pas des intuitions", text: "Chaque réponse d’IA reste consultable." },
        { title: "Des actions priorisées", text: "Commencez par ce qui compte le plus." },
      ],
      pricingEyebrow: "Commencez sans risque",
      pricingTitle: "Votre première analyse est offerte.",
      pricingIntro: "Découvrez gratuitement où vous en êtes, puis suivez votre visibilité IA ou laissez-nous la corriger pour vous.",
      currencyLabel: "Devise d’affichage",
      free: {
        name: "Analyse découverte",
        note: "sans carte bancaire",
        items: ["10 questions clients sur mesure", "Analyse sur les vrais moteurs IA", "Votre score de visibilité", "Votre concurrent n°1 révélé"],
        cta: "Essayer gratuitement",
      },
      pro: {
        name: "Suivi Pro",
        badge: "Le plus choisi",
        note: "/ mois · résiliable à tout moment",
        items: ["Tous les concurrents nommés", "Les réponses réelles des IA, citées", "Le plan d’action complet", "Nouvelle analyse chaque semaine", "Historique de votre score"],
        cta: "Commencer par l’analyse gratuite",
      },
      agency: {
        name: "Agence & multi-établissements",
        note: "/ mois",
        items: ["Jusqu’à 25 établissements", "Rapports clients en marque blanche", "Analyses IA par lots", "Suivi des concurrents par ville", "Support agence prioritaire"],
        cta: "Nous contacter",
      },
      dfy: {
        eyebrow: "Pas le temps de vous en occuper ?",
        title: "On corrige pour vous.",
        text: "Nous appliquons nous-mêmes votre plan d’action, puis nous refaisons l’analyse 30 jours plus tard pour mesurer le résultat.",
        items: [
          "Page FAQ locale rédigée et publiée sur votre site",
          "Données structurées LocalBusiness installées",
          "Nom, adresse et téléphone harmonisés sur les principaux annuaires",
          "Page Prestations renforcée pour les IA",
          "Nouvelle analyse après 30 jours, avec le score avant/après",
        ],
        priceNote: "paiement unique",
        cta: "Demander l’offre « on corrige pour vous »",
        fine: "Nous vérifions d’abord votre site et confirmons le devis avant tout paiement.",
      },
      pricingFine:
        "Choisissez votre devise ci-dessus : vous êtes débité dans celle que vous avez sélectionnée. Les paiements Pro sont traités de façon sécurisée par Stripe, les taxes applicables sont calculées au paiement, et vous pouvez résilier en ligne à tout moment.",
      faqTitle: "Vos questions, nos réponses.",
      faqMore: ["Envie d’aller plus loin ? Consultez nos", "guides sur la visibilité IA et le GEO", "(en anglais)."],
      finalTitle: "Vos concurrents sont peut-être déjà dans la réponse.",
      finalText: "Vérifiez gratuitement ce que ChatGPT, Claude, Gemini et Perplexity disent de votre marché.",
      faqs: [
        {
          question: "Qu’est-ce qu’un score de visibilité IA ?",
          answer:
            "Votre score de visibilité IA (0–100) mesure la fréquence à laquelle les moteurs IA comme ChatGPT citent votre entreprise lorsqu’un consommateur demande une recommandation dans votre métier et votre ville. Nous posons les vraies questions que posent vos clients, puis nous calculons le pourcentage de réponses qui nomment votre entreprise.",
        },
        {
          question: "L’analyse gratuite est-elle vraiment gratuite ?",
          answer:
            "Oui. Nous générons 10 questions clients adaptées à votre marché et nous les testons sur les moteurs IA disponibles. Vous obtenez votre score de visibilité et votre concurrent n°1 sans payer et sans carte bancaire. Le plan Pro débloque tous les concurrents, toutes les réponses et toutes les actions, ainsi que l’analyse hebdomadaire.",
        },
        {
          question: "Comment savez-vous si une IA cite mon entreprise ?",
          answer:
            "Nous posons aux moteurs IA les questions que vos clients locaux posent réellement, dans leurs mots, puis nous analysons chaque réponse pour détecter les mentions de votre marque — y compris les variantes de votre nom — et pour identifier chaque concurrent recommandé à votre place.",
        },
        {
          question: "Pourquoi ChatGPT ne recommande-t-il pas mon entreprise ?",
          answer:
            "Les moteurs IA recommandent les entreprises dont les signaux sont solides, cohérents et vérifiables : fiches d’établissement complètes, avis réguliers, contenu de site rédigé sous forme de réponses, et données structurées. Si ces signaux sont faibles ou incohérents, l’IA cite vos concurrents à votre place. Votre rapport indique précisément quels signaux corriger en premier.",
        },
        {
          question: "Que comprend l’offre « on corrige pour vous » ?",
          answer:
            "Nous appliquons nous-mêmes les actions de votre rapport : page FAQ locale, données structurées, harmonisation de vos coordonnées sur les principaux annuaires et renforcement de votre page Prestations. Trente jours plus tard, nous refaisons l’analyse pour vous montrer l’évolution de votre score. Nous confirmons le devis après avoir vu votre site, avant tout paiement.",
        },
        {
          question: "À quelle fréquence ma visibilité est-elle revérifiée ?",
          answer:
            "Les abonnés Pro bénéficient d’une nouvelle analyse automatique chaque semaine. Les réponses des IA évoluent au rythme des mises à jour des modèles, donc un suivi hebdomadaire montre si vos améliorations portent leurs fruits et vous alerte quand un concurrent vous dépasse.",
        },
        {
          question: "Quelles informations utilisez-vous pour l’analyse ?",
          answer:
            "Nous utilisons la fiche d’entreprise que vous renseignez, le contenu public de votre page d’accueil et les réponses renvoyées par les fournisseurs d’IA. Votre email sert à rattacher le rapport au paiement si vous passez au plan Pro. Nous ne vendons pas vos informations.",
        },
        {
          question: "La TVA est-elle appliquée ?",
          answer:
            "Si une taxe s’applique, Stripe la calcule à partir de votre adresse de facturation et en affiche le montant exact avant la souscription. Vous voyez toujours le total complet avant de confirmer le paiement.",
        },
      ] satisfies Faq[],
    };
  }

  return {
    nav: [
      { href: "#proof", label: "Proof" },
      { href: "#method", label: "How it works" },
      { href: "/sample-report", label: "Sample report" },
      { href: "#pricing", label: "Pricing" },
      { href: "/guides", label: "Guides" },
    ],
    eyebrow: "AI visibility for local businesses",
    titleA: "ChatGPT is recommending your competitors.",
    titleB: "Is it recommending you?",
    intro:
      "Your customers now ask AI which plumber, dentist or lawyer to call. GetInTheAnswer shows you in 2 minutes who it recommends instead of you — and exactly what to fix to get into the answer.",
    trust: ["Free, no credit card", "Results in 1–2 minutes", "ChatGPT, Claude, Gemini, Perplexity"],
    proofLabel: "A real question we asked the AIs",
    proofCity: "GetInTheAnswer study",
    proofCountry: "",
    proofNote: "",
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
    methodEyebrow: "Simple by design",
    methodTitle: "From your website to an action plan in three steps.",
    steps: [
      {
        title: "Describe your business",
        description: "Your trade, your city and your services are enough to generate the questions your prospects actually ask.",
      },
      {
        title: "We ask the AI engines",
        description: "GetInTheAnswer asks those questions to ChatGPT, Claude, Gemini and Perplexity, and records who gets named: you or your competitors.",
      },
      {
        title: "You know what to fix",
        description: "Every weakness is tied to a concrete action, ranked by priority and estimated impact.",
      },
    ],
    step: "Step",
    demoEyebrow: "A report that leads somewhere",
    demoTitle: "See what AI sees. Fix what it ignores.",
    demoIntro: "The report ties every weakness it finds to an editorial or technical action, with a priority and an estimated impact.",
    demoCta: "Create my first report",
    demoSample: "See the full sample report",
    demoPlan: "Example action plan",
    demoHeading: "3 high-impact opportunities",
    demoPriority: "High priority",
    demoActions: [
      ["Publish a local FAQ page", "Answer your customers’ common questions", "Content"],
      ["Structure your data", "Add LocalBusiness schema markup", "Markup"],
      ["Strengthen your Services page", "Spell out your service areas and specialties", "Services"],
    ],
    benefits: [
      { title: "A score you understand", text: "Where you stand, at a glance." },
      { title: "Evidence, not guesswork", text: "Every AI answer stays on record." },
      { title: "Prioritized actions", text: "Start with what matters most." },
    ],
    pricingEyebrow: "Start risk-free",
    pricingTitle: "Your first scan is on us.",
    pricingIntro: "See where you stand for free, then track your AI visibility — or let us fix it for you.",
    currencyLabel: "Display currency",
    free: {
      name: "Discovery scan",
      note: "no credit card",
      items: ["10 tailored customer questions", "Run on the real AI engines", "Your visibility score", "Your #1 competitor revealed"],
      cta: "Try it free",
    },
    pro: {
      name: "Pro monitoring",
      badge: "Most popular",
      note: "/ month · cancel anytime",
      items: ["Every competitor named", "The real AI answers, quoted", "The full action plan", "A fresh scan every week", "Your score history"],
      cta: "Start with the free scan",
    },
    agency: {
      name: "Agency & multi-location",
      note: "/ month",
      items: ["Up to 25 locations", "White-label client reports", "Batch AI scans", "City-level competitor tracking", "Priority agency support"],
      cta: "Contact us",
    },
    dfy: {
      eyebrow: "No time to do it yourself?",
      title: "We fix it for you.",
      text: "We implement your action plan ourselves, then re-run the scan 30 days later so you can see what changed.",
      items: [
        "Local FAQ page written and published on your site",
        "LocalBusiness structured data installed",
        "Name, address and phone made consistent on the main directories",
        "Services page strengthened for AI engines",
        "Re-scan after 30 days, with your before/after score",
      ],
      priceNote: "one-time",
      cta: "Request the done-for-you fix",
      fine: "We review your site and confirm the quote before you pay anything.",
    },
    pricingFine:
      "Pick your currency above: you’re charged in the one you select. Pro payments are processed securely by Stripe, applicable taxes are calculated at checkout, and you can cancel online at any time.",
    faqTitle: "Your questions, answered.",
    faqMore: ["Want to go deeper? Read our", "guides on AI visibility and GEO", "."],
    finalTitle: "Your competitors may already be in the answer.",
    finalText: "Check for free what ChatGPT, Claude, Gemini and Perplexity say about your market.",
    faqs: [
      {
        question: "What is an AI visibility score?",
        answer:
          "Your AI visibility score (0–100) measures how often AI engines like ChatGPT name your business when a consumer asks for a recommendation in your trade and city. We ask the real questions your customers ask, then calculate the share of answers that name your business.",
      },
      {
        question: "Is the free scan really free?",
        answer:
          "Yes. We generate 10 customer questions tailored to your market and test them on the available AI engines. You get your visibility score and your #1 competitor without paying and without a credit card. The Pro plan unlocks every competitor, every answer and every action, plus a weekly re-scan.",
      },
      {
        question: "How do you know whether an AI mentions my business?",
        answer:
          "We ask AI engines the questions your local customers actually ask, in their own words, then analyze each answer to detect mentions of your brand — including partial or informal variations of your name — and to identify every competitor recommended instead of you.",
      },
      {
        question: "Why isn’t ChatGPT recommending my business?",
        answer:
          "AI engines recommend businesses whose signals are strong, consistent and verifiable: complete business listings, steady reviews, website content written as answers, and structured data. When those signals are weak or inconsistent, the AI names your competitors instead. Your report shows exactly which signals to fix first.",
      },
      {
        question: "What does the done-for-you fix include?",
        answer:
          "We implement the actions from your report ourselves: a local FAQ page, structured data, consistent contact details across the main directories, and a stronger Services page. Thirty days later we re-run the scan to show how your score moved. We confirm the quote after reviewing your site, before you pay anything.",
      },
      {
        question: "How often is my visibility re-checked?",
        answer:
          "Pro subscribers get a new automatic scan every week. AI answers change as models and their indexes update, so weekly tracking shows whether your improvements are working and alerts you when a competitor pulls ahead.",
      },
      {
        question: "What information do you use for the scan?",
        answer:
          "We use the business details you enter, the public content of your homepage and the answers returned by the AI providers. Your email links the report to your payment if you upgrade to Pro. We don’t sell your information.",
      },
      {
        question: "Are taxes included?",
        answer:
          "If a tax applies, Stripe calculates it from your billing address and shows the exact amount before you subscribe. You always see the full total before confirming payment.",
      },
    ] satisfies Faq[],
  };
}

const stepIcons = [Search, MessageSquareText, ListChecks];
const benefitIcons = [BarChart3, CircleDot, ShieldCheck];
const engineDots: Record<string, string> = {
  ChatGPT: "bg-emerald-400",
  Claude: "bg-amber-300",
  Gemini: "bg-sky-400",
  Perplexity: "bg-lime-400",
};

export function HomePage({ locale }: { locale: Locale }) {
  const stats = getBenchmarkStats();
  const scan = getHeroScan(locale);
  const copy = getCopy(locale, stats);
  const onboarding = localePath(locale, "/onboarding");
  const homeUrl = `${SITE_URL}${localePath(locale, "/")}`;
  const heroQuery =
    scan && locale === "fr" ? HERO_QUERY_FR[`${scan.industry}__${scan.city}`] : scan?.query;

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
            description: copy.free.name,
          },
          ...CURRENCIES.map((currency) => ({
            "@type": "Offer",
            name: copy.pro.name,
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
      <SiteHeader locale={locale} path="/" links={copy.nav} />

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
                {copy.titleA}
                <span className="mt-2 block text-emerald-700">{copy.titleB}</span>
              </h1>

              <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">{copy.intro}</p>

              <HeroForm locale={locale} />

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
                {copy.trust.map((item) => (
                  <span className="flex items-center gap-1.5" key={item}>
                    <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> {item}
                  </span>
                ))}
              </div>
            </div>

            {scan && (
              <div id="proof" className="relative mx-auto w-full min-w-0 max-w-2xl scroll-mt-24 animate-fade-in-up lg:mx-0" style={{ animationDelay: "120ms" }}>
                <div className="absolute -inset-5 -rotate-2 rounded-[2.25rem] bg-primary/8" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[#173b35] p-3 shadow-2xl shadow-primary/20 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-lime-300">{copy.proofLabel}</p>
                    <p className="text-xs font-semibold text-white/60">{scan.cityLabel}{copy.proofCountry} · {copy.proofCity}</p>
                  </div>

                  <div className="mt-2 rounded-[1.35rem] bg-white p-4 sm:p-6">
                    <p className="text-lg font-extrabold leading-7 tracking-tight sm:text-xl" lang={locale}>
                      {locale === "fr" ? `«\u00a0${heroQuery}\u00a0»` : `“${heroQuery}”`}
                    </p>
                    {copy.proofNote && (
                      <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
                        {copy.proofNote}
                      </p>
                    )}

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
                {copy.statsNote}{" "}
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

        <section id="pricing" className="scroll-mt-20 bg-[#f8f8f3] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">{copy.pricingEyebrow}</p>
            <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">{copy.pricingTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.pricingIntro}</p>

            <div className="mt-7 flex justify-center">
              <CurrencyToggle defaultCurrency={DEFAULT_CURRENCY_BY_LOCALE[locale]} label={copy.currencyLabel} />
            </div>

            <div className="mx-auto mt-10 grid gap-5 text-left lg:grid-cols-3">
              <div className="flex flex-col overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-white shadow-sm">
                <div className="p-6 sm:p-7">
                  <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">{copy.free.name}</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-black tracking-[-0.06em]"><Price amounts={{ eur: 0, usd: 0 }} /></span>
                    <span className="pb-1 text-xs font-semibold text-muted-foreground">{copy.free.note}</span>
                  </div>
                  <div className="mt-6 grid gap-3 text-sm font-semibold">
                    {copy.free.items.map((item) => (
                      <span className="flex items-center gap-2" key={item}><Check className="size-4 text-emerald-700" aria-hidden="true" /> {item}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto border-t border-foreground/8 bg-[#f3f4ed] p-6">
                  <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full bg-white px-6">
                    <Link href={onboarding} data-analytics-event="select_content" data-analytics-label="pricing_free">
                      {copy.free.cta} <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div data-testid="pricing-pro-card" className="flex flex-col overflow-hidden rounded-[1.75rem] bg-[#173b35] text-white shadow-xl shadow-primary/15">
                <div className="p-6 sm:p-7">
                  <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:justify-between">
                    <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-lime-300">{copy.pro.name}</p>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-lime-300 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#173b35]">{copy.pro.badge}</span>
                  </div>
                  <div className="mt-2 flex items-end gap-2">
                    <Price amounts={PRICES.pro} className="text-4xl font-black tracking-[-0.06em]" />
                    <span className="pb-1 text-xs font-semibold text-white/60">{copy.pro.note}</span>
                  </div>
                  <div className="mt-6 grid gap-3 text-sm font-semibold text-white/85">
                    {copy.pro.items.map((item) => (
                      <span className="flex items-center gap-2" key={item}><Check className="size-4 text-lime-300" aria-hidden="true" /> {item}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto border-t border-white/10 p-6">
                  <Button asChild size="lg" className="h-12 w-full rounded-full bg-lime-300 px-6 font-extrabold text-[#173b35] hover:bg-lime-200">
                    <Link href={onboarding} data-analytics-event="select_content" data-analytics-label="pricing_pro">
                      {copy.pro.cta} <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-white shadow-sm">
                <div className="p-6 sm:p-7">
                  <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">{copy.agency.name}</p>
                  <div className="mt-2 flex items-end gap-2">
                    <Price amounts={PRICES.agency} className="text-4xl font-black tracking-[-0.06em]" />
                    <span className="pb-1 text-xs font-semibold text-muted-foreground">{copy.agency.note}</span>
                  </div>
                  <div className="mt-6 grid gap-3 text-sm font-semibold">
                    {copy.agency.items.map((item) => (
                      <span className="flex items-center gap-2" key={item}><Check className="size-4 text-emerald-700" aria-hidden="true" /> {item}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto border-t border-foreground/8 bg-[#f3f4ed] p-6">
                  <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full bg-white px-6">
                    <Link href={localePath(locale, "/contact")} data-analytics-event="select_content" data-analytics-label="pricing_agency_contact">
                      {copy.agency.cta} <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-5 grid gap-8 overflow-hidden rounded-[1.75rem] border-2 border-lime-300 bg-white p-6 text-left shadow-sm sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">
                  <Wrench className="size-4" aria-hidden="true" /> {copy.dfy.eyebrow}
                </p>
                <h3 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">{copy.dfy.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{copy.dfy.text}</p>
                <div className="mt-5 grid gap-2.5 text-sm font-semibold">
                  {copy.dfy.items.map((item) => (
                    <span className="flex items-start gap-2" key={item}><Check className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden="true" /> {item}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.5rem] bg-[#f3f4ed] p-6 text-center">
                <div className="flex items-end justify-center gap-2">
                  <Price amounts={DONE_FOR_YOU_PRICE} className="text-5xl font-black tracking-[-0.06em]" />
                  <span className="pb-1.5 text-xs font-semibold text-muted-foreground">{copy.dfy.priceNote}</span>
                </div>
                <Button asChild size="lg" className="mt-5 h-12 w-full rounded-full px-6 font-extrabold">
                  <Link href={localePath(locale, "/contact?plan=done-for-you")} data-analytics-event="select_content" data-analytics-label="pricing_done_for_you">
                    {copy.dfy.cta} <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{copy.dfy.fine}</p>
              </div>
            </div>

            <p className="mx-auto mt-6 max-w-3xl text-sm font-semibold text-muted-foreground">{copy.pricingFine}</p>
          </div>
        </section>

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

        <section className="bg-lime-200 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h2 className="text-balance text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">{copy.finalTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-primary/75">{copy.finalText}</p>
            <div className="mx-auto max-w-xl text-left">
              <HeroForm locale={locale} showSample={false} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
