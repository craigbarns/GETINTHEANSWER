"""AI agent (crawler) and AI-referral detection.

Used by the Agent Analytics feature: identify which AI crawlers visited a
site and which visits came from AI chat surfaces, so customers can see how
AI engines interact with their pages.
"""

from pydantic import BaseModel

# Substring -> display name. Substrings are matched case-insensitively
# against the User-Agent header.
AI_CRAWLERS: dict[str, str] = {
    "gptbot": "ChatGPT (OpenAI)",
    "oai-searchbot": "ChatGPT Search (OpenAI)",
    "chatgpt-user": "ChatGPT User (OpenAI)",
    "claudebot": "Claude (Anthropic)",
    "claude-web": "Claude (Anthropic)",
    "claude-user": "Claude User (Anthropic)",
    "anthropic-ai": "Claude (Anthropic)",
    "perplexitybot": "Perplexity",
    "perplexity-user": "Perplexity User",
    "google-extended": "Gemini (Google)",
    "googleother": "Gemini (Google)",
    "gemini": "Gemini (Google)",
    "bingbot": "Copilot (Bing)",
    "applebot-extended": "Apple Intelligence",
    "ccbot": "CCBot (Common Crawl)",
    "meta-externalagent": "Meta AI",
    "amazonbot": "Amazon (Alexa)",
}

# Host substring -> engine label, matched against the Referer header.
AI_CHAT_REFERRERS: dict[str, str] = {
    "chatgpt.com": "ChatGPT",
    "chat.openai.com": "ChatGPT",
    "perplexity.ai": "Perplexity",
    "claude.ai": "Claude",
    "gemini.google.com": "Gemini",
    "copilot.microsoft.com": "Microsoft Copilot",
}


def detect_agent(user_agent: str | None) -> str | None:
    """Return the AI crawler name for a User-Agent, or None."""
    ua = (user_agent or "").lower()
    for needle, name in AI_CRAWLERS.items():
        if needle in ua:
            return name
    return None


def detect_referrer_engine(referer: str | None) -> str | None:
    """Return the AI chat engine name for a Referer header, or None."""
    ref = (referer or "").lower()
    for needle, engine in AI_CHAT_REFERRERS.items():
        if needle in ref:
            return engine
    return None


class AiAgentHit(BaseModel):
    site_id: str
    user_agent: str | None = None
    referrer: str | None = None
    path: str = "/"


class AiAgentSummary(BaseModel):
    site_id: str
    crawler_visits: int
    ai_referral_visits: int
    crawlers: dict[str, int]
    referral_engines: dict[str, int]
    top_crawled_paths: list[str]
