"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type ProbeResult = {
  question: string;
  engine: string;
  answer_excerpt: string;
  brand_mentioned: boolean;
};

const COPY = {
  en: {
    title: "Ask the AI about your business",
    intro: "Type your business, and ChatGPT answers the question your customers actually ask. Live, free, no signup.",
    company: "Business name",
    city: "City",
    industry: "Industry (e.g. plumbers, dentists)",
    submit: "Ask ChatGPT now",
    loading: "Asking ChatGPT…",
    questionLabel: "Question asked",
    mentioned: "✅ Your business is cited in this answer.",
    notMentioned: "❌ Your business is not named in this answer.",
    fixIt: "That gap is measurable and fixable. Run the full free audit: 10 questions × 4 AI engines, competitors named, action plan.",
    auditCta: "Run my free full audit",
    error: "The AI engine is busy — try again in a moment.",
  },
  fr: {
    title: "Posez la question à l'IA",
    intro: "Entrez votre entreprise, et ChatGPT répond à la question que vos clients posent vraiment. En direct, gratuit, sans inscription.",
    company: "Nom de l'entreprise",
    city: "Ville",
    industry: "Métier (ex. plombiers, dentistes)",
    submit: "Demander à ChatGPT",
    loading: "ChatGPT réfléchit…",
    questionLabel: "Question posée",
    mentioned: "✅ Votre entreprise est citée dans cette réponse.",
    notMentioned: "❌ Votre entreprise n'est pas citée dans cette réponse.",
    fixIt: "C'est mesurable et corrigeable. Lancez l'audit complet gratuit : 10 questions × 4 moteurs IA, concurrents nommés, plan d'action.",
    auditCta: "Lancer mon audit complet gratuit",
    error: "Le moteur IA est occupé — réessayez dans un instant.",
  },
};

export function AiChatForm({ locale }: { locale: "en" | "fr" }) {
  const copy = COPY[locale];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<ProbeResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(false);
    setResult(null);
    try {
      const response = await fetch("/api/chat-probe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: form.get("company"),
          city: form.get("city"),
          industry: form.get("industry"),
          locale,
        }),
      });
      if (!response.ok) throw new Error();
      setResult((await response.json()) as ProbeResult);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <input required name="company" placeholder={copy.company} className="rounded-full border border-foreground/15 bg-white px-5 py-3 text-sm outline-none focus:border-emerald-700" />
          <input required name="city" placeholder={copy.city} className="rounded-full border border-foreground/15 bg-white px-5 py-3 text-sm outline-none focus:border-emerald-700" />
        </div>
        <input required name="industry" placeholder={copy.industry} className="mt-4 w-full rounded-full border border-foreground/15 bg-white px-5 py-3 text-sm outline-none focus:border-emerald-700" />
        <Button disabled={loading} className="mt-5 h-12 w-full rounded-full bg-lime-300 font-extrabold text-[#173b35] hover:bg-lime-200">
          {loading ? <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> {copy.loading}</> : <><Sparkles className="mr-2 size-4" aria-hidden="true" /> {copy.submit}</>}
        </Button>
      </form>

      {error && <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">{copy.error}</p>}

      {result && (
        <div className="mt-6 rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">{copy.questionLabel} · {result.engine}</p>
          <p className="mt-2 font-extrabold tracking-[-0.02em]">“{result.question}”</p>
          <blockquote className="mt-4 whitespace-pre-line rounded-2xl bg-[#f8f8f3] p-5 text-sm leading-6 text-muted-foreground">{result.answer_excerpt}</blockquote>
          <p className={`mt-4 font-extrabold ${result.brand_mentioned ? "text-emerald-700" : "text-red-700"}`}>
            {result.brand_mentioned ? copy.mentioned : copy.notMentioned}
          </p>
          <div className="mt-5 rounded-2xl border border-emerald-700/20 bg-emerald-50/50 p-5">
            <p className="text-sm leading-6">{copy.fixIt}</p>
            <Button asChild className="mt-4 rounded-full">
              <Link href={locale === "fr" ? "/fr/onboarding" : "/onboarding"}>{copy.auditCta} <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
