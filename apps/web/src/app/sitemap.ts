import type { MetadataRoute } from "next";
import { getScannedPairs } from "@/lib/city-scans";
import { guides } from "@/lib/guides";
import { localePath } from "@/lib/i18n";
import { industries } from "@/lib/industries";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Only pairs carrying a real measured scan. The rest are noindex until
  // scripts/generate_city_scans.py gives them something of their own to say.
  const cityIndustryUrls: MetadataRoute.Sitemap = getScannedPairs().map((pair) => ({
    url: `${SITE_URL}/ai-seo-for/${pair.industry}/${pair.city}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // Pages that exist in both languages: one entry per language, each listing
  // the other as its hreflang alternate.
  const bilingual = (
    path: string,
    changeFrequency: "weekly" | "monthly",
    priority: number,
  ): MetadataRoute.Sitemap => {
    const languages = {
      en: `${SITE_URL}${path === "/" ? "" : path}`,
      fr: `${SITE_URL}${localePath("fr", path)}`,
    };
    return [
      { url: languages.en || SITE_URL, lastModified: now, changeFrequency, priority, alternates: { languages } },
      { url: languages.fr, lastModified: now, changeFrequency, priority: Math.max(0.1, priority - 0.1), alternates: { languages } },
    ];
  };

  return [
    ...bilingual("/", "weekly", 1),
    ...bilingual("/onboarding", "monthly", 0.9),
    ...bilingual("/sample-report", "monthly", 0.85),
    ...bilingual("/agency", "monthly", 0.7),
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/study`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/schema-generator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/ai-seo-for`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...["legal", "privacy", "terms"].map((page) => ({
      url: `${SITE_URL}/${page}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...guides.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      lastModified: new Date(guide.datePublished),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...industries.map((industry) => ({
      url: `${SITE_URL}/ai-seo-for/${industry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...cityIndustryUrls,
  ];
}
