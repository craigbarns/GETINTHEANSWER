import type { MetadataRoute } from "next";
import { getScannedPairs } from "@/lib/city-scans";
import { guides } from "@/lib/guides";
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

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/onboarding`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
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
