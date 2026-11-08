import { getBenchmarkStats, getCityScan, getScannedPairs } from "@/lib/city-scans";
import { guides } from "@/lib/guides";
import { getIndustry, industries } from "@/lib/industries";
import { getCity } from "@/lib/cities";
import { DONE_FOR_YOU_PRICE, PRICES } from "@/lib/pricing";
import { GROWTH_PLANS } from "@/lib/growth";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms-full.txt — the full-content companion to /llms.txt (llmstxt.org convention).
 *
 * While llms.txt is the index, llms-full.txt carries the complete content: every
 * measured scan, every guide, every plan. Engines that read llms.txt and want the
 * whole picture get it here — with the same rule: only figures the site can
 * substantiate.
 */
export function GET() {
  const pairs = getScannedPairs();
  const stats = getBenchmarkStats();

  const measuredSections = pairs
    .map((pair) => {
      const scan = getCityScan(pair.industry, pair.city);
      const industry = getIndustry(pair.industry);
      const city = getCity(pair.city);
      if (!scan || !industry || !city) return null;
      const businessList = scan.businesses
        .map((b) => `- ${b.name}`)
        .join("\n");
      const engines = scan.engines.map((e) => e.engine).join(", ");
      return `## ${industry.name} in ${city.name}, ${city.stateCode}\n\nQuestion asked: "${scan.query}"\nEngines: ${engines}\nMeasured: ${scan.scannedAt}\nBusinesses named (${scan.businesses.length}):\n${businessList}\n\nSource: ${SITE_URL}/ai-seo-for/${pair.industry}/${pair.city}`;
    })
    .filter(Boolean);

  const guideSections = guides
    .map((guide) => `## ${guide.title}\n\n${guide.description}\n\nURL: ${SITE_URL}/guides/${guide.slug}${guide.dateModified ? `\nLast updated: ${guide.dateModified}` : ""}`)
    .join("\n\n");

  const industryLines = industries
    .map((i) => `- [${i.name}](${SITE_URL}/ai-seo-for/${i.slug})`)
    .join("\n");

  const body = `# ${SITE_NAME}

> Helps businesses act on AI visibility audits through scoped SEO improvements
> and useful content, subject to client approval. The software measures mentions
> of businesses in model responses and records which competitors are named. Published results are dated snapshots of API responses;
> they are not guarantees of what a consumer assistant will answer today.

This is the full version of /llms.txt. Everything the site can substantiate is
here: measured results, guides, methodology, plans and tools.

## What this site is

${SITE_NAME} offers a free visibility plan and monthly AI Growth pilot services.
Website improvements and content are agreed in a quote and approved by the client
before publication. The software runs the questions a customer would ask ("who is the best plumber
in Phoenix?") through four AI engines, records which businesses each one names,
and reports where a given business stands. English is served at the root;
the French product pages are under /fr.

## Method and limitations

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

## Study and methodology

- [Local AI visibility benchmark](${SITE_URL}/study): ${stats ? `${stats.scans} local searches across ${stats.cities} US cities and ${stats.industries} industries; measurements through ${stats.lastScanDate}.` : "No measured results are currently published."}

## Product and plans

- [Pricing](${SITE_URL}/pricing): every plan on one page — free audit, Pro
  software, AI Growth, AI Growth Plus, Agency and the one-time fix.
- [AI Growth](${SITE_URL}/contact?plan=ai-growth): $${GROWTH_PLANS.ai_growth.monthlyUsd}/month,
  excluding tax, 3-month initial commitment. Pilot proposal: technical audit,
  scoped website fixes, 2 useful pages per month, weekly model checks and a
  monthly report. Scope and quote confirmed before payment.
- [AI Growth Plus](${SITE_URL}/contact?plan=ai-growth-plus): $${GROWTH_PLANS.ai_growth_plus.monthlyUsd}/month,
  excluding tax, 3-month initial commitment. Expanded editorial program,
  legitimate external visibility opportunities and monthly strategic support,
  with the scope confirmed in the quote.
- Service prices are quoted per market: USD on the English site, EUR on the French site. The Pro software currency toggle does not change service prices.
- Clients approve publication. Automated WordPress/Shopify publishing is not
  currently a product feature. No AI mentions, traffic or customers are guaranteed.
- Google AI Overviews and AI Mode are addressed through SEO fundamentals.
  Current automated tracking measures model responses, including Gemini;
  it does not directly measure AI Overviews or AI Mode.

- [Free analysis](${SITE_URL}/onboarding): first business visibility scan and up to 3 initial
  opportunities, no credit card required.
- [Sample report](${SITE_URL}/sample-report): illustrative report for a fictional
  business, not a customer testimonial or a measured client result.
- [Self-service Pro software](${SITE_URL}/pricing): $${PRICES.pro.usd} or EUR ${PRICES.pro.eur} per month.
- [Agency](${SITE_URL}/agency): $${PRICES.agency.usd} or EUR ${PRICES.agency.eur} per month.
- [Done-for-you service](${SITE_URL}/contact?plan=done-for-you): $${DONE_FOR_YOU_PRICE.usd} or
  EUR ${DONE_FOR_YOU_PRICE.eur} one time, subject to site review and quote confirmation.

## Industries covered

${industryLines}

## Measured results by city

${measuredSections.length ? measuredSections.join("\n\n") : "- No city scans published yet."}

## Guides

${guideSections}

## Tools

- [Ask ChatGPT about your business](${SITE_URL}/tools/ai-chat): enter a business
  and a city; ChatGPT answers the question customers ask, live. Free, no signup.
- [AEO audit](${SITE_URL}/tools/aeo-audit): 16 technical checks and 6
  content-quality dimensions, an A-F grade and prioritized fixes. Free, no signup.
- [LocalBusiness schema generator](${SITE_URL}/tools/schema-generator): free, no
  account, produces Schema.org markup for a local business.

## Start here

- [Run a free scan](${SITE_URL}/onboarding)
- [Pricing](${SITE_URL}/pricing)
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
