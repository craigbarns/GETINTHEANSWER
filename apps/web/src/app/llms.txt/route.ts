import { getBenchmarkStats, getCityScan, getScannedPairs } from "@/lib/city-scans";
import { guides } from "@/lib/guides";
import { getIndustry } from "@/lib/industries";
import { getCity } from "@/lib/cities";
import { DONE_FOR_YOU_PRICE, PRICES } from "@/lib/pricing";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt — the convention for telling AI crawlers what a site holds.
 *
 * Built from the same measured scans the pages render, so an engine reading
 * this gets the actual figures rather than marketing copy. Every claim here is
 * one the site can substantiate.
 */
export function GET() {
  const pairs = getScannedPairs();
  const stats = getBenchmarkStats();

  const measuredLines = pairs
    .map((pair) => {
      const scan = getCityScan(pair.industry, pair.city);
      const industry = getIndustry(pair.industry);
      const city = getCity(pair.city);
      if (!scan || !industry || !city) return null;
      return `- [${industry.name} in ${city.name}, ${city.stateCode}](${SITE_URL}/ai-seo-for/${pair.industry}/${pair.city}): ${scan.businesses.length} business names recorded across ${scan.engines.length} model responses, measured ${scan.scannedAt}. Question asked: "${scan.query}"`;
    })
    .filter(Boolean);

  const guideLines = guides.map(
    (guide) => `- [${guide.title}](${SITE_URL}/guides/${guide.slug}): ${guide.description}`,
  );

  const body = `# ${SITE_NAME}

> Measures mentions of local businesses in AI model responses and records which
> competitors are named. Published results are dated snapshots of API responses;
> they are not guarantees of what a consumer assistant will answer today.

## What this site is

${SITE_NAME} runs the questions a customer would ask ("who is the best plumber
in Phoenix?") through four AI engines, records which businesses each one names,
and reports where a given business stands. English is served at the root;
the French product pages are under /fr.

## Study and methodology

- [Local AI visibility benchmark](${SITE_URL}/study): ${stats ? `${stats.scans} local searches across ${stats.cities} US cities and ${stats.industries} industries; measurements through ${stats.lastScanDate}.` : "No measured results are currently published."}
- [Method and limitations](${SITE_URL}/study#methodology): collection, extraction,
  sampling and the distinction between API models and consumer applications.

Method, stated plainly so it can be checked:
- The collection script queries models through OpenRouter with web retrieval
  requested, and labels them ChatGPT, Claude, Gemini and Perplexity.
- Every business name below was extracted from a model response. Name variants
  can remain separate entries; the counts are not verified unique legal entities.
- Directories, review sites and marketplaces (Yelp, Angi, Thumbtack, Google) are
  excluded: they are not businesses a customer hires.
- A scan is a single-sample snapshot on its stated date, not an average over time.
  Engine answers change; re-running the same question can return a different set.
- Historical city files retain questions, dates and extracted names, not full
  answer texts, cited URLs or model versions.

## Product and plans

- [Free analysis](${SITE_URL}/onboarding): first business visibility scan, no
  credit card required.
- [Sample report](${SITE_URL}/sample-report): illustrative report for a fictional
  business, not a customer testimonial or a measured client result.
- [Pro](${SITE_URL}/#pricing): $${PRICES.pro.usd} or EUR ${PRICES.pro.eur} per month.
- [Agency](${SITE_URL}/agency): $${PRICES.agency.usd} or EUR ${PRICES.agency.eur} per month.
- [Done-for-you service](${SITE_URL}/contact?plan=done-for-you): $${DONE_FOR_YOU_PRICE.usd} or
  EUR ${DONE_FOR_YOU_PRICE.eur} one time, subject to site review and quote confirmation.

## Pages en français

- [Accueil](${SITE_URL}/fr): visibilité IA des entreprises locales.
- [Analyse gratuite](${SITE_URL}/fr/onboarding): lancer une analyse en français.
- [Exemple de rapport](${SITE_URL}/fr/sample-report): exemple illustratif pour une
  entreprise fictive.
- [Agences](${SITE_URL}/fr/agency): offre pour agences et multi-établissements.
- [Contact](${SITE_URL}/fr/contact): demande agence ou prise en charge complète.

## Measured results by city

${measuredLines.length ? measuredLines.join("\n") : "- No city scans published yet."}

## Guides

${guideLines.join("\n")}

## Tools

- [LocalBusiness schema generator](${SITE_URL}/tools/schema-generator): free, no
  account, produces Schema.org markup for a local business.

## Start here

- [Run a free scan](${SITE_URL}/onboarding)
- [All industries and cities](${SITE_URL}/ai-seo-for)
- [Agencies and multi-location](${SITE_URL}/agency)
- [Publisher and legal information](${SITE_URL}/legal): ${SITE_NAME} is published
  by WEMADE. The legal notice identifies the publisher and publication director.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
