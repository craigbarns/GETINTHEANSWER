import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Gauge,
  Info,
  MapPin,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoMark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { localePath, type Locale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const SAMPLE_REPORT_META: Record<Locale, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  en: {
    title: "Sample AI Visibility Report — See What You Get",
    description:
      "A complete example of a GetInTheAnswer report: AI visibility score, coverage by engine, competitor benchmark, website audit and the prioritized action plan. Illustrative sample for a fictional business.",
    ogTitle: "Sample AI Visibility Report — GetInTheAnswer",
    ogDescription: "See exactly what a GetInTheAnswer report contains before you run your own free scan.",
  },
  fr: {
    title: "Exemple de rapport de visibilité IA — ce que vous obtenez",
    description:
      "Un exemple complet de rapport GetInTheAnswer : score de visibilité IA, couverture par moteur, comparaison avec les concurrents, audit du site et plan d’action priorisé. Exemple illustratif pour une entreprise fictive.",
    ogTitle: "Exemple de rapport de visibilité IA — GetInTheAnswer",
    ogDescription: "Voyez exactement ce que contient un rapport GetInTheAnswer avant de lancer votre analyse gratuite.",
  },
};

type Priority = "high" | "medium";

const priorityClass: Record<Priority, string> = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-800",
};

const SAMPLES = {
  en: {
    companyName: "Lakeside Kitchen Co.",
    city: "Austin, TX",
    industry: "Kitchen remodeling",
    website: "lakesidekitchen.com",
    topCompetitor: "Hill Country Cabinetry",
    siteChecks: [
      { key: "schema", label: "LocalBusiness structured data", passed: false, detail: "No LocalBusiness schema found on the homepage. Engines can’t verify your address, hours or service area." },
      { key: "nap", label: "Name, address and phone visible", passed: true, detail: "Your NAP block is present in the footer and matches the format used by directories." },
      { key: "faq", label: "Answer-shaped content", passed: false, detail: "No page answers customer questions directly. Engines prefer content written as questions and answers." },
      { key: "services", label: "Services and service area described", passed: true, detail: "Six services are listed, but only one names a neighborhood or suburb." },
    ],
    queryRows: [
      { question: "Which contractor would you recommend to remodel a kitchen in Austin?", engine: "ChatGPT", mentioned: true, instead: "Hill Country Cabinetry, Barton Creek Kitchens" },
      { question: "Which contractor would you recommend to remodel a kitchen in Austin?", engine: "Claude", mentioned: false, instead: "Hill Country Cabinetry, Congress Ave Remodeling" },
      { question: "Best custom cabinet makers near downtown Austin?", engine: "Perplexity", mentioned: true, instead: "Hill Country Cabinetry" },
      { question: "Who does affordable kitchen renovations in Austin?", engine: "ChatGPT", mentioned: false, instead: "Barton Creek Kitchens, Zilker Home Studio" },
      { question: "I need a kitchen remodeler in Austin who handles permits — any suggestions?", engine: "Claude", mentioned: false, instead: "Congress Ave Remodeling" },
      { question: "Top-rated kitchen remodeling companies in Austin, TX?", engine: "Perplexity", mentioned: true, instead: "Hill Country Cabinetry, Barton Creek Kitchens" },
    ],
    recommendations: [
      { title: "Publish a local FAQ page", description: "Answer the eight questions your customers actually ask — timelines, permits, budget ranges, neighborhoods you serve. Engines quote answer-shaped content far more readily than marketing copy.", priority: "high" as Priority, impact: "+8 pts" },
      { title: "Add LocalBusiness structured data", description: "Mark up your name, address, phone, hours, price range and service area so engines can verify the business behind the website.", priority: "high" as Priority, impact: "+3 pts" },
      { title: "Name your service areas on the Services page", description: "List the suburbs and neighborhoods you cover. Half the tested questions were neighborhood-specific, and your site names only one.", priority: "medium" as Priority, impact: "+1 pt" },
    ],
  },
  fr: {
    companyName: "Cuisines du Vieux-Port",
    city: "Marseille",
    industry: "Rénovation de cuisine",
    website: "cuisinesduvieuxport.fr",
    topCompetitor: "Atelier Lumen Cuisines",
    siteChecks: [
      { key: "schema", label: "Données structurées LocalBusiness", passed: false, detail: "Aucun balisage LocalBusiness sur la page d’accueil. Les IA ne peuvent pas vérifier votre adresse, vos horaires ni votre zone d’intervention." },
      { key: "nap", label: "Nom, adresse et téléphone visibles", passed: true, detail: "Vos coordonnées figurent en pied de page, dans le même format que sur les annuaires." },
      { key: "faq", label: "Contenu rédigé sous forme de réponses", passed: false, detail: "Aucune page ne répond directement aux questions des clients. Les IA privilégient les contenus rédigés en questions-réponses." },
      { key: "services", label: "Prestations et zone d’intervention décrites", passed: true, detail: "Six prestations sont listées, mais une seule mentionne un quartier ou une commune." },
    ],
    queryRows: [
      { question: "Quel artisan recommanderiez-vous pour rénover une cuisine à Marseille ?", engine: "ChatGPT", mentioned: true, instead: "Atelier Lumen Cuisines, Maison Calanque Agencement" },
      { question: "Quel artisan recommanderiez-vous pour rénover une cuisine à Marseille ?", engine: "Claude", mentioned: false, instead: "Atelier Lumen Cuisines, Cuisines Fil d’Azur" },
      { question: "Meilleurs cuisinistes sur mesure près du Vieux-Port ?", engine: "Perplexity", mentioned: true, instead: "Atelier Lumen Cuisines" },
      { question: "Qui fait des rénovations de cuisine à prix raisonnable à Marseille ?", engine: "ChatGPT", mentioned: false, instead: "Maison Calanque Agencement, Rénov Septème" },
      { question: "Je cherche un cuisiniste à Marseille qui gère aussi la plomberie, des conseils ?", engine: "Claude", mentioned: false, instead: "Cuisines Fil d’Azur" },
      { question: "Les cuisinistes les mieux notés à Marseille ?", engine: "Perplexity", mentioned: true, instead: "Atelier Lumen Cuisines, Maison Calanque Agencement" },
    ],
    recommendations: [
      { title: "Publier une page FAQ locale", description: "Répondez aux huit questions que vos clients posent vraiment : délais, budget, démarches, quartiers desservis. Les IA citent bien plus volontiers un contenu rédigé en réponses qu’un texte commercial.", priority: "high" as Priority, impact: "+8 pts" },
      { title: "Ajouter les données structurées LocalBusiness", description: "Balisez votre nom, votre adresse, votre téléphone, vos horaires, votre gamme de prix et votre zone d’intervention pour que les IA puissent vérifier l’entreprise derrière le site.", priority: "high" as Priority, impact: "+3 pts" },
      { title: "Nommer vos zones d’intervention sur la page Prestations", description: "Listez les quartiers et communes que vous couvrez. La moitié des questions testées citaient un quartier, et votre site n’en nomme qu’un.", priority: "medium" as Priority, impact: "+1 pt" },
    ],
  },
};

const COPY = {
  en: {
    home: "Home",
    homeAria: "GetInTheAnswer, home",
    cta: "Run my free scan",
    crumb: "Sample report",
    noticeTitle: "This is an illustrative sample report",
    notice: (company: string) =>
      `${company} is a fictional business, and every score, competitor and answer below was written to show the layout of the report — not measured. Your own report is built from live answers returned by the AI engines about your real business, in your real city.`,
    complete: "Analysis complete",
    heading: (company: string) => `Here’s how AI engines see ${company}.`,
    tested: (questions: number, engines: number, checks: number) => `${questions} customer questions tested across ${engines} AI engines, for ${checks} answer checks.`,
    snapshot: "a single-sample snapshot; AI answers can vary between runs.",
    scoreAria: (score: number) => `Visibility score ${score} out of 100`,
    outOf: "OUT OF 100",
    scoreLabel: "Solid, not safe",
    scoreCopy: "You appear in most answers, but the market leader is cited more often.",
    metricsAria: "Key metrics",
    mentions: "Mentions",
    mentionRate: (rate: number) => `Your brand is cited in ${rate}% of tests.`,
    leader: "Leading competitor",
    leaderMentions: (count: number) => `${count} mentions detected.`,
    gap: "Competitive gap",
    gapText: "mentions behind the leader.",
    actions: "Priority actions",
    actionsText: "Your roadmap is ready.",
    coverageEyebrow: "Coverage by engine",
    coverageTitle: "Where are you visible?",
    historyEyebrow: "Weekly tracking",
    historyTitle: "Score history",
    historyText: "Pro re-scans every week, so you can see whether the actions you shipped moved the score.",
    historyAria: "Visibility score over time",
    auditEyebrow: "Website audit",
    auditTitle: "Your site vs what AI engines need",
    auditText: "We fetch your homepage and check the signals engines use to verify and recommend a business.",
    signals: (passed: number, total: number) => `${passed}/${total} signals present`,
    planEyebrow: "Action plan",
    planTitle: "Your next moves",
    planText: "Ranked by urgency and estimated impact.",
    priority: { high: "High", medium: "Medium" } as Record<Priority, string>,
    dataEyebrow: "Scan data",
    dataTitle: "Scan details",
    dataText: (checks: number) => `Every question-and-engine check used to calculate the score, with the competitors the engine named instead. Six of the ${checks} checks are shown here.`,
    colQuestion: "Question tested",
    colEngine: "Engine",
    colMention: "Mention",
    colInstead: "Recommended instead",
    mentioned: "Mentioned",
    notMentioned: "Not mentioned",
    finalTitle: "Now run the same report on your business.",
    finalText: "The free scan gives you your real score, your real engine coverage and your #1 competitor. No credit card.",
    finalCta: "Start my free analysis",
  },
  fr: {
    home: "Accueil",
    homeAria: "GetInTheAnswer, accueil",
    cta: "Lancer mon analyse gratuite",
    crumb: "Exemple de rapport",
    noticeTitle: "Ceci est un exemple de rapport illustratif",
    notice: (company: string) =>
      `${company} est une entreprise fictive : chaque score, chaque concurrent et chaque réponse ci-dessous a été rédigé pour montrer la présentation du rapport, et n’a pas été mesuré. Votre rapport, lui, est construit à partir des vraies réponses des IA sur votre entreprise, dans votre ville.`,
    complete: "Analyse terminée",
    heading: (company: string) => `Voici comment les moteurs IA voient ${company}.`,
    tested: (questions: number, engines: number, checks: number) => `${questions} questions clients testées sur ${engines} moteurs IA, soit ${checks} vérifications de réponses.`,
    snapshot: "une mesure ponctuelle : les réponses des IA peuvent varier d’un test à l’autre.",
    scoreAria: (score: number) => `Score de visibilité ${score} sur 100`,
    outOf: "SUR 100",
    scoreLabel: "Solide, mais fragile",
    scoreCopy: "Vous apparaissez dans la plupart des réponses, mais le leader du marché est cité plus souvent.",
    metricsAria: "Indicateurs clés",
    mentions: "Mentions",
    mentionRate: (rate: number) => `Votre marque est citée dans ${rate} % des tests.`,
    leader: "Concurrent en tête",
    leaderMentions: (count: number) => `${count} mentions détectées.`,
    gap: "Écart concurrentiel",
    gapText: "mentions de retard sur le leader.",
    actions: "Actions prioritaires",
    actionsText: "Votre feuille de route est prête.",
    coverageEyebrow: "Couverture par moteur",
    coverageTitle: "Où êtes-vous visible ?",
    historyEyebrow: "Suivi hebdomadaire",
    historyTitle: "Historique du score",
    historyText: "Le plan Pro refait l’analyse chaque semaine : vous voyez si les actions mises en place font monter le score.",
    historyAria: "Évolution du score de visibilité",
    auditEyebrow: "Audit du site",
    auditTitle: "Votre site face aux attentes des moteurs IA",
    auditText: "Nous analysons votre page d’accueil et vérifions les signaux qu’utilisent les IA pour vérifier et recommander une entreprise.",
    signals: (passed: number, total: number) => `${passed}/${total} signaux présents`,
    planEyebrow: "Plan d’action",
    planTitle: "Vos prochaines actions",
    planText: "Classées par urgence et impact estimé.",
    priority: { high: "Haute", medium: "Moyenne" } as Record<Priority, string>,
    dataEyebrow: "Données de l’analyse",
    dataTitle: "Détail de l’analyse",
    dataText: (checks: number) => `Chaque couple question-moteur utilisé pour calculer le score, avec les concurrents cités à votre place. Six des ${checks} vérifications sont affichées ici.`,
    colQuestion: "Question testée",
    colEngine: "Moteur",
    colMention: "Mention",
    colInstead: "Recommandé à votre place",
    mentioned: "Marque citée",
    notMentioned: "Marque non citée",
    finalTitle: "Lancez maintenant le même rapport sur votre entreprise.",
    finalText: "L’analyse gratuite vous donne votre vrai score, votre couverture réelle par moteur et votre concurrent n°1. Sans carte bancaire.",
    finalCta: "Lancer mon analyse gratuite",
  },
};

const FIGURES = {
  score: 68,
  totalChecks: 30,
  brandMentions: 20,
  questionCount: 10,
  topCompetitorMentions: 26,
};

const engineStats = [
  { engine: "ChatGPT", mentions: 8, total: 10, color: "bg-emerald-500" },
  { engine: "Perplexity", mentions: 7, total: 10, color: "bg-lime-500" },
  { engine: "Claude", mentions: 5, total: 10, color: "bg-amber-400" },
];

const scoreHistory = [
  { date: "05-12", score: 51 },
  { date: "05-19", score: 55 },
  { date: "05-26", score: 60 },
  { date: "06-02", score: 62 },
  { date: "06-09", score: 68 },
];

export function SampleReportPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const sample = SAMPLES[locale];
  const home = localePath(locale, "/");
  const onboarding = localePath(locale, "/onboarding");
  const url = `${SITE_URL}${localePath(locale, "/sample-report")}`;
  const mentionRate = Math.round((FIGURES.brandMentions / FIGURES.totalChecks) * 100);
  const competitorGap = FIGURES.topCompetitorMentions - FIGURES.brandMentions;
  const passedChecks = sample.siteChecks.filter((check) => check.passed).length;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: copy.home, item: `${SITE_URL}${home}` },
          { "@type": "ListItem", position: 2, name: copy.crumb, item: url },
        ],
      },
      {
        "@type": "WebPage",
        name: SAMPLE_REPORT_META[locale].ogTitle,
        description: SAMPLE_REPORT_META[locale].description,
        url,
        inLanguage: locale === "fr" ? "fr-FR" : "en-US",
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-2 px-5 sm:px-8">
          <Link className="flex items-center gap-2.5" href={home} aria-label={copy.homeAria}>
            <LogoMark className="size-9" />
            <span className="hidden text-xl font-extrabold tracking-[-0.04em] min-[420px]:inline">GetInTheAnswer</span>
          </Link>
          <LanguageSwitcher locale={locale} path="/sample-report" className="ml-auto" />
          <Button asChild className="rounded-full px-5">
            <Link href={onboarding} data-analytics-event="select_content" data-analytics-label="sample_report_header_scan">
              {copy.cta}
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl space-y-6 px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <Link className="flex items-center gap-1.5 transition-colors hover:text-foreground" href={home}>
            <ArrowLeft className="size-4" aria-hidden="true" /> {copy.home}
          </Link>
          <span className="text-foreground/20">/</span>
          <span className="text-foreground">{copy.crumb}</span>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-primary/25 bg-white p-5 sm:p-6">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-200 text-primary">
            <Info className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">{copy.noticeTitle}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.notice(sample.companyName)}</p>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] bg-[#173b35] p-6 text-white shadow-xl shadow-primary/10 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-lime-300/12 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-lime-300 text-[#173b35] hover:bg-lime-300">
                  <Check className="mr-1 size-3" aria-hidden="true" /> {copy.complete}
                </Badge>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white/55">
                  <MapPin className="size-3.5" aria-hidden="true" /> {sample.city} · {sample.industry}
                </span>
              </div>
              <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">{copy.heading(sample.companyName)}</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                {copy.tested(FIGURES.questionCount, engineStats.length, FIGURES.totalChecks)}
              </p>
              <p className="mt-2 text-xs font-semibold text-white/55">
                {sample.website} — {copy.snapshot}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/7 p-5 text-center backdrop-blur sm:flex-row sm:gap-5 sm:p-4 sm:pr-6 sm:text-left">
              <div
                className="flex size-28 shrink-0 items-center justify-center rounded-full p-2"
                style={{ background: `conic-gradient(#bef264 ${FIGURES.score * 3.6}deg, rgba(255,255,255,.12) 0deg)` }}
                aria-label={copy.scoreAria(FIGURES.score)}
              >
                <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#173b35]">
                  <span className="text-4xl font-black tracking-[-0.06em]">{FIGURES.score}</span>
                  <span className="text-[11px] font-bold text-white/75">{copy.outOf}</span>
                </div>
              </div>
              <div className="max-w-56 sm:max-w-40">
                <p className="font-extrabold text-lime-300">{copy.scoreLabel}</p>
                <p className="mt-2 text-sm leading-5 text-white/75">{copy.scoreCopy}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={copy.metricsAria}>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">{copy.mentions}</span>
                <Target className="size-5 text-emerald-700" aria-hidden="true" />
              </div>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em]">
                {FIGURES.brandMentions}
                <span className="text-base font-bold text-muted-foreground">/{FIGURES.totalChecks}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.mentionRate(mentionRate)}</p>
            </CardContent>
          </Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">{copy.leader}</span>
                <Trophy className="size-5 text-amber-500" aria-hidden="true" />
              </div>
              <p className="mt-4 truncate text-2xl font-black tracking-[-0.04em]">{sample.topCompetitor}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.leaderMentions(FIGURES.topCompetitorMentions)}</p>
            </CardContent>
          </Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">{copy.gap}</span>
                <TrendingUp className="size-5 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em]">-{competitorGap}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.gapText}</p>
            </CardContent>
          </Card>
          <Card className="border-foreground/8 bg-lime-200 py-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary/70">{copy.actions}</span>
                <FileText className="size-5 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em]">{sample.recommendations.length}</p>
              <p className="mt-2 text-sm text-primary/70">{copy.actionsText}</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="min-w-0 rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">{copy.coverageEyebrow}</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">{copy.coverageTitle}</h2>
              </div>
              <Gauge className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-7 space-y-6">
              {engineStats.map(({ engine, mentions, total, color }) => {
                const rate = Math.round((mentions / total) * 100);
                return (
                  <div key={engine}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-extrabold">
                        <span className={`size-2.5 rounded-full ${color}`} />
                        {engine}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {mentions}/{total} · {rate}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-foreground/7">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">{copy.historyEyebrow}</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">{copy.historyTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.historyText}</p>
              </div>
              <TrendingUp className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-7 flex items-end gap-3 overflow-x-auto pb-2" aria-label={copy.historyAria}>
              {scoreHistory.map((point) => (
                <div className="flex min-w-14 flex-col items-center gap-2" key={point.date}>
                  <span className="text-sm font-extrabold tabular-nums">{point.score}</span>
                  <div className="flex h-28 w-9 items-end overflow-hidden rounded-lg bg-foreground/6">
                    <div className="w-full rounded-lg bg-emerald-600" style={{ height: `${point.score}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {locale === "fr" ? point.date.split("-").reverse().join("/") : point.date.replace("-", "/")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">{copy.auditEyebrow}</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">{copy.auditTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.auditText}</p>
            </div>
            <Badge variant="outline" className="w-fit bg-white px-3 py-1.5">{copy.signals(passedChecks, sample.siteChecks.length)}</Badge>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {sample.siteChecks.map((check) => (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 ${check.passed ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"}`}
                key={check.key}
              >
                <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${check.passed ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}>
                  {check.passed ? <Check className="size-3.5" aria-hidden="true" /> : <AlertTriangle className="size-3.5" aria-hidden="true" />}
                </span>
                <div>
                  <p className="font-extrabold leading-6">{check.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">{copy.planEyebrow}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">{copy.planTitle}</h2>
            <p className="mt-2 text-muted-foreground">{copy.planText}</p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {sample.recommendations.map((recommendation, index) => (
              <article className="rounded-2xl border border-foreground/10 bg-[#f8f8f3] p-5" key={recommendation.title}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${priorityClass[recommendation.priority]}`}>
                      {copy.priority[recommendation.priority]}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">{recommendation.impact}</span>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em]">{recommendation.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{recommendation.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">{copy.dataEyebrow}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">{copy.dataTitle}</h2>
            <p className="mt-2 text-muted-foreground">{copy.dataText(FIGURES.totalChecks)}</p>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-foreground/8">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-[#f3f4ed]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[420px] px-6 py-4 font-extrabold text-foreground">{copy.colQuestion}</TableHead>
                  <TableHead className="font-extrabold text-foreground">{copy.colEngine}</TableHead>
                  <TableHead className="text-center font-extrabold text-foreground">{copy.colMention}</TableHead>
                  <TableHead className="pr-6 font-extrabold text-foreground">{copy.colInstead}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sample.queryRows.map((row) => (
                  <TableRow key={`${row.question}-${row.engine}`}>
                    <TableCell className="whitespace-normal px-6 py-4 align-top text-sm font-medium leading-6">{row.question}</TableCell>
                    <TableCell className="align-top text-sm font-bold">{row.engine}</TableCell>
                    <TableCell className="text-center align-top">
                      {row.mentioned ? (
                        <CheckCircle2 className="inline size-5 text-emerald-600" aria-label={copy.mentioned} />
                      ) : (
                        <XCircle className="inline size-5 text-red-500" aria-label={copy.notMentioned} />
                      )}
                    </TableCell>
                    <TableCell className="whitespace-normal pr-6 align-top text-sm leading-6 text-muted-foreground">{row.instead}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-[#173b35] p-7 text-white sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">{copy.finalTitle}</h2>
            <p className="mt-2 max-w-xl leading-7 text-white/65">{copy.finalText}</p>
          </div>
          <Button asChild size="lg" className="h-13 shrink-0 rounded-full bg-lime-300 px-6 font-extrabold text-[#173b35] hover:bg-lime-200">
            <Link href={onboarding} data-analytics-event="select_content" data-analytics-label="sample_report_footer_scan">
              {copy.finalCta}
              <ArrowRight className="ml-2 size-5" aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
