import type { MetadataRoute } from "next";
import { getBenchmarkStats, getCityScan, getScannedPairs } from "@/lib/city-scans";
import { getCity } from "@/lib/cities";
import { STUDY_METHOD_UPDATED_AT } from "@/lib/content-dates";
import { guides } from "@/lib/guides";
import { localePath } from "@/lib/i18n";
import { getIndustry, industries } from "@/lib/industries";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const stats = getBenchmarkStats();

  // Only pairs carrying a real measured scan. The rest are noindex until
  // scripts/generate_city_scans.py gives them something of their own to say.
  const cityIndustryUrls: MetadataRoute.Sitemap = getScannedPairs().flatMap((pair) => {
    const scan = getCityScan(pair.industry, pair.city);
    if (!scan || !getIndustry(pair.industry) || !getCity(pair.city)) return [];
    return [{
      url: `${SITE_URL}/ai-seo-for/${pair.industry}/${pair.city}`,
      lastModified: scan.scannedAt,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }];
  });

  // Pages that exist in both languages: one entry per language, each listing
  // the other as its hreflang alternate.
  const bilingual = (
    path: string,
    changeFrequency: "weekly" | "monthly",
    priority: number,
  ): MetadataRoute.Sitemap => {
    const englishUrl = `${SITE_URL}${path === "/" ? "" : path}`;
    const languages = {
      en: englishUrl,
      fr: `${SITE_URL}${localePath("fr", path)}`,
      "x-default": englishUrl,
    };
    return [
      { url: languages.en, changeFrequency, priority, alternates: { languages } },
      { url: languages.fr, changeFrequency, priority: Math.max(0.1, priority - 0.1), alternates: { languages } },
    ];
  };

  return [
    ...bilingual("/", "weekly", 1),
    ...bilingual("/onboarding", "monthly", 0.9),
    ...bilingual("/sample-report", "monthly", 0.85),
    ...bilingual("/agency", "monthly", 0.7),
    ...bilingual("/contact", "monthly", 0.7),
    {
      url: `${SITE_URL}/guides`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/study`,
      lastModified: stats && stats.lastScanDate > STUDY_METHOD_UPDATED_AT ? stats.lastScanDate : STUDY_METHOD_UPDATED_AT,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/schema-generator`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/ai-seo-for`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...["legal", "privacy", "terms"].map((page) => ({
      url: `${SITE_URL}/${page}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...guides.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      lastModified: guide.dateModified ?? guide.datePublished,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...industries.map((industry) => ({
      url: `${SITE_URL}/ai-seo-for/${industry.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...cityIndustryUrls,
  ];
}
