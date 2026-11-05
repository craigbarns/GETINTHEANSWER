import { getCity } from "@/lib/cities";

/** Measured Search Console demand (Nov 2026): "contractor seo <city>" queries
 *  where getintheanswer.com already ranks on page 1 (position 4.9–12.5) with
 *  near-zero clicks because no dedicated page existed. Each entry maps the
 *  query city to related industry guides for internal linking. */
export const contractorSeoCities = [
  { city: "miami-fl", gscPosition: 4.9, related: ["roofers", "electricians"] },
  { city: "tampa-fl", gscPosition: 6.8, related: ["roofers", "plumbers"] },
  { city: "san-antonio-tx", gscPosition: 8.0, related: ["hvac-contractors", "plumbers"] },
  { city: "columbus-oh", gscPosition: 7.7, related: ["hvac-contractors", "electricians"] },
  { city: "charlotte-nc", gscPosition: 8.0, related: ["roofers", "hvac-contractors"] },
  { city: "portland-or", gscPosition: 8.8, related: ["electricians", "plumbers"] },
  { city: "dallas-tx", gscPosition: 12.5, related: ["hvac-contractors", "roofers"] },
] as const;

export function getContractorSeoCity(citySlug: string) {
  return contractorSeoCities.find((c) => c.city === citySlug);
}

export function resolveContractorSeoCity(citySlug: string) {
  const entry = getContractorSeoCity(citySlug);
  const city = getCity(citySlug);
  return entry && city ? { entry, city } : null;
}
