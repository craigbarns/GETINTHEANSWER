import { getCity } from "@/lib/cities";
import { getContractorSeoCity } from "@/lib/contractor-seo";
import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const entry = getContractorSeoCity(citySlug);
  const city = entry ? getCity(entry.city) : null;

  if (!city) {
    return renderOgImage({ title: "Contractor SEO That AI Engines Reward" });
  }

  return renderOgImage({
    title: `Contractor SEO in ${city.name}`,
    badge: `${city.name}, ${city.stateCode}`,
    eyebrow: "Local SEO for Contractors",
  });
}
