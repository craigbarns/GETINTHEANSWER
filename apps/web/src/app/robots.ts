import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// The wildcard rule already permits these, but a company selling AI visibility
// should say so explicitly: many sites block these agents, and an ambiguous
// robots.txt is one more reason for an engine not to cite you.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Bingbot",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/dashboard", "/api/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
