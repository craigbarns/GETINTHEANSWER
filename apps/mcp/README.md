# GetInTheAnswer MCP server

Lets agencies (and their AI assistants — Claude Desktop, Claude Code, Codex,
Cursor...) pull a client's AI-visibility data directly inside their AI
workflow: score, mentions by engine, competitors cited, AI agent activity,
score history.

## Setup (agency side)

1. `pip install -r apps/mcp/requirements.txt` (single dependency: `mcp`)
2. Get the client's site_id from their report URL
   (`getintheanswer.com/dashboard?site_id=<uuid>`).
3. Add to Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "getintheanswer": {
      "command": "python",
      "args": ["/absolute/path/to/apps/mcp/server.py"],
      "env": { "GITA_API_URL": "https://api.getintheanswer.com" }
    }
  }
}
```

## Tools exposed

| Tool | Returns |
|---|---|
| `get_client_report(site_id)` | Score, mentions by engine, competitors cited, priority recommendations |
| `get_ai_agent_activity(site_id)` | 30-day AI crawler visits + visitors from AI chats |
| `get_score_history(site_id)` | Score over time (last 12 measurements) |

## Example prompts once connected

- « What's the AI visibility score of my client site 510d7327-... and who are the competitors cited instead of them? »
- « Has GPTBot visited my client's site this month? »
- « Show my client's score trend over the last measurements. »

## Roadmap

- v2: authenticated per-agency keys (multi-client workspace)
- v2: `run_quick_scan` tool (trigger a new scan from the assistant)
