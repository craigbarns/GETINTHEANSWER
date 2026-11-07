import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3, ShoppingBag, Target, Wrench } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { AiShoppingWaitlist } from "@/components/ai-shopping-waitlist";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Shopping Intelligence IA — ChatGPT recommande-t-il vos produits ?",
  description:
    "Bientôt : suivez si ChatGPT, Gemini et Perplexity recommandent les produits de votre boutique quand un client demande quoi acheter — et quels concurrents passent devant vous. Rejoignez la liste d'attente.",
  alternates: localizedAlternates("fr", "/ai-shopping"),
};

const PILLARS = [
  { icon: ShoppingBag, title: "Import du catalogue", text: "Shopify, CSV ou flux Merchant Center — vos produits, prix et variantes." },
  { icon: Target, title: "Questions d'achat", text: "20 à 50 vraies requêtes d'acheteurs par catégorie : quoi acheter, quelle marque, quelle boutique." },
  { icon: BarChart3, title: "Visibilité par produit", text: "Quels de vos SKU sont recommandés, votre position moyenne, et qui est cité à votre place." },
  { icon: Wrench, title: "Corriger et re-mesurer", text: "Audit des fiches produits (schema Product/Offer, caractéristiques, comparatifs) puis nouvelle mesure après correction." },
];

export default function AiShoppingPageFr() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/fr" aria-label="GetInTheAnswer, accueil">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/fr">
          <ArrowLeft className="size-4" aria-hidden="true" /> Accueil
        </Link>
        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Bientôt — Shopping Intelligence IA</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Vos concurrents apparaissent dans les recommandations d'achat de ChatGPT. Et vous ?</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            La plateforme qui mesure la visibilité IA des entreprises locales ouvre une verticale pour les boutiques en ligne : quels produits les IA recommandent, à quelle position, et quels concurrents elles placent devant vous.
          </p>
        </div>

        <div className="mt-10">
          <AiShoppingWaitlist locale="fr" />
          <p className="mt-3 text-center text-xs text-muted-foreground">Liste d'attente — ouverture de l'audit début 2027. Sans spam, sans carte.</p>
        </div>

        <div className="mt-14 rounded-[1.75rem] border border-foreground/10 bg-white p-7 shadow-sm sm:p-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Simulation — données fictives, à titre illustratif</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">À quoi ressemblera votre tableau de bord</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f8f8f3] p-5"><p className="text-3xl font-extrabold text-[#173b35]">34%</p><p className="mt-1 text-sm text-muted-foreground">Visibilité shopping IA</p></div>
            <div className="rounded-2xl bg-[#f8f8f3] p-5"><p className="text-3xl font-extrabold text-[#173b35]">27/120</p><p className="mt-1 text-sm text-muted-foreground">Produits cités</p></div>
            <div className="rounded-2xl bg-[#f8f8f3] p-5"><p className="text-3xl font-extrabold text-[#173b35]">3,2</p><p className="mt-1 text-sm text-muted-foreground">Position moyenne dans les listes</p></div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3"><span className="w-36 shrink-0 text-sm font-bold">Concurrent A</span><div className="h-6 flex-1 overflow-hidden rounded-lg bg-foreground/6"><div className="h-full w-[58%] rounded-lg bg-[#173b35]" /></div><span className="w-9 text-right text-sm font-extrabold">58%</span></div>
            <div className="flex items-center gap-3"><span className="w-36 shrink-0 truncate text-sm font-extrabold text-emerald-700">Votre marque</span><div className="h-6 flex-1 overflow-hidden rounded-lg bg-foreground/6"><div className="h-full w-[34%] rounded-lg bg-lime-500" /></div><span className="w-9 text-right text-sm font-extrabold text-emerald-700">34%</span></div>
            <div className="flex items-center gap-3"><span className="w-36 shrink-0 text-sm font-bold">Concurrent B</span><div className="h-6 flex-1 overflow-hidden rounded-lg bg-foreground/6"><div className="h-full w-[22%] rounded-lg bg-[#173b35]" /></div><span className="w-9 text-right text-sm font-extrabold">22%</span></div>
          </div>
          <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <p className="font-extrabold">Opportunité : casque Bluetooth X200 — cité dans 0 des 12 réponses pertinentes.</p>
            <p className="mt-1">Action recommandée : compléter les caractéristiques, vérifier le balisage Product/Offer, enrichir le comparatif produit.</p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <div className="rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-sm" key={pillar.title}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-lime-200 text-[#173b35]"><pillar.icon className="size-5" aria-hidden="true" /></span>
              <h3 className="mt-4 text-lg font-extrabold">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 rounded-2xl bg-[#f8f8f3] p-5 text-xs leading-5 text-muted-foreground">
          La mesure s'effectue via les API des modèles et couvre les réponses des IA, pas la surface commerciale ChatGPT Shopping. Cette page décrit un produit en développement — rejoignez la liste d'attente pour influencer son périmètre.
        </p>
      </main>
    </div>
  );
}
