import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AI_CRAWLERS: Array<[string, string]> = [
  ["gptbot", "ChatGPT (OpenAI)"],
  ["oai-searchbot", "ChatGPT Search (OpenAI)"],
  ["chatgpt-user", "ChatGPT User (OpenAI)"],
  ["claudebot", "Claude (Anthropic)"],
  ["claude-user", "Claude User (Anthropic)"],
  ["anthropic-ai", "Claude (Anthropic)"],
  ["perplexitybot", "Perplexity"],
  ["perplexity-user", "Perplexity User"],
  ["google-extended", "Gemini (Google)"],
  ["googleother", "Gemini (Google)"],
  ["bingbot", "Copilot (Bing)"],
  ["applebot-extended", "Apple Intelligence"],
  ["meta-externalagent", "Meta AI"],
];

const AI_CHAT_REFERRERS: Array<[string, string]> = [
  ["chatgpt.com", "ChatGPT"],
  ["chat.openai.com", "ChatGPT"],
  ["perplexity.ai", "Perplexity"],
  ["claude.ai", "Claude"],
  ["gemini.google.com", "Gemini"],
  ["copilot.microsoft.com", "Microsoft Copilot"],
];

function detectAgent(userAgent: string): string | null {
  const ua = userAgent.toLowerCase();
  for (const [needle, name] of AI_CRAWLERS) {
    if (ua.includes(needle)) return name;
  }
  return null;
}

function detectReferrerEngine(referrer: string): string | null {
  const ref = referrer.toLowerCase();
  for (const [needle, engine] of AI_CHAT_REFERRERS) {
    if (ref.includes(needle)) return engine;
  }
  return null;
}

const API_BASE_URL =
  process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8000";

export function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer = request.headers.get("referer") ?? "";
  const agent = detectAgent(userAgent);
  const engine = detectReferrerEngine(referrer);

  if (agent || engine) {
    // Fire-and-forget: a failed analytics call must never break the page.
    const siteId = process.env.NEXT_PUBLIC_SITE_ID ?? "";
    const body = JSON.stringify({
      site_id: siteId,
      user_agent: userAgent.slice(0, 500),
      referrer: referrer.slice(0, 500),
      path: request.nextUrl.pathname.slice(0, 500),
    });
    fetch(`${API_BASE_URL}/api/ai-analytics/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => {});
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
