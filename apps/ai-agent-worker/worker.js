// AI Agent Analytics edge worker — logs AI crawler visits and AI-chat
// referrals for ANY site, server-side (crawlers do not execute JS).
// Deploy on Cloudflare Workers; set SITE_ID and API_URL as secret vars.

const AI_CRAWLERS = [
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

const AI_CHAT_REFERRERS = [
  ["chatgpt.com", "ChatGPT"],
  ["chat.openai.com", "ChatGPT"],
  ["perplexity.ai", "Perplexity"],
  ["claude.ai", "Claude"],
  ["gemini.google.com", "Gemini"],
  ["copilot.microsoft.com", "Microsoft Copilot"],
];

function detect(list, value) {
  const v = (value || "").toLowerCase();
  for (const [needle, name] of list) {
    if (v.includes(needle)) return name;
  }
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";
    const agent = detect(AI_CRAWLERS, userAgent);
    const engine = detect(AI_CHAT_REFERRERS, referrer);

    if ((agent || engine) && env.SITE_ID && env.API_URL) {
      // Log AFTER the response is computed; never block or fail the visit.
      request.waitUntil(
        fetch(`${env.API_URL}/api/ai-analytics/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            site_id: env.SITE_ID,
            user_agent: userAgent.slice(0, 500),
            referrer: referrer.slice(0, 500),
            path: url.pathname.slice(0, 500),
          }),
        }).catch(() => {})
      );
    }

    return fetch(request);
  },
};
