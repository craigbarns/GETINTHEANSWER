import type { DashboardData, QueryResult } from "@/lib/seenbyai";

/** Pick an actual excerpt, preferring a visible competitor in a missed answer. */
export function selectReportEvidence(data: Pick<DashboardData, "mode" | "queries">): QueryResult | null {
  if (data.mode !== "live") return null;
  const answers = data.queries.filter((query) => query.answer_excerpt?.trim());
  const missedWithCompetitor = (query: QueryResult) => !query.brand_mentioned && query.competitors_detected.some(
    (name) => query.answer_excerpt!.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
  );
  return answers.find((query) => query.engine === "ChatGPT" && missedWithCompetitor(query))
    ?? answers.find(missedWithCompetitor)
    ?? answers.find((query) => query.engine === "ChatGPT")
    ?? answers[0]
    ?? null;
}
