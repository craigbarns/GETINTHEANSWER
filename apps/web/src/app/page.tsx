import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Gauge,
  ListChecks,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroForm } from "@/components/hero-form";
import { LogoMark } from "@/components/logo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const faqs = [
  {
    question: "Qu'est-ce qu'un score de visibilité IA ?",
    answer:
      "Votre score de visibilité IA (0–100) mesure la fréquence à laquelle les moteurs IA comme ChatGPT citent votre entreprise lorsqu'un consommateur demande une recommandation dans votre métier et votre ville. Nous posons les vraies questions que posent vos clients, puis nous calculons le pourcentage de réponses qui nomment votre entreprise.",
  },
  {
    question: "L'analyse gratuite est-elle vraiment gratuite ?",
    answer:
      "Oui. Nous générons 10 questions clients adaptées à votre marché et nous les testons sur les moteurs IA disponibles, ce qui représente jusqu'à 30 vérifications de réponses. Vous obtenez votre score de visibilité et votre concurrent n°1 sans payer et sans carte bancaire. Le plan Pro (29 $/mois) débloque tous les concurrents, toutes les réponses et toutes les actions, ainsi que les analyses hebdomadaires.",
  },
  {
    question: "Comment le score de visibilité est-il calculé ?",
    answer:
      "Chaque question client est testée séparément sur ChatGPT, Claude, Gemini et Perplexity lorsque ces moteurs sont disponibles. Chaque couple question-moteur compte pour une vérification. Votre score correspond au pourcentage de ces réponses qui citent votre entreprise, arrondi sur une échelle de 0 à 100.",
  },
  {
    question: "Comment savez-vous si une IA cite mon entreprise ?",
    answer:
      "Nous posons aux moteurs IA les questions que vos clients locaux posent réellement, dans leurs mots, puis nous analysons chaque réponse pour détecter les mentions de votre marque — y compris les variantes partielles ou informelles de votre nom — et pour identifier chaque concurrent recommandé à votre place.",
  },
  {
    question: "Pourquoi ChatGPT ne recommande-t-il pas mon entreprise ?",
    answer:
      "Les moteurs IA recommandent les entreprises dont les signaux sont solides, cohérents et vérifiables : fiches d'établissement complètes, avis réguliers, contenu de site rédigé sous forme de réponses, et données structurées. Si ces signaux sont faibles ou incohérents, l'IA cite vos concurrents à votre place. Votre rapport GetInTheAnswer indique précisément quels signaux corriger en premier.",
  },
  {
    question: "Comment améliorer ma visibilité IA ?",
    answer:
      "Commencez par le plan d'action priorisé de votre rapport : publiez une FAQ locale qui répond aux vraies questions de vos clients, ajoutez les données structurées LocalBusiness à votre site, et gardez vos nom, adresse et téléphone identiques sur tous les annuaires. Suivez ensuite votre score chaque semaine pour voir ce qui le fait bouger.",
  },
  {
    question: "À quelle fréquence ma visibilité est-elle revérifiée ?",
    answer:
      "Les abonnés Pro bénéficient d'une nouvelle analyse automatique chaque semaine. Les réponses des IA évoluent au rythme des mises à jour des modèles et de leurs index, donc un suivi hebdomadaire montre si vos améliorations portent leurs fruits et vous alerte quand un concurrent vous dépasse.",
  },
  {
    question: "Quelles informations utilisez-vous pour l'analyse ?",
    answer:
      "Nous utilisons la fiche d'entreprise que vous renseignez, le contenu public de votre page d'accueil et les réponses renvoyées par les fournisseurs d'IA pour construire votre rapport. Votre email sert à rattacher le rapport au paiement si vous passez au plan Pro. Nous ne vendons pas vos informations.",
  },
  {
    question: "La TVA est-elle appliquée ?",
    answer:
      "Si une taxe s'applique, Stripe la calcule à partir de votre adresse de facturation et en affiche le montant exact avant la souscription. Vous voyez toujours le total complet avant de confirmer le paiement.",
  },
];

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
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "Vérifiez si les moteurs IA comme ChatGPT, Claude, Gemini et Perplexity recommandent votre entreprise locale.",
      inLanguage: "fr-FR",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "GetInTheAnswer mesure la visibilité d'une entreprise locale dans les réponses de ChatGPT, Claude, Gemini et Perplexity, compare ses concurrents et livre un plan d'action priorisé.",
      offers: [
        {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Analyse découverte gratuite — 10 questions clients sur mesure testées sur jusqu'à 4 moteurs IA, sans carte bancaire.",
        },
        {
          "@type": "Offer",
          name: "Pro Monitoring",
          url: `${SITE_URL}/#pricing`,
          price: "29",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "29",
            priceCurrency: "USD",
            unitText: "MONTH",
          },
        },
      ],
    },
  ],
};

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Décrivez votre entreprise",
    description:
      "Votre métier, votre ville et vos prestations suffisent pour générer les questions que vos prospects posent réellement.",
  },
  {
    icon: MessageSquareText,
    number: "02",
    title: "Nous testons les questions",
    description:
      "GetInTheAnswer compare vos mentions et celles de vos concurrents sur ChatGPT, Claude, Gemini et Perplexity.",
  },
  {
    icon: ListChecks,
    number: "03",
    title: "Passez à l'action",
    description:
      "Vous recevez des recommandations concrètes, classées par priorité et par impact estimé.",
  },
];

const engines = [
  { name: "ChatGPT", mentions: 8, total: 10, color: "bg-emerald-400" },
  { name: "Perplexity", mentions: 6, total: 10, color: "bg-lime-400" },
  { name: "Claude", mentions: 5, total: 10, color: "bg-amber-300" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="group flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, accueil">
            <LogoMark className="size-9 transition-transform group-hover:-rotate-3" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-7 md:flex" aria-label="Navigation principale">
            <Link className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="#method">
              Comment ça marche
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="#demo">
              Exemple de rapport
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="#pricing">
              Tarifs
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/guides">
              Guides
            </Link>
          </nav>

          <Button asChild className="ml-auto rounded-full px-5 md:ml-7">
            <Link
              href="/onboarding"
              data-analytics-event="select_content"
              data-analytics-label="header_scan"
            >
              <span className="hidden sm:inline">Analyser mon entreprise</span>
              <span className="sm:hidden">Analyser</span>
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-foreground/8">
          <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-28 top-24 size-[420px] rounded-full bg-lime-200/35 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-32 top-8 size-[480px] rounded-full bg-emerald-200/30 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto grid min-w-0 max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-24">
            <div className="min-w-0 max-w-2xl animate-fade-in-up">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
                <Sparkles className="size-3.5 text-lime-600" aria-hidden="true" />
                La visibilité IA pour les entreprises locales
              </div>

              <h1 className="text-balance text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-[4.6rem]">
                Quand vos clients interrogent une IA,
                <span className="mt-2 block text-emerald-700">êtes-vous dans la réponse ?</span>
              </h1>

              <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
                GetInTheAnswer teste les questions qui comptent pour votre entreprise, compare vos concurrents et transforme les résultats en actions concrètes.
              </p>

              <HeroForm />

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> Sans carte bancaire</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> Résultats en 1 à 2 minutes</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> Des données lisibles</span>
              </div>
            </div>

            <div className="relative mx-auto min-w-0 w-full max-w-2xl animate-fade-in-up lg:mx-0" style={{ animationDelay: "120ms" }}>
              <div className="absolute -inset-5 -rotate-2 rounded-[2.25rem] bg-primary/8" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[#173b35] p-3 shadow-2xl shadow-primary/20 sm:p-4">
                <div className="flex items-center justify-between px-3 py-2 text-primary-foreground/65">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <LogoMark variant="on-dark" className="size-4" />
                    Analyse de visibilité
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="size-2 rounded-full bg-lime-300" />
                    Terminée
                  </div>
                </div>

                <div className="mt-2 rounded-[1.35rem] bg-white p-4 sm:p-6">
                  <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Entreprise analysée</p>
                      <p className="mt-1 text-lg font-extrabold tracking-tight">Lakeside Kitchen Co. · Austin</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      <TrendingUp className="size-3.5" aria-hidden="true" />
                      +12 pts de potentiel
                    </span>
                  </div>

                  <div className="grid gap-4 py-5 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl bg-[#f3f4ed] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">Score IA</p>
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
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">Question testée</p>
                      <p className="mt-2 text-sm font-bold leading-5">&ldquo;Quel artisan recommanderiez-vous pour rénover une cuisine à Austin ?&rdquo;</p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        Marque citée par 2 IA sur 3
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {engines.map((engine) => (
                      <div className="min-w-0 rounded-xl bg-[#173b35] p-3 text-white" key={engine.name}>
                        <div className="mb-3 flex items-center gap-1.5 text-[10px] font-bold text-white/65 sm:text-xs">
                          <span className={`size-2 rounded-full ${engine.color}`} />
                          <span className="truncate">{engine.name}</span>
                        </div>
                        <p className="text-lg font-black sm:text-xl">{engine.mentions}<span className="text-xs font-semibold text-white/75">/{engine.total}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-3 hidden items-center gap-3 rounded-2xl border border-foreground/10 bg-white px-4 py-3 shadow-xl sm:flex">
                <span className="flex size-9 items-center justify-center rounded-xl bg-lime-100 text-primary">
                  <ListChecks className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Priorité détectée</p>
                  <p className="text-sm font-extrabold">Créer une page FAQ locale</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-foreground/8 bg-white" aria-label="Bénéfices clés">
          <div className="mx-auto grid max-w-7xl divide-y divide-foreground/8 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
            <div className="flex gap-4 py-7 sm:px-6 sm:first:pl-0">
              <BarChart3 className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div><p className="font-extrabold">Un score compréhensible</p><p className="mt-1 text-sm text-muted-foreground">Votre position en un coup d’œil.</p></div>
            </div>
            <div className="flex gap-4 py-7 sm:px-6">
              <CircleDot className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div><p className="font-extrabold">Des preuves, pas des intuitions</p><p className="mt-1 text-sm text-muted-foreground">Chaque mention reste traçable.</p></div>
            </div>
            <div className="flex gap-4 py-7 sm:px-6 sm:last:pr-0">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div><p className="font-extrabold">Des actions priorisées</p><p className="mt-1 text-sm text-muted-foreground">Commencez par ce qui compte le plus.</p></div>
            </div>
          </div>
        </section>

        <section id="method" className="scroll-mt-24 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Simple par construction</p>
              <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">De votre site à un plan d’action en trois étapes.</h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {steps.map(({ icon: Icon, number, title, description }) => (
                <article className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-[#f8f8f3] p-7 transition-transform hover:-translate-y-1" key={number}>
                  <span className="absolute right-6 top-6 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Étape {number}</span>
                  <span className="relative flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-8 text-xl font-extrabold tracking-tight">{title}</h3>
                  <p className="relative mt-3 leading-7 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="scroll-mt-20 overflow-hidden bg-[#173b35] py-20 text-white sm:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-lime-300">Un rapport qui mène quelque part</p>
              <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Voyez ce que voient les IA. Corrigez ce qu’elles ignorent.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                Le rapport relie chaque faiblesse détectée à une action éditoriale ou technique, avec une priorité et un impact estimé.
              </p>
              <Button asChild size="lg" className="mt-8 h-13 rounded-full bg-lime-300 px-6 text-[#173b35] hover:bg-lime-200">
                <Link
                  href="/onboarding"
                  data-analytics-event="select_content"
                  data-analytics-label="sample_report_scan"
                >
                  Créer mon premier rapport <ArrowRight className="ml-2 size-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="rounded-[1.75rem] border border-white/12 bg-white/7 p-3 backdrop-blur sm:p-5">
              <div className="rounded-[1.25rem] bg-[#f8f8f3] p-5 text-foreground sm:p-7">
                <div className="flex flex-col gap-4 border-b border-foreground/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Plan d’action recommandé</p>
                    <h3 className="mt-1 text-2xl font-extrabold tracking-tight">3 opportunités à fort impact</h3>
                  </div>
                  <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">Priorité haute</span>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ["Créer une page FAQ locale", "Répondre aux 8 questions clients les plus fréquentes", "+8 pts"],
                    ["Structurer vos données", "Ajouter le balisage schema LocalBusiness", "+3 pts"],
                    ["Renforcer votre page Prestations", "Détailler vos zones d'intervention et spécialités", "+1 pt"],
                  ].map(([title, detail, impact], index) => (
                    <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-white p-4" key={title}>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">{index + 1}</span>
                      <div className="min-w-0 flex-1"><p className="font-extrabold">{title}</p><p className="mt-0.5 text-sm text-muted-foreground">{detail}</p></div>
                      <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 sm:block">{impact}</span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 bg-[#f8f8f3] py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Commencez sans risque</p>
            <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Votre première analyse est offerte.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Découvrez gratuitement où vous en êtes, puis suivez et améliorez votre visibilité IA dans la durée.</p>

            <div className="mx-auto mt-10 grid max-w-6xl gap-5 text-left lg:grid-cols-3">
              <div className="flex flex-col overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-white shadow-sm">
                <div className="p-6 sm:p-7">
                  <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Analyse découverte</p>
                  <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black tracking-[-0.06em]">$0</span><span className="pb-1 text-xs font-semibold text-muted-foreground">sans carte bancaire</span></div>
                  <div className="mt-6 grid gap-3 text-sm font-semibold">
                    {["10 questions clients sur mesure", "Analyse sur les vrais moteurs IA", "Votre score de visibilité", "Votre concurrent n°1 révélé"].map((item) => (
                      <span className="flex items-center gap-2" key={item}><Check className="size-4 text-emerald-700" aria-hidden="true" /> {item}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto border-t border-foreground/8 bg-[#f3f4ed] p-6">
                  <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full bg-white px-6">
                    <Link
                      href="/onboarding"
                      data-analytics-event="select_content"
                      data-analytics-label="pricing_free"
                    >
                      Essayer gratuitement <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div data-testid="pricing-pro-card" className="flex flex-col overflow-hidden rounded-[1.75rem] bg-[#173b35] text-white shadow-xl shadow-primary/15">
                <div className="p-6 sm:p-7">
                  <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:justify-between">
                    <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-lime-300">Suivi Pro</p>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-lime-300 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#173b35]">Le plus choisi</span>
                  </div>
                  <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black tracking-[-0.06em]">$29</span><span className="pb-1 text-xs font-semibold text-white/60">/ mois · résiliable à tout moment</span></div>
                  <div className="mt-6 grid gap-3 text-sm font-semibold text-white/85">
                    {["Tous les concurrents nommés", "Les réponses réelles des moteurs, citées", "Plan d'action issu des réponses IA en direct", "Nouvelle analyse automatique chaque semaine", "Historique de votre score"].map((item) => (
                      <span className="flex items-center gap-2" key={item}><Check className="size-4 text-lime-300" aria-hidden="true" /> {item}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto border-t border-white/10 p-6">
                  <Button asChild size="lg" className="h-12 w-full rounded-full bg-lime-300 px-6 font-extrabold text-[#173b35] hover:bg-lime-200">
                    <Link
                      href="/onboarding"
                      data-analytics-event="select_content"
                      data-analytics-label="pricing_pro"
                    >
                      Commencer par l’analyse gratuite <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-white shadow-sm">
                <div className="p-6 sm:p-7">
                  <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Agence &amp; multi-établissements</p>
                  <div className="mt-2 flex items-end gap-2"><span className="text-4xl font-black tracking-[-0.06em]">$149</span><span className="pb-1 text-xs font-semibold text-muted-foreground">/ mois</span></div>
                  <div className="mt-6 grid gap-3 text-sm font-semibold">
                    {["Jusqu'à 25 établissements", "Rapports clients en marque blanche", "Analyses IA par lots", "Suivi des concurrents par ville", "Support agence prioritaire"].map((item) => (
                      <span className="flex items-center gap-2" key={item}><Check className="size-4 text-emerald-700" aria-hidden="true" /> {item}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto border-t border-foreground/8 bg-[#f3f4ed] p-6">
                  <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full bg-white px-6">
                    <Link
                      href="/contact"
                      data-analytics-event="select_content"
                      data-analytics-label="pricing_agency_contact"
                    >
                      Nous contacter <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-sm font-semibold text-muted-foreground">
              Les prix sont indiqués en dollars américains. Les paiements Pro sont traités de façon sécurisée par Stripe, les taxes applicables sont calculées au moment du paiement, et vous pouvez résilier en ligne à tout moment.
            </p>
          </div>
        </section>
        <section id="faq" className="scroll-mt-20 border-t border-foreground/8 bg-white py-20 sm:py-28" aria-label="Questions fréquentes">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="text-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">FAQ</p>
              <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Vos questions, nos réponses.</h2>
            </div>
            <div className="mt-12 space-y-4">
              {faqs.map((faq) => (
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
              <p className="text-muted-foreground">Envie d’aller plus loin ? Consultez nos <Link className="font-bold text-emerald-700 hover:underline" href="/guides">guides sur la visibilité IA et le GEO</Link>.</p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
