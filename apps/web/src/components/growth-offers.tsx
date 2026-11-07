import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { CurrencyToggle } from "@/components/currency-toggle";
import { Price } from "@/components/price";
import { Button } from "@/components/ui/button";
import { GROWTH_PLANS, growthPrice, type GrowthPlan } from "@/lib/growth";
import { DEFAULT_CURRENCY_BY_LOCALE, localePath, type Locale } from "@/lib/i18n";
import { PRICES } from "@/lib/pricing";

const COPY = {
  fr: {
    eyebrow: "Du diagnostic au travail réalisé",
    title: "Un plan gratuit. Une équipe pour le mettre en œuvre.",
    intro: "Commencez par comprendre votre visibilité. Si des opportunités se dégagent, confiez-nous les corrections et les contenus à publier chaque mois.",
    free: "Audit IA",
    freePrice: "Gratuit",
    freeNote: "Sans carte bancaire ni engagement",
    freeItems: ["10 questions adaptées à votre entreprise", "Votre visibilité et les concurrents cités", "Jusqu’à 3 premières opportunités"],
    freeCta: "Obtenir mon plan gratuit",
    pilot: "Offre pilote",
    monthly: "HT / mois",
    commitment: (months: number) => `Engagement initial de ${months} mois`,
    plans: {
      ai_growth: {
        intro: "Pour déléguer les premières optimisations et avancer chaque mois.",
        items: ["Audit technique et plan d’action priorisé", "Corrections du site dans le périmètre convenu", "2 pages utiles à vos futurs clients par mois", "Suivi hebdomadaire sur les moteurs IA disponibles", "Rapport mensuel du travail livré et des résultats"],
        cta: "Discuter de mon plan AI Growth",
      },
      ai_growth_plus: {
        intro: "Pour les marchés concurrentiels et un travail éditorial plus soutenu.",
        items: ["Le socle AI Growth", "Programme éditorial renforcé, défini au devis", "Recherche de visibilité externe pertinente et légitime", "Optimisations continues du site", "Accompagnement stratégique mensuel"],
        cta: "Discuter de mon plan Growth Plus",
      },
    },
    fine: "Tarifs pilotes en euros hors taxes. Nous confirmons le périmètre, les accès nécessaires et le devis avant tout paiement. Les contenus et changements sont soumis à votre validation avant publication. Aucun volume de citations, de trafic ou de clients n’est garanti.",
    diy: "Vous préférez agir vous-même ?",
    diyText: "Le logiciel Pro reste disponible : rapport complet, contenus à adapter et suivi hebdomadaire. Les optimisations sont à votre charge.",
    perMonth: " / mois",
    currency: "Devise du logiciel Pro",
    diyCta: "Découvrir le suivi Pro",
    agency: "Agence ou réseau de plusieurs établissements ?",
    agencyCta: "Voir l’offre dédiée",
  },
  en: {
    eyebrow: "From diagnosis to work delivered",
    title: "A free plan. A team to put it into action.",
    intro: "Start by understanding your visibility. When the audit reveals opportunities, let us handle the improvements and content each month.",
    free: "AI audit",
    freePrice: "Free",
    freeNote: "No card. No commitment.",
    freeItems: ["10 questions tailored to your business", "Your visibility and the competitors named", "Up to 3 initial opportunities"],
    freeCta: "Get my free visibility plan",
    pilot: "Pilot offer",
    monthly: "excl. tax / month",
    commitment: (months: number) => `${months}-month initial commitment`,
    plans: {
      ai_growth: {
        intro: "Delegate the first improvements and make progress every month.",
        items: ["Technical audit and prioritized action plan", "Website fixes within the agreed scope", "2 useful customer-focused pages per month", "Weekly tracking on the available AI engines", "Monthly report of work delivered and measured results"],
        cta: "Discuss my AI Growth plan",
      },
      ai_growth_plus: {
        intro: "For competitive markets and a more extensive editorial program.",
        items: ["The AI Growth foundation", "An expanded editorial program, scoped in the quote", "Relevant, legitimate external visibility opportunities", "Continuous website improvements", "Monthly strategic support"],
        cta: "Discuss my Growth Plus plan",
      },
    },
    fine: "Pilot prices exclude tax and match the currency shown. We confirm scope, required access and a quote before any payment. You approve content and changes before publication. AI mentions, traffic and new customers are not guaranteed.",
    diy: "Prefer to do the work yourself?",
    diyText: "Pro software is still available: a full report, editable content and weekly tracking. You handle the improvements.",
    perMonth: " / month",
    currency: "Pro software currency",
    diyCta: "Explore Pro monitoring",
    agency: "Agency or multi-location business?",
    agencyCta: "See the dedicated plan",
  },
};

export function GrowthOffers({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const onboarding = localePath(locale, "/onboarding");

  return (
    <section id="pricing" className="scroll-mt-24 bg-[#f8f8f3] py-20 sm:py-28" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">{copy.eyebrow}</p>
          <h2 id="pricing-heading" className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">{copy.title}</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{copy.intro}</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <article className="flex flex-col rounded-[1.75rem] border border-foreground/10 bg-white p-6 sm:p-7">
            <h3 className="text-lg font-extrabold">{copy.free}</h3>
            <p className="mt-5 text-4xl font-black tracking-[-0.05em]">{copy.freePrice}</p>
            <p className="mt-2 text-sm text-muted-foreground">{copy.freeNote}</p>
            <ul className="my-7 space-y-4 text-sm leading-6">
              {copy.freeItems.map((item) => <li className="flex gap-2" key={item}><Check className="mt-1 size-4 shrink-0 text-emerald-700" aria-hidden="true" />{item}</li>)}
            </ul>
            <Button asChild variant="outline" size="lg" className="mt-auto h-auto min-h-12 w-full whitespace-normal rounded-full py-3">
              <Link href={onboarding} data-analytics-event="select_content" data-analytics-label="pricing_free_plan">{copy.freeCta}<ArrowRight className="ml-2 size-4 shrink-0" aria-hidden="true" /></Link>
            </Button>
          </article>

          {(Object.keys(GROWTH_PLANS) as GrowthPlan[]).map((plan) => {
            const offer = GROWTH_PLANS[plan];
            const detail = copy.plans[plan];
            const featured = plan === "ai_growth";
            return (
              <article className={`flex flex-col rounded-[1.75rem] p-6 sm:p-7 ${featured ? "bg-[#173b35] text-white shadow-xl shadow-primary/15" : "border border-foreground/10 bg-white"}`} key={plan}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-extrabold">{offer.name}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${featured ? "bg-lime-300 text-[#173b35]" : "bg-emerald-50 text-emerald-800"}`}>{copy.pilot}</span>
                </div>
                <p className="mt-5 text-4xl font-black tracking-[-0.05em]">{growthPrice(plan, locale)}</p>
                <p className={`mt-2 text-sm ${featured ? "text-white/70" : "text-muted-foreground"}`}>{copy.monthly} · {copy.commitment(offer.initialMonths)}</p>
                <p className={`mt-5 text-sm leading-6 ${featured ? "text-white/80" : "text-muted-foreground"}`}>{detail.intro}</p>
                <ul className="my-7 space-y-4 text-sm leading-6">
                  {detail.items.map((item) => <li className="flex gap-2" key={item}><Check className={`mt-1 size-4 shrink-0 ${featured ? "text-lime-300" : "text-emerald-700"}`} aria-hidden="true" />{item}</li>)}
                </ul>
                <Button asChild size="lg" className={`mt-auto h-auto min-h-12 w-full whitespace-normal rounded-full py-3 ${featured ? "bg-lime-300 text-[#173b35] hover:bg-lime-200" : ""}`}>
                  <Link href={localePath(locale, `/contact?plan=${plan === "ai_growth" ? "ai-growth" : "ai-growth-plus"}`)} data-analytics-event="select_content" data-analytics-label={`pricing_${plan}`}>{detail.cta}<ArrowRight className="ml-2 size-4 shrink-0" aria-hidden="true" /></Link>
                </Button>
              </article>
            );
          })}
        </div>
        <p className="mx-auto mt-6 max-w-4xl text-center text-sm leading-6 text-muted-foreground">{copy.fine}</p>

        <div id="software" className="mt-12 grid gap-6 rounded-3xl border border-foreground/10 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h3 className="text-xl font-extrabold">{copy.diy}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.diyText}</p>
            <p className="mt-3 text-sm font-bold"><Price amounts={PRICES.pro} suffix={copy.perMonth} /></p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <CurrencyToggle defaultCurrency={DEFAULT_CURRENCY_BY_LOCALE[locale]} label={copy.currency} />
            <Button asChild variant="outline" className="rounded-full"><Link href={onboarding} data-analytics-event="select_content" data-analytics-label="software_pro">{copy.diyCta}<ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link></Button>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">{copy.agency}{" "}<Link className="font-bold text-emerald-700 underline-offset-4 hover:underline" href={localePath(locale, "/agency")}>{copy.agencyCta} →</Link></p>
      </div>
    </section>
  );
}
