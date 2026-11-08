export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.getintheanswer.com").replace(/\/+$/, "");

export const SITE_NAME = "GetInTheAnswer";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";

/**
 * Pages elsewhere on the web that identify GetInTheAnswer (Organization.sameAs).
 * Engines use them to tie the brand to its profiles. Only add a URL after
 * checking it is live and about this company: the company's own LinkedIn, X or
 * Crunchbase page belong here once they exist.
 * Geocitely: listing checked on 2026-11-08, also linked from the site footer.
 */
export const SITE_SAME_AS: readonly string[] = [
  "https://geocitely.com/tools/getintheanswer",
];

export const SITE_AUTHOR = {
  name: "Gregory Baranes",
  role: "Founder, GetInTheAnswer",
  // Fill in once the profile is live; rendered only when non-empty.
  linkedin: "",
  bio: {
    en: "Gregory Baranes founded GetInTheAnswer to measure how AI engines recommend local businesses. He runs the GetInTheAnswer benchmark — real customer questions asked to ChatGPT, Claude, Gemini and Perplexity across US cities — and writes about what the answers mean for local SEO.",
    fr: "Gregory Baranes a fondé GetInTheAnswer pour mesurer comment les IA recommandent les entreprises locales. Il pilote l'étude GetInTheAnswer — de vraies questions clients posées à ChatGPT, Claude, Gemini et Perplexity dans des villes américaines — et écrit sur ce que ces réponses signifient pour le SEO local.",
  },
} as const;