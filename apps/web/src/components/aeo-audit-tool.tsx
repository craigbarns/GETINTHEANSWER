"use client";

import { useState } from "react";
import { Check, Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const COPY = {
  en: {
    title: "Free AEO audit",
    intro: "See how citation-worthy your website is for ChatGPT, Claude and Perplexity: 16 technical checks, 6 content-quality dimensions, a grade and a prioritized fix list.",
    placeholder: "Your website (e.g. myshop.com)",
    submit: "Audit my site",
    loading: "Auditing…",
    error: "Audit failed — check the URL and try again.",
    disclaimer: "Quality scores are research-derived heuristics refined by AI analysis, not proven causal predictions.",
    poweredBy: "AI-powered analysis",
    heuristic: "Deterministic analysis",
    fixes: "Prioritized fixes",
    high: "High impact",
    medium: "Medium impact",
    low: "Low impact",
    pages: "pages analyzed",
    foundational: "Technical score",
    intelligence: "Content quality",
    final: "Final score",
    passed: "passed",
    failed: "to fix",
    cta: "Want us to fix these for you?",
    ctaLink: "See the AI Growth offer",
  },
  fr: {
    title: "Audit AEO gratuit",
    intro: "Découvrez si votre site mérite d'être cité par ChatGPT, Claude et Perplexity : 16 vérifications techniques, 6 dimensions de qualité de contenu, une note et les corrections priorisées.",
    placeholder: "Votre site (ex. maboutique.fr)",
    submit: "Auditer mon site",
    loading: "Audit en cours…",
    error: "L'audit a échoué — vérifiez l'URL et réessayez.",
    disclaimer: "Les scores de qualité sont des heuristiques dérivées de recherche et affinées par IA, pas des causalités prouvées.",
    poweredBy: "Analyse par IA",
    heuristic: "Analyse déterministe",
    fixes: "Corrections priorisées",
    high: "Impact fort",
    medium: "Impact moyen",
    low: "Impact faible",
    pages: "pages analysées",
    foundational: "Score technique",
    intelligence: "Qualité du contenu",
    final: "Score final",
    passed: "réussis",
    failed: "à corriger",
    cta: "On peut corriger tout ça pour vous.",
    ctaLink: "Voir l'offre AI Growth",
  },
};

type AuditCheck = { key: string; label: string; passed: boolean; failed_pages: number; detail: string };
type AuditDimension = { key: string; label: string; score: number; rationale: string };
type AuditFix = { title: string; impact: string; why: string };
type AuditResult = {
  url: string;
  fetched: boolean;
  pages_crawled: number;
  foundational_score: number;
  intelligence_score: number;
  final_score: number;
  grade: string;
  intelligence_source: string;
  checks: AuditCheck[];
  dimensions: AuditDimension[];
  fixes: AuditFix[];
};

const GRADE_COLOR: Record<string, string> = {
  A: "text-emerald-700", B: "text-lime-700", C: "text-amber-700", D: "text-orange-700", F: "text-red-700",
};

export function AeoAuditTool({ locale }: { locale: "en" | "fr" }) {
  const copy = COPY[locale];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/aeo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.get("url") }),
      });
      const data = await response.json();
      if (!response.ok || !data.fetched) {
        setError(data.detail ?? copy.error);
      } else {
        setResult(data as AuditResult);
      }
    } catch {
      setError(copy.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input required name="url" placeholder={copy.placeholder} className="w-full rounded-full border border-foreground/15 bg-white px-5 py-3 text-sm outline-none focus:border-emerald-700" />
        <Button disabled={loading} className="h-12 shrink-0 rounded-full bg-lime-300 font-extrabold text-[#173b35] hover:bg-lime-200">
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : <Search className="mr-2 size-4" aria-hidden="true" />}
          {copy.submit}
        </Button>
      </form>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      {result && (
        <div className="mt-10 space-y-6">
          <div className="flex flex-wrap items-center gap-6 rounded-[1.5rem] border border-foreground/10 bg-white p-6 shadow-sm">
            <div className="text-center">
              <p className={`text-6xl font-extrabold tracking-tight ${GRADE_COLOR[result.grade] ?? "text-foreground"}`}>{result.grade}</p>
              <p className="mt-1 text-sm font-bold">{result.final_score}/100</p>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground"><span>{copy.foundational}</span><span>{result.foundational_score}/100</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-foreground/8"><div className="h-full rounded-full bg-[#173b35]" style={{ width: `${result.foundational_score}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground"><span>{copy.intelligence}</span><span>{result.intelligence_score}/100</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-foreground/8"><div className="h-full rounded-full bg-lime-500" style={{ width: `${result.intelligence_score}%` }} /></div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>{result.pages_crawled} {copy.pages}</p>
              <p className="mt-1 font-bold text-emerald-700">{result.intelligence_source === "llm" ? `✓ ${copy.poweredBy}` : copy.heuristic}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-foreground/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold">16 checks</h3>
              <ul className="mt-3 space-y-2">
                {result.checks.map((check) => (
                  <li className="flex items-start gap-2 text-sm" key={check.key}>
                    {check.passed ? <Check className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden="true" /> : <X className="mt-0.5 size-4 shrink-0 text-red-700" aria-hidden="true" />}
                    <span>{check.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.5rem] border border-foreground/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold">6 dimensions</h3>
              <ul className="mt-3 space-y-3">
                {result.dimensions.map((dimension) => (
                  <li key={dimension.key}>
                    <div className="flex justify-between text-xs font-bold"><span>{dimension.label}</span><span>{dimension.score}/5</span></div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-foreground/8"><div className="h-full rounded-full bg-[#173b35]" style={{ width: `${(dimension.score / 5) * 100}%` }} /></div>
                    <p className="mt-1 text-xs leading-4 text-muted-foreground">{dimension.rationale}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {result.fixes.length > 0 && (
            <div className="rounded-[1.5rem] border border-amber-700/20 bg-amber-50 p-6">
              <h3 className="text-lg font-extrabold text-amber-950">{copy.fixes}</h3>
              <ul className="mt-3 space-y-3">
                {result.fixes.map((fix) => (
                  <li className="text-sm leading-6 text-amber-950" key={fix.title}>
                    <span className="mr-2 rounded-full bg-amber-700/10 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide">
                      {fix.impact === "high" ? copy.high : fix.impact === "medium" ? copy.medium : copy.low}
                    </span>
                    <span className="font-bold">{fix.title}</span> — {fix.why}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-bold">{copy.cta} <a className="underline decoration-lime-500 decoration-2 underline-offset-2" href={locale === "fr" ? "/fr/agency" : "/agency"}>{copy.ctaLink} →</a></p>
            </div>
          )}

          <p className="text-xs leading-5 text-muted-foreground">{copy.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
