import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  Gauge,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

import { LogoMark } from "@/components/logo";
import { BillingStatusBanner } from "@/components/billing-status-banner";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { ShareScoreButton } from "@/components/share-score-button";
import { Price } from "@/components/price";
import { UnlockButton } from "@/components/unlock-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PRICES } from "@/lib/pricing";
import { getDashboardData, type Priority } from "@/lib/seenbyai";


function maskName(name: string) {
  const trimmed = name.trim();
  return trimmed.charAt(0) + "•".repeat(Math.min(10, Math.max(4, trimmed.length - 1)));
}

export const metadata: Metadata = {
  title: "Rapport de visibilité IA",
  description: "Votre score de visibilité, vos mentions et votre plan d'action GetInTheAnswer.",
  robots: {
    index: false,
    follow: false,
  },
};

const engineColors: Record<string, string> = {
  ChatGPT: "bg-emerald-500",
  Perplexity: "bg-lime-500",
  Gemini: "bg-sky-500",
  Claude: "bg-amber-400",
};

const priorityLabels: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const priorityStyles: Record<Priority, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function getScoreSummary(score: number) {
  if (score >= 75) return { label: "Excellente visibilité", copy: "Votre marque est déjà bien identifiée et fréquemment recommandée." };
  if (score >= 50) return { label: "Marge de progression", copy: "Votre marque apparaît, mais plusieurs questions stratégiques restent à conquérir." };
  return { label: "Fort potentiel", copy: "Les moteurs IA manquent encore de signaux fiables pour recommander votre marque." };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    site_id?: string | string[];
    session_id?: string | string[];
    checkout?: string | string[];
    billing_error?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const siteIdParam = params.site_id;
  const siteId = Array.isArray(siteIdParam) ? siteIdParam[0] : siteIdParam;
  const sessionIdParam = params.session_id;
  const sessionId = Array.isArray(sessionIdParam) ? sessionIdParam[0] : sessionIdParam;
  const checkoutParam = params.checkout;
  const checkout = Array.isArray(checkoutParam) ? checkoutParam[0] : checkoutParam;
  const billingErrorParam = params.billing_error;
  const billingError = Array.isArray(billingErrorParam) ? billingErrorParam[0] : billingErrorParam;

  if (!siteId) redirect("/onboarding");

  if (sessionId) {
    redirect(
      `/api/checkout/confirm?site_id=${encodeURIComponent(siteId)}&session_id=${encodeURIComponent(sessionId)}`,
    );
  }

  const data = await getDashboardData(siteId);

  if (!data) {
    return (
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-[#f8f8f3] px-5 py-12">
        <div className="w-full max-w-lg rounded-[1.75rem] border border-foreground/10 bg-white p-7 text-center shadow-xl shadow-primary/5 sm:p-10">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <CircleAlert className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em]">Rapport indisponible</h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            We can&apos;t retrieve this analysis. The link may have expired, or the service is temporarily unavailable.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full"><a href={`/dashboard?site_id=${encodeURIComponent(siteId)}`}><RotateCcw className="mr-2 size-4" aria-hidden="true" /> Try again</a></Button>
            <Button asChild variant="outline" className="rounded-full"><Link href="/onboarding">Nouvelle analyse</Link></Button>
          </div>
        </div>
      </main>
    );
  }

  const safeScore = Math.min(100, Math.max(0, data.visibility_score));
  const mentionRate = data.total_queries > 0 ? Math.round((data.brand_mentions / data.total_queries) * 100) : 0;
  const competitorGap = data.top_competitor_mentions - data.brand_mentions;
  const scoreSummary = getScoreSummary(safeScore);
  const engineNames = Array.from(new Set(data.queries.map((query) => query.engine)));
  const uniqueQuestionCount = new Set(data.queries.map((query) => query.query)).size;
  const engineStats = engineNames.map((engine) => {
    const queries = data.queries.filter((query) => query.engine === engine);
    const mentions = queries.filter((query) => query.brand_mentioned).length;
    return { engine, mentions, total: queries.length, rate: queries.length ? Math.round((mentions / queries.length) * 100) : 0 };
  });
  const billingStatus = billingError
    ? "confirmation_error"
    : checkout === "success" && data.unlocked
      ? "success"
      : checkout === "cancelled"
        ? "cancelled"
        : null;

  return (
    <div className="min-h-screen bg-[#f8f8f3] pb-20">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, accueil">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
          {data?.mode === "live" ? (
            <Badge variant="outline" className="ml-auto border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800">
              <Sparkles className="mr-1.5 size-3" aria-hidden="true" />
              <span className="hidden sm:inline">Rapport IA en direct</span><span className="sm:hidden">Direct</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-800">
              <Sparkles className="mr-1.5 size-3" aria-hidden="true" />
              <span className="hidden sm:inline">Rapport de simulation</span><span className="sm:hidden">Simulation</span>
            </Badge>
          )}
          <Button asChild variant="ghost" size="sm" className="ml-2 hidden rounded-full sm:inline-flex">
            <Link href="/onboarding"><RotateCcw className="mr-2 size-4" aria-hidden="true" /> New scan</Link>
          </Button>
          {data.has_subscription && (
            <ManageSubscriptionButton siteId={data.site_id} className="ml-1 hidden rounded-full lg:inline-flex" />
          )}
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
          <Link className="flex items-center gap-1.5 transition-colors hover:text-foreground" href="/">
            <ArrowLeft className="size-4" aria-hidden="true" /> Home
          </Link>
          <span className="text-foreground/20">/</span>
          <span className="text-foreground">Report for {data.company_name}</span>
        </div>

        {billingStatus && <BillingStatusBanner siteId={data.site_id} status={billingStatus} />}

        <section className="relative overflow-hidden rounded-[2rem] bg-[#173b35] p-6 text-white shadow-xl shadow-primary/10 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-lime-300/12 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-lime-300 text-[#173b35] hover:bg-lime-300"><Check className="mr-1 size-3" aria-hidden="true" /> Analyse terminée</Badge>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white/55"><MapPin className="size-3.5" aria-hidden="true" /> {data.city} · {data.industry}</span>
              </div>
              <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">Voici comment les moteurs IA voient {data.company_name}.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                {data.mode === "live"
                  ? `${uniqueQuestionCount} questions clients testées sur ${engineNames.length} moteurs IA, soit ${data.total_queries} vérifications de réponses.`
                  : `${uniqueQuestionCount} questions clients simulées sur ${engineNames.length} moteurs IA, soit ${data.total_queries} vérifications de réponses.`}
              </p>
              {data.mode === "live" && data.scanned_at && (
                <p className="mt-2 text-xs font-semibold text-white/55">
                  Measured on {new Date(data.scanned_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  {data.engines_used.length > 0 ? ` · ${data.engines_used.join(", ")}` : ""} — a single-sample snapshot; AI answers can vary between runs.
                </p>
              )}
              <a className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-lime-300 hover:text-lime-200" href={data.website_url} target="_blank" rel="noreferrer">
                {data.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/7 p-5 text-center backdrop-blur sm:flex-row sm:gap-5 sm:p-4 sm:pr-6 sm:text-left">
              <div className="flex size-28 shrink-0 items-center justify-center rounded-full p-2" style={{ background: `conic-gradient(#bef264 ${safeScore * 3.6}deg, rgba(255,255,255,.12) 0deg)` }} aria-label={`Visibility score ${safeScore} out of 100`}>
                <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#173b35]">
                  <span className="text-4xl font-black tracking-[-0.06em]">{safeScore}</span>
                  <span className="text-[11px] font-bold text-white/75">SUR 100</span>
                </div>
              </div>
              <div className="max-w-56 sm:max-w-40">
                <p className="font-extrabold text-lime-300">{scoreSummary.label}</p>
                <p className="mt-2 text-sm leading-5 text-white/75">{scoreSummary.copy}</p>
                <div className="mt-3">
                  <ShareScoreButton
                    companyName={data.company_name}
                    score={safeScore}
                    city={data.city}
                    siteId={data.site_id}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {!data.unlocked && (
          <section className="flex flex-col items-start justify-between gap-4 rounded-[1.75rem] border-2 border-dashed border-primary/25 bg-white p-6 sm:flex-row sm:items-center sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-200 text-primary">
                <LockKeyhole className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold tracking-[-0.03em]">Ceci est un aperçu de votre rapport</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Débloquez le nom de tous vos concurrents, les {data.total_queries} vérifications et votre plan d’action complet. Résiliable à tout moment.</p>
              </div>
            </div>
            <div className="shrink-0 text-center">
              <UnlockButton siteId={data.site_id} placement="report_top" className="h-12 rounded-full px-6 font-extrabold">Débloquer le rapport complet — <Price amounts={PRICES.pro} suffix=" / mois" /></UnlockButton>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Abonnement professionnel. En continuant, vous acceptez les{" "}
                <Link className="font-bold underline" href="/terms">CGU</Link>.
              </p>
            </div>
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Indicateurs clés">
          <Card className="border-foreground/8 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Mentions</span><Target className="size-5 text-emerald-700" aria-hidden="true" /></div><p className="mt-4 text-4xl font-black tracking-[-0.05em]">{data.brand_mentions}<span className="text-base font-bold text-muted-foreground">/{data.total_queries}</span></p><p className="mt-2 text-sm text-muted-foreground">Votre marque est citée dans {mentionRate} % des tests.</p></CardContent></Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Concurrent en tête</span><Trophy className="size-5 text-amber-500" aria-hidden="true" /></div><p className="mt-4 truncate text-2xl font-black tracking-[-0.04em]">{data.top_competitor}</p><p className="mt-2 text-sm text-muted-foreground">{data.top_competitor_mentions} mentions détectées.</p></CardContent></Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Écart concurrentiel</span><TrendingUp className="size-5 text-primary" aria-hidden="true" /></div><p className="mt-4 text-4xl font-black tracking-[-0.05em]">{competitorGap > 0 ? `-${competitorGap}` : `+${Math.abs(competitorGap)}`}</p><p className="mt-2 text-sm text-muted-foreground">{competitorGap > 0 ? "mentions de retard sur" : "mentions d'avance sur"} le leader.</p></CardContent></Card>
          <Card className="border-foreground/8 bg-lime-200 py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-primary/70">Actions prioritaires</span><FileText className="size-5 text-primary" aria-hidden="true" /></div><p className="mt-4 text-4xl font-black tracking-[-0.05em]">{data.recommendations.length}</p><p className="mt-2 text-sm text-primary/70">Votre feuille de route est prête.</p></CardContent></Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Couverture par moteur</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Où êtes-vous visible ?</h2></div>
              <Gauge className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-7 space-y-6">
              {engineStats.map(({ engine, mentions, total, rate }) => (
                <div key={engine}>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-extrabold"><span className={`size-2.5 rounded-full ${engineColors[engine]}`} />{engine}</span><span className="font-bold text-muted-foreground">{mentions}/{total} · {rate}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-foreground/7"><div className={`h-full rounded-full ${engineColors[engine]}`} style={{ width: `${rate}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Lecture rapide</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Ce que révèle cette analyse</h2></div>
              <MessageSquareText className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {data.brand_mentions > 0 ? (
                <div className="rounded-2xl bg-emerald-50 p-4"><div className="flex items-center gap-2 font-extrabold text-emerald-800"><CheckCircle2 className="size-4" aria-hidden="true" /> Positive signal</div><p className="mt-2 text-sm leading-6 text-emerald-900/70">Your brand is already recognized in {data.brand_mentions} AI answers.</p></div>
              ) : (
                <div className="rounded-2xl bg-slate-100 p-4"><div className="flex items-center gap-2 font-extrabold text-slate-700"><CircleAlert className="size-4" aria-hidden="true" /> No mentions yet</div><p className="mt-2 text-sm leading-6 text-slate-600">AI engines never cited your brand in this scan. The action plan below is designed to change that.</p></div>
              )}
              <div className="rounded-2xl bg-amber-50 p-4"><div className="flex items-center gap-2 font-extrabold text-amber-800"><AlertTriangle className="size-4" aria-hidden="true" /> Opportunity</div><p className="mt-2 text-sm leading-6 text-amber-900/70">{Math.max(0, data.total_queries - data.brand_mentions)} AI answers don&apos;t mention your business yet.</p></div>
            </div>
          </div>
        </section>

        {data.site_audit?.fetched && data.site_audit.checks.length > 0 && (
          <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Audit du site</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">Votre site face aux attentes des moteurs IA</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">We fetched your homepage and checked the signals engines use to verify and recommend a business.</p>
              </div>
              <Badge variant="outline" className="w-fit bg-white px-3 py-1.5">
                {data.site_audit.checks.filter((check) => check.passed).length}/{data.site_audit.checks.length} signals present
              </Badge>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(data.unlocked ? data.site_audit.checks : data.site_audit.checks.slice(0, 2)).map((check) => (
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
              {!data.unlocked && data.site_audit.checks.length > 2 && (
                <div className="flex flex-col items-start justify-center gap-3 rounded-2xl border border-dashed border-foreground/15 bg-white/60 p-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-2 font-bold text-muted-foreground">
                    <LockKeyhole className="size-4" aria-hidden="true" /> {data.site_audit.checks.length - 2} more website checks are hidden in the preview
                  </span>
                  <UnlockButton siteId={data.site_id} placement="website_audit" size="sm" className="rounded-full px-5">Débloquer le rapport complet — <Price amounts={PRICES.pro} suffix=" / mois" /></UnlockButton>
                </div>
              )}
            </div>
          </section>
        )}

        {data.unlocked && data.history.length > 1 && (
          <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Suivi hebdomadaire</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Historique du score</h2></div>
              <TrendingUp className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-7 flex items-end gap-3 overflow-x-auto pb-2" aria-label="Évolution du score de visibilité">
              {data.history.map((point, index) => (
                <div className="flex min-w-14 flex-col items-center gap-2" key={`${point.date}-${index}`}>
                  <span className="text-sm font-extrabold tabular-nums">{point.score}</span>
                  <div className="flex h-28 w-9 items-end overflow-hidden rounded-lg bg-foreground/6">
                    <div className="w-full rounded-lg bg-emerald-600" style={{ height: `${Math.max(4, point.score)}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground">{point.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Plan d’action</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Vos prochaines actions</h2><p className="mt-2 text-muted-foreground">Classées par urgence et impact estimé.</p></div>
            <Badge variant="outline" className="w-fit bg-white px-3 py-1.5">{data.recommendations.length} recommendations</Badge>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {data.recommendations.map((recommendation, index) =>
              data.unlocked || index === 0 ? (
                <article className="flex flex-col rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1" key={recommendation.title}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">{index + 1}</span>
                    <Badge variant="outline" className={priorityStyles[recommendation.priority]}>{priorityLabels[recommendation.priority]} priority</Badge>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em]">{recommendation.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{recommendation.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-foreground/8 pt-4 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground"><span>Impact estimé</span><span className="text-emerald-700">{recommendation.estimated_impact}</span></div>
                </article>
              ) : (
                <article className="flex flex-col rounded-[1.5rem] border border-dashed border-foreground/15 bg-white/60 p-6" key={`locked-${index}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-foreground/8 text-sm font-black text-muted-foreground">{index + 1}</span>
                    <Badge variant="outline" className="border-foreground/15 bg-white text-muted-foreground"><LockKeyhole className="mr-1 size-3" aria-hidden="true" /> Locked</Badge>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em] text-muted-foreground">Recommendation #{index + 1}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">Unlock the full report to reveal this action, its priority and its expected impact on your AI visibility.</p>
                  <div className="mt-6 border-t border-foreground/8 pt-4">
                    <UnlockButton siteId={data.site_id} placement={`recommendation_${index + 1}`} size="sm" variant="outline" className="w-full rounded-full">Débloquer — <Price amounts={PRICES.pro} suffix=" / mois" /></UnlockButton>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        <section className="pt-4">
          <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Données de l’analyse</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">{data.mode === "live" ? "Détail de l'analyse" : "Détail de la simulation"}</h2><p className="mt-2 text-muted-foreground">Chaque couple question-moteur utilisé pour calculer votre score.</p></div>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader className="bg-[#f3f4ed]"><TableRow className="hover:bg-transparent"><TableHead className="w-[420px] px-6 py-4 font-extrabold text-foreground">Question testée</TableHead><TableHead className="font-extrabold text-foreground">Moteur</TableHead><TableHead className="text-center font-extrabold text-foreground">Mention</TableHead><TableHead className="pr-6 font-extrabold text-foreground">Recommandé à votre place</TableHead></TableRow></TableHeader>
                <TableBody>
                  {(data.unlocked ? data.queries : data.queries.slice(0, 3)).map((query, index) => (
                    <TableRow className="hover:bg-[#f8f8f3]" key={`${query.engine}-${query.query}-${index}`}>
                      <TableCell className="px-6 py-4 font-semibold leading-6">
                        {query.query}
                        {(data.unlocked || index === 0) && query.answer_excerpt && (
                          <details className="group mt-2">
                            <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 [&::-webkit-details-marker]:hidden">
                              <ChevronRight className="size-3 transition-transform group-open:rotate-90" aria-hidden="true" />
                              What {query.engine} actually said
                            </summary>
                            <blockquote className="mt-2 rounded-xl border-l-2 border-emerald-600 bg-[#f8f8f3] p-3 text-xs font-normal italic leading-5 text-muted-foreground">
                              “{query.answer_excerpt}”
                            </blockquote>
                          </details>
                        )}
                      </TableCell>
                      <TableCell><Badge variant="outline" className="bg-white"><span className={`mr-2 size-2 rounded-full ${engineColors[query.engine] ?? "bg-slate-400"}`} />{query.engine}</Badge></TableCell>
                      <TableCell className="text-center">{query.brand_mentioned ? <span className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600" aria-label="Marque citée"><CheckCircle2 className="size-5" aria-hidden="true" /></span> : <span className="inline-flex size-8 items-center justify-center rounded-full bg-red-50 text-red-500" aria-label="Marque non citée"><XCircle className="size-5" aria-hidden="true" /></span>}</TableCell>
                      <TableCell className="pr-6">{query.competitors_detected.length ? <div className="flex flex-wrap gap-1.5">{query.competitors_detected.map((competitor) => data.unlocked || competitor === data.top_competitor ? <span className="rounded-md border border-amber-100 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800" key={competitor}>{competitor}</span> : <span className="inline-flex items-center gap-1 rounded-md border border-foreground/10 bg-foreground/5 px-2 py-1 text-xs font-bold text-muted-foreground" key={competitor}><LockKeyhole className="size-3" aria-hidden="true" />{maskName(competitor)}</span>)}</div> : <span className="text-sm italic text-muted-foreground">Aucune entreprise citée</span>}</TableCell>
                    </TableRow>
                  ))}
                  {!data.unlocked && data.queries.length > 3 && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="p-0">
                        <div className="flex flex-col items-center justify-center gap-3 bg-[#f8f8f3] px-6 py-8 sm:flex-row sm:gap-5">
                          <span className="flex items-center gap-2 font-bold text-muted-foreground"><LockKeyhole className="size-4" aria-hidden="true" /> {data.queries.length - 3} more answer checks — plus what each AI actually said — are hidden in the preview</span>
                          <UnlockButton siteId={data.site_id} placement="scan_data" size="sm" className="rounded-full px-5">Débloquer le rapport complet — <Price amounts={PRICES.pro} suffix=" / mois" /></UnlockButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {data.has_subscription && (
          <section className="flex flex-col items-start justify-between gap-4 rounded-[1.5rem] border border-foreground/8 bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-extrabold tracking-[-0.02em]">Votre abonnement Pro</h2>
              <p className="mt-1 text-sm text-muted-foreground">Update your payment method, view invoices or cancel from Stripe&apos;s secure portal.</p>
            </div>
            <ManageSubscriptionButton siteId={data.site_id} className="shrink-0 rounded-full border border-foreground/10 bg-[#f8f8f3] px-5" />
          </section>
        )}

        <section className="flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-lime-200 p-6 sm:flex-row sm:items-center sm:p-8">
          <div><h2 className="text-2xl font-extrabold tracking-[-0.035em]">Envie de mesurer une autre entreprise ?</h2><p className="mt-1 text-sm text-primary/70">Créez un nouveau rapport en quelques minutes.</p></div>
          <Button asChild className="rounded-full"><Link href="/onboarding">Lancer une nouvelle analyse <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link></Button>
        </section>
      </main>
    </div>
  );
}
