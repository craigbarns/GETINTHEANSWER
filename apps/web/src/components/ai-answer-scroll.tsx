"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export type ScrollEngine = {
  engine: string;
  businesses: string[];
};

type Props = {
  engines: ScrollEngine[];
  heroQuery: string;
  locale: "en" | "fr";
  proofLabel: string;
  proofCity: string;
  proofNamedText: string;
  proofFoot: string;
  cityLabel: string;
  proofCountry: string;
  measuredText: string;
};

const DOT_COLORS: Record<string, string> = {
  chatgpt: "bg-emerald-500",
  claude: "bg-orange-400",
  gemini: "bg-sky-400",
  perplexity: "bg-teal-400",
};

const COPY = {
  en: {
    hold: (n: number) => (n === 1 ? "Only one business is cited by all four AI engines." : `${n} businesses are cited by all four AI engines.`),
    holdSub: "That is how small the citation window is — and that is what the free scan measures.",
    cta: "See where I stand",
    all: "cited by all 4",
  },
  fr: {
    hold: (n: number) => (n === 1 ? "Une seule entreprise est citée par les 4 IA." : `${n} entreprises sont citées par les 4 IA.`),
    holdSub: "La fenêtre de citation est minuscule — c'est exactement ce que mesure le scan gratuit.",
    cta: "Où en suis-je ?",
    all: "cité par les 4",
  },
};

export function AiAnswerScroll({ engines, heroQuery, locale, proofLabel, proofCity, proofNamedText, proofFoot, cityLabel, proofCountry, measuredText }: Props) {
  const t = COPY[locale];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [visible, setVisible] = useState(engines.length + 1);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const motionAllowed = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!motionAllowed) return;
    setEnhanced(true);
    setVisible(0);

    const node = wrapRef.current;
    if (!node) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const rect = node.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top / (total || 1), 0), 1);
        setProgress(scrolled);
        setVisible(Math.min(Math.floor(scrolled * (engines.length + 0.8)), engines.length));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [engines.length]);

  const citedByAll = engines.reduce(
    (acc, engine) => acc.filter((name) => engine.businesses.includes(name)),
    engines[0]?.businesses ?? [],
  );
  const holdReached = visible >= engines.length;

  const answerCard = (engine: ScrollEngine, revealed: boolean, index: number) => (
    <div
      className={`min-w-0 rounded-2xl bg-[#f3f4ed] p-3.5 transition-all duration-500 ${
        enhanced && !revealed ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={enhanced && !revealed ? { transitionDelay: `${index * 40}ms` } : undefined}
      aria-hidden={enhanced && !revealed ? "true" : undefined}
    >
      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
        <span className={`size-2 rounded-full ${DOT_COLORS[engine.engine.toLowerCase()] ?? "bg-slate-400"} ${enhanced && revealed ? "animate-pulse" : ""}`} />
        {engine.engine}
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-semibold marker:font-semibold marker:text-muted-foreground">
        {engine.businesses.map((business) => (
          <li
            className={`break-words pl-0.5 transition-colors duration-700 ${
              holdReached && citedByAll.includes(business) ? "font-extrabold text-emerald-700" : ""
            }`}
            key={business}
          >
            {business}
            {holdReached && citedByAll.includes(business) && (
              <span className="ml-1.5 hidden rounded-full bg-lime-200 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-[#173b35] sm:inline">
                {t.all}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );

  const holdPanel = (
    <div className={`mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 transition-opacity duration-500 ${enhanced && !holdReached ? "opacity-40" : "opacity-100"}`}>
      <p className={`font-extrabold text-amber-900 transition-colors duration-700 ${holdReached ? "text-emerald-900" : ""}`}>
        {holdReached && citedByAll.length > 0 ? t.hold(citedByAll.length) : proofNamedText}
      </p>
      <p className="mt-1 text-sm leading-6 text-amber-900/75">{holdReached && citedByAll.length > 0 ? t.holdSub : proofFoot}</p>
    </div>
  );

  return (
    <div ref={wrapRef} style={enhanced ? { height: `${engines.length * 55 + 70}vh` } : undefined} data-answers-scroll>
      <div className={enhanced ? "sticky top-16" : ""}>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[#173b35] p-3 shadow-2xl shadow-primary/20 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-lime-300">{proofLabel}</p>
            <p className="text-xs font-semibold text-white/60">{cityLabel}{proofCountry} · {proofCity}</p>
          </div>

          <div className="mt-2 rounded-[1.35rem] bg-white p-4 sm:p-6">
            <p className="text-lg font-extrabold leading-7 tracking-tight sm:text-xl" lang="en">
              {`“${heroQuery}”`}
            </p>

            <div className={`mt-5 gap-2.5 ${enhanced ? "grid" : "grid sm:grid-cols-2"}`}>
              {enhanced
                ? engines.map((engine, index) => (
                    <div key={engine.engine}>{answerCard(engine, visible > index, index)}</div>
                  ))
                : engines.map((engine, index) => <div key={engine.engine}>{answerCard(engine, true, index)}</div>)}
            </div>

            {holdPanel}
            <p className="mt-3 text-xs font-semibold text-muted-foreground">{measuredText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
