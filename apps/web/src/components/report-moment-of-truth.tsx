import type { Locale } from "@/lib/i18n";
import { DATE_LOCALE } from "@/lib/i18n";
import { selectReportEvidence } from "@/lib/report-evidence";
import type { DashboardData } from "@/lib/seenbyai";
import { ShareAnswerImage } from "@/components/share-answer-image";

export function ReportMomentOfTruth({ data, locale }: { data: DashboardData; locale: Locale }) {
  const evidence = selectReportEvidence(data);
  if (!evidence?.answer_excerpt) return null;
  const fr = locale === "fr";
  const date = data.scanned_at ? new Date(data.scanned_at) : null;
  const measured = date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString(DATE_LOCALE[locale], { day: "numeric", month: "long", year: "numeric" }) : "";
  return (
    <section aria-labelledby="answer-proof-heading" className="rounded-[2rem] border-2 border-lime-300 bg-white p-6 shadow-sm sm:p-9">
      <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">{fr ? "La réponse que voient vos clients" : "The answer your customers see"}</p>
      <h2 id="answer-proof-heading" className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
        {fr ? `Voici ce que ${evidence.engine} a répondu.` : `Here’s what ${evidence.engine} answered.`}
      </h2>
      <p className="mt-5 text-sm font-semibold text-muted-foreground">{fr ? "Question posée :" : "Question asked:"} {evidence.query}</p>
      <blockquote className="mt-5 border-l-4 border-emerald-700 pl-5 text-xl font-bold leading-relaxed text-foreground sm:text-2xl">
        {fr ? "« " : "“"}{evidence.answer_excerpt}{fr ? " »" : "”"}
      </blockquote>
      <p className="mt-5 font-semibold text-emerald-800">
        {evidence.brand_mentioned
          ? (fr ? "Votre entreprise est citée dans cette réponse." : "Your business is named in this answer.")
          : (fr ? "Votre entreprise n’est pas citée dans cette réponse." : "Your business is not named in this answer.")}
      </p>
      <p className="mb-5 mt-2 text-xs leading-5 text-muted-foreground">
        {fr ? "Extrait original du relevé" : "Original excerpt from the scan"}{measured ? ` · ${measured}` : ""}.
        {fr ? " Les réponses peuvent varier d’un relevé à l’autre." : " Answers may vary between scans."}
      </p>
      <ShareAnswerImage company={data.company_name} city={data.city} engine={evidence.engine} query={evidence.query} excerpt={evidence.answer_excerpt} measured={measured} locale={locale} />
    </section>
  );
}
