"""GetInTheAnswer MCP server.

Lets agencies (and their AI assistants — Claude Desktop, Claude Code,
Codex, Cursor...) pull a client's AI-visibility data directly into their
AI workflow, instead of logging into a dashboard.

Run:  GITA_API_URL=https://api.getintheanswer.com python server.py
Add to Claude Desktop config:
  {"mcpServers": {"getintheanswer": {"command": "python", "args":
   ["/path/to/apps/mcp/server.py"], "env": {"GITA_API_URL": "..."}}}}
"""

import json
import os
from urllib.request import Request, urlopen

from mcp.server.fastmcp import FastMCP

API_URL = os.getenv("GITA_API_URL", "https://api.getintheanswer.com").rstrip("/")
mcp = FastMCP("getintheanswer")


def _get(path: str) -> object:
    req = Request(f"{API_URL}{path}", headers={"Accept": "application/json", "User-Agent": "GetInTheAnswer-MCP/1.0"})
    with urlopen(req, timeout=30) as response:
        return json.load(response)


@mcp.tool()
def get_client_report(site_id: str) -> str:
    """Get a client's AI visibility report: score, mentions by engine,
    top competitors cited instead of them, and priority recommendations.
    site_id is the UUID from the client's report URL."""
    try:
        return json.dumps(_get(f"/api/dashboard/{site_id}"), ensure_ascii=False)
    except Exception as error:
        return f"Error: {error}"


@mcp.tool()
def get_ai_agent_activity(site_id: str) -> str:
    """Get the client's last-30-day AI agent activity: visits from AI
    crawlers (GPTBot, ClaudeBot, PerplexityBot...) and visitors arriving
    from AI chats (chatgpt.com, perplexity.ai...)."""
    try:
        return json.dumps(_get(f"/api/ai-analytics/summary/{site_id}"), ensure_ascii=False)
    except Exception as error:
        return f"Error: {error}"


@mcp.tool()
def get_score_history(site_id: str) -> str:
    """Get the client's AI visibility score over time (score, brand
    mentions, total queries per measurement)."""
    try:
        return json.dumps(_get(f"/api/dashboard/{site_id}/history"), ensure_ascii=False)
    except Exception as error:
        return f"Error: {error}"


if __name__ == "__main__":
    mcp.run()
