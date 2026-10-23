import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const engines = [
  { name: "ChatGPT", dot: "bg-emerald-400" },
  { name: "Claude", dot: "bg-amber-300" },
  { name: "Gemini", dot: "bg-sky-400" },
  { name: "Perplexity", dot: "bg-lime-400" },
];

/** A French explanation, with no invented provider answers or business names. */
export function FrenchAnalysisPreview() {
  return (
    <div id="proof" className="relative mx-auto w-full min-w-0 max-w-2xl scroll-mt-24 animate-fade-in-up lg:mx-0" style={{ animationDelay: "120ms" }}>
      <div className="absolute -inset-5 -rotate-2 rounded-[2.25rem] bg-primary/8" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[#173b35] p-3 shadow-2xl shadow-primary/20 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-lime-300">Exemple d’analyse en français</p>
          <p className="text-xs font-semibold text-white/60">Marseille · Illustration</p>
        </div>

        <div className="mt-2 rounded-[1.35rem] bg-white p-4 sm:p-6">
          <p className="text-lg font-extrabold leading-7 tracking-tight sm:text-xl">
            « Quel plombier recommanderiez-vous pour une intervention d’urgence à Marseille ? »
          </p>
          <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
            Exemple illustratif. Lancez l’analyse de votre entreprise pour consulter les réponses des IA.
          </p>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {engines.map((engine) => (
              <div className="min-w-0 rounded-2xl bg-[#f3f4ed] p-3.5" key={engine.name}>
                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
                  <span className={`size-2 rounded-full ${engine.dot}`} aria-hidden="true" />
                  {engine.name}
                </p>
                <ul className="mt-2 space-y-2 text-sm font-semibold">
                  <li>Votre entreprise est-elle citée ?</li>
                  <li>Quels concurrents sont recommandés ?</li>
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-extrabold text-amber-900">Votre entreprise apparaît-elle dans les réponses ?</p>
            <p className="mt-1 text-sm leading-6 text-amber-900/75">
              Découvrez votre visibilité et les entreprises citées dans votre ville.
            </p>
            <Button asChild className="mt-3 rounded-full">
              <Link href="/fr/onboarding" data-analytics-event="select_content" data-analytics-label="french_example_scan">
                Lancer mon analyse gratuite <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <Link className="mt-3 block text-xs font-semibold text-emerald-700 hover:underline" href="/fr/sample-report">
            Voir un exemple de rapport en français →
          </Link>
        </div>
      </div>
    </div>
  );
}
