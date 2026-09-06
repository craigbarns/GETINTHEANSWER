import { getCityScan, getScannedPairs } from "@/lib/city-scans";
import { guides } from "@/lib/guides";
import { getIndustry } from "@/lib/industries";
import { getCity } from "@/lib/cities";
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

  const measuredLines = pairs
    .map((pair) => {
      const scan = getCityScan(pair.industry, pair.city);
      const industry = getIndustry(pair.industry);
      const city = getCity(pair.city);
      if (!scan || !industry || !city) return null;
      return `- [${industry.singularName}s in ${city.name}, ${city.stateCode}](${SITE_URL}/ai-seo-for/${pair.industry}/${pair.city}): ${scan.businesses.length} businesses named across ${scan.engines.length} engines, measured ${scan.scannedAt}. Question asked: "${scan.query}"`;
    })
    .filter(Boolean);

  const guideLines = guides.map(
    (guide) => `- [${guide.title}](${SITE_URL}/guides/${guide.slug}): ${guide.description}`,
  );

  const body = `# ${SITE_NAME}

> Measures whether AI assistants recommend a specific local business, and shows
> which competitors they name instead. Queries are run live against ChatGPT,
> Claude, Gemini and Perplexity with web retrieval enabled, so results reflect
> what a customer asking today would actually be told.

## What this site is

${SITE_NAME} runs the questions a customer would ask ("who is the best plumber
in Phoenix?") through four AI engines, records which businesses each one names,
and reports where a given business stands. A free scan is available without an
account; continuous monitoring is a paid subscription.

Method, stated plainly so it can be checked:
- Engines queried: ChatGPT, Claude, Gemini, Perplexity, each with live web retrieval.
- Every business name below was extracted from an engine's own answer.
- Directories, review sites and marketplaces (Yelp, Angi, Thumbtack, Google) are
  excluded: they are not businesses a customer hires.
- A scan is a single-sample snapshot on its stated date, not an average over time.
  Engine answers change; re-running the same question can return a different set.

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
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
