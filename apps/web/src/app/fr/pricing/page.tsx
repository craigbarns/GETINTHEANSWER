import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { PRICES, DONE_FOR_YOU_PRICE, formatPrice } from "@/lib/pricing";
import { GROWTH_PLANS, growthPrice } from "@/lib/growth";
import { SITE_URL } from "@/lib/site";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Tarifs — Audit gratuit, Pro et offre pilote AI Growth",
  description:
    "Tarifs transparents : audit de visibilité IA gratuit, logiciel Pro à 29 €/mois, offre pilote AI Growth dès 990 € HT/mois (fait pour vous) et offre agence. Aucun frais caché.",
  alternates: localizedAlternates("fr", "/pricing"),
};

const OFFERS = [
  {
    name: "Audit IA",
    price: "Gratuit",
    note: "Sans carte. Sans engagement.",
    items: [
      "10 questions adaptées à votre entreprise",
      "Votre score sur ChatGPT, Claude, Gemini et Perplexity",
      "Les concurrents cités par les IA",
      "Jusqu’à 3 premières opportunités",
    ],
    cta: { label: "Obtenir mon audit gratuit", href: "/fr/onboarding" },
  },
  {
    name: "Pro",
    price: () => formatPrice(PRICES.pro.eur, "eur") + " / mois",
    note: "Logiciel en autonomie. Résiliable à tout moment.",
    items: [
      "Rapport complet avec les 40 vérifications de réponses",
      "Brouillons prêts à l’emploi : page FAQ, LocalBusiness schema, description Google",
      "Suivi hebdomadaire des moteurs IA",
      "Vous mettez en œuvre les recommandations vous-même",
    ],
    cta: { label: "Commencer par l’audit gratuit", href: "/fr/onboarding" },
  },
  {
    name: "AI Growth",
    price: () => growthPrice("ai_growth", "fr") + " HT / mois",
    note: "Fait pour vous. Engagement initial de 3 mois.",
    items: [
      "Audit technique et plan d’action priorisé",
      "Corrections du site dans le périmètre convenu",
      "2 pages utiles à vos clients par mois",
      "Suivi hebdomadaire des moteurs IA + suivi des crawlers IA",
      "Rapport mensuel du travail livré et des résultats mesurés",
    ],
    cta: { label: "Discuter de mon plan", href: "/fr/contact?plan=ai-growth" },
    highlight: true,
  },
  {
    name: "AI Growth Plus",
    price: () => growthPrice("ai_growth_plus", "fr") + " HT / mois",
    note: "Pour les marchés concurrentiels. Engagement initial de 3 mois.",
    items: [
      "Le socle AI Growth",
      "Programme éditorial renforcé, défini au devis",
      "Opportunités de visibilité externe pertinentes et légitimes",
      "Optimisations continues du site",
      "Accompagnement stratégique mensuel",
    ],
    cta: { label: "Discuter de mon plan", href: "/fr/contact?plan=ai-growth-plus" },
  },
];

// Source unique de la FAQ : la section affichée sur la page et le JSON-LD
// FAQPage ci-dessous, pour que le texte visible et le balisage ne divergent jamais.
const FAQ_ITEMS = [
  {
    question: "L’audit de visibilité IA est-il vraiment gratuit ?",
    answer:
      "Oui. L’audit pose 10 questions à ChatGPT, Claude, Gemini et Perplexity et montre votre score, les concurrents cités et les premières opportunités. Sans carte bancaire.",
  },
  {
    question: "Quelle différence entre Pro et AI Growth ?",
    answer:
      "Pro (29 €/mois) est le logiciel en autonomie : rapport complet, brouillons et suivi hebdomadaire, à vous de mettre en œuvre. AI Growth (990 € HT/mois, engagement initial de 3 mois) est fait pour vous : notre équipe corrige le site, publie les contenus et mesure chaque mois.",
  },
  {
    question: "Les résultats sont-ils garantis ?",
    answer:
      "Aucun volume de citations IA, de trafic ou de clients n’est garanti — méfiez-vous de qui le promet. Ce qui est garanti : le travail livré, mesuré et rapporté chaque mois.",
  },
];

export default function PricingPageFr() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/fr` },
          { "@type": "ListItem", position: 2, name: "Tarifs", item: `${SITE_URL}/fr/pricing` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/fr" aria-label="GetInTheAnswer, accueil">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
          <Button asChild className="ml-auto rounded-full px-5">
            <Link href="/fr/onboarding">Scan gratuit <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/fr">
          <ArrowLeft className="size-4" aria-hidden="true" /> Accueil
        </Link>
        <div className="mt-6 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Tarifs</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Commencez gratuitement. Évoluez quand ça marche.</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Chaque offre commence par le même audit gratuit. Prenez le logiciel pour agir vous-même, ou l’offre pilote fait-pour-vous pour déléguer.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {OFFERS.map((offer) => (
            <div
              key={offer.name}
              className={`flex flex-col rounded-[1.5rem] border p-7 shadow-sm ${offer.highlight ? "border-emerald-700/30 bg-[#173b35] text-white" : "border-foreground/8 bg-white"}`}
            >
              <h2 className="text-lg font-extrabold tracking-[-0.02em]">{offer.name}</h2>
              <p className={`mt-3 text-2xl font-extrabold tracking-[-0.03em] ${offer.highlight ? "text-lime-300" : ""}`}>{typeof offer.price === "function" ? offer.price() : offer.price}</p>
              <p className={`mt-1 text-xs ${offer.highlight ? "text-white/60" : "text-muted-foreground"}`}>{offer.note}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {offer.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-5">
                    <Check className={`mt-0.5 size-4 shrink-0 ${offer.highlight ? "text-lime-300" : "text-emerald-700"}`} aria-hidden="true" />
                    <span className={offer.highlight ? "text-white/85" : ""}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className={`mt-6 w-full rounded-full ${offer.highlight ? "bg-lime-300 font-extrabold text-[#173b35] hover:bg-lime-200" : ""}`}>
                <Link href={offer.cta.href}>{offer.cta.label}</Link>
              </Button>
            </div>
          ))}
        </div>

        <section className="mt-12 rounded-[1.75rem] border border-foreground/8 bg-white p-7 sm:p-9">
          <h2 className="text-2xl font-extrabold tracking-[-0.035em]">Autres options</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="font-extrabold">Fait pour vous, en une fois — {formatPrice(DONE_FOR_YOU_PRICE.eur, "eur")}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Nous mettons en œuvre les corrections prioritaires de votre audit, sans abonnement. Sur demande après l’audit.</p>
            </div>
            <div>
              <p className="font-extrabold">Agence ou multi-établissements — {formatPrice(PRICES.agency.eur, "eur")} / mois</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Suivez plusieurs établissements ou clients depuis un seul espace. Voir <Link className="font-semibold text-emerald-700 underline" href="/fr/agency">l’offre agence</Link>.</p>
            </div>
          </div>
          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            Tarifs pilotes en euros hors taxes. Nous confirmons le périmètre, les accès nécessaires et le devis avant tout paiement. Les contenus et changements sont soumis à votre validation avant publication. Aucun volume de citations IA, de trafic ou de clients n’est garanti. Cette page sert de référence tarifaire aux annuaires indépendants.
          </p>
        </section>

        {/* FAQ — rendue depuis le même tableau FAQ_ITEMS que le JSON-LD FAQPage ci-dessus */}
        <section className="mt-12">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">FAQ</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">Questions fréquentes</h2>
          <div className="mt-6 space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
                <h3 className="font-extrabold text-foreground">{item.question}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
