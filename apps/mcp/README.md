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


### Remote connector verified (same day)

The public URL (https://api-production-7abb4.up.railway.app/mcp) was added
as a Claude Desktop custom connector ("No authentication" — the server is
open; the SDK's DNS-rebinding host check is set via the MCP_HOST env var).
Claude called all three tools through the remote connector and produced
the full client-ready analysis (score 2/100, Orpi 10 / Pujol 10 / Homki 9
with intent segments, site audit, honest no-guarantee commitments, and
the AI Growth 990 / one-shot 490 recommendation).

Fixes that made it work: uvicorn bound to 0.0.0.0 (Railway's public edge
requires IPv4), MCP_HOST env for the SDK's host check, and /mcp served
natively (catch-all mount) — strict MCP clients reject redirect chains.

Second, combined verification (skill + MCP): Claude loaded the
getintheanswer-data skill, called all three tools and produced a
client-ready analysis of superhome.fr (Marseille real estate): score
2/100, competitors segmented by intent (Orpi/Pujol 10, Homki 9,
beach-adjacent and rental agencies), site audit findings, the
commission-donation insight, honest no-guarantee commitments and the
AI Growth 990 / one-shot 490 recommendation. This transcript is the
agency demo. 

Live test against the production API returned, via get_client_report +
get_ai_agent_activity + get_score_history: superhome.fr, score 2/100,
1/40 mentions (Perplexity only, 75% confidence), Orpi 10 / Pujol 10 /
Homki 9, site audit findings (no LocalBusiness schema, no phone on
homepage, no FAQ), 0 AI crawler visits — with the correct caveat that
agent analytics requires our proxy on the client's site (it is not
installed on superhome.fr yet; it ships with AI Growth deployments).

## Roadmap

- v2: authenticated per-agency keys (multi-client workspace)
- v2: `run_quick_scan` tool (trigger a new scan from the assistant)
