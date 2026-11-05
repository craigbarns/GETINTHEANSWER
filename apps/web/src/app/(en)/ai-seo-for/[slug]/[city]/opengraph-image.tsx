import { getCity } from "@/lib/cities";
import { getIndustry } from "@/lib/industries";
import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string; city: string }>;
}) {
  const { slug, city: citySlug } = await params;
  const industry = getIndustry(slug);
  const city = getCity(citySlug);

  if (!industry || !city) {
    return renderOgImage({ title: "AI Visibility for Local Businesses" });
  }

  return renderOgImage({
    title: `AI SEO for ${industry.name} in ${city.name}`,
    badge: `${city.name}, ${city.stateCode}`,
  });
}
