"""MCP server over Streamable HTTP, mounted into the FastAPI app.

Lets agencies connect Claude Desktop / Claude Code / Cursor via a remote
URL (no local install): add https://<api-domain>/mcp as a custom
connector. Tools read the same data as the dashboard — read-only.
"""

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("getintheanswer")


@mcp.tool()
def get_client_report(site_id: str) -> str:
    """Get a client's AI visibility report: score, mentions by engine,
    top competitors cited instead of them, and priority recommendations.
    site_id is the UUID from the client's report URL."""
    import json

    import main

    dashboard = main.load_report(site_id)
    if dashboard is None:
        return f"No report found for site_id {site_id}"
    return json.dumps(dashboard.model_dump(), ensure_ascii=False, default=str)


@mcp.tool()
def get_ai_agent_activity(site_id: str) -> str:
    """Get the client's last-30-day AI agent activity: visits from AI
    crawlers (GPTBot, ClaudeBot, PerplexityBot...) and visitors arriving
    from AI chats (chatgpt.com, perplexity.ai...)."""
    import json

    import main

    return json.dumps(main.ai_agent_summary(site_id).model_dump(), ensure_ascii=False)


@mcp.tool()
def get_score_history(site_id: str) -> str:
    """Get the client's AI visibility score over time (last 12
    measurements): score, brand mentions and total queries per date."""
    import json

    import main

    return json.dumps([point.model_dump() for point in main.load_history(site_id)], ensure_ascii=False)
