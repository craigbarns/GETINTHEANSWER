import type { Locale } from "@/lib/i18n";

/** Service offers are quoted per market: EUR for the French site, USD for the
 * English site. They are pilot proposals, never Stripe subscriptions created
 * by the site. The Pro software currency toggle does not affect these prices. */
export const GROWTH_PLANS = {
  ai_growth: { name: "AI Growth", monthlyEur: 990, monthlyUsd: 990, initialMonths: 3 },
  ai_growth_plus: { name: "AI Growth Plus", monthlyEur: 1990, monthlyUsd: 1990, initialMonths: 3 },
} as const;

export type GrowthPlan = keyof typeof GROWTH_PLANS;
export type ContactPlan = "agency" | "done_for_you" | GrowthPlan;

export function isGrowthPlan(plan: ContactPlan): plan is GrowthPlan {
  return plan === "ai_growth" || plan === "ai_growth_plus";
}

export function parseContactPlan(value: string | string[] | undefined): ContactPlan {
  const query = Array.isArray(value) ? value[0] : value;
  if (query === "ai-growth") return "ai_growth";
  if (query === "ai-growth-plus") return "ai_growth_plus";
  if (query === "done-for-you") return "done_for_you";
  return "agency";
}

export function growthPrice(plan: GrowthPlan, locale: Locale) {
  if (locale === "fr") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(GROWTH_PLANS[plan].monthlyEur);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(GROWTH_PLANS[plan].monthlyUsd);
}
