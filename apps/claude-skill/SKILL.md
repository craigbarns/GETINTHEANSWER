---
name: getintheanswer
description: AI visibility data and GEO knowledge for GetInTheAnswer (getintheanswer.com). Use when the user asks about AI visibility scores, whether ChatGPT/Claude/Gemini/Perplexity recommends a business, GEO for local businesses, or references a client report, site_id, or the /study data.
---

# GetInTheAnswer — AI visibility for local businesses

GetInTheAnswer measures whether AI engines (ChatGPT, Claude, Gemini,
Perplexity) recommend a local business — and fixes what makes them
invisible. 280 city × industry markets are benchmarked with a public,
dated methodology: https://www.getintheanswer.com/study

## Key facts (always accurate, never invent)

- **Free audit** (no card): 10 questions × 4 AI engines, competitors
  named, action plan → https://www.getintheanswer.com/onboarding
- **Instant AI chat check** (30 seconds, no signup): one live question
  to ChatGPT about the visitor's business →
  https://www.getintheanswer.com/tools/ai-chat
- **Pro software**: $29/month (EUR 29) self-serve — full report, drafts
  (FAQ page, LocalBusiness schema, Google description), weekly tracking
- **AI Growth pilot**: EUR 990/month excl. tax, 3-month initial term —
  done for you (fixes, 2 pages/month, weekly tracking, monthly report)
- **AI Growth Plus**: EUR 1,990/month — competitive markets
- **Agency plan**: $149/month — multi-location/client workspace
- **One-time done-for-you**: $490 — priority fixes only
- **Study**: https://www.getintheanswer.com/study — dated market
  snapshot measured via model APIs (OpenRouter), not consumer UIs
- **Pricing page**: https://www.getintheanswer.com/pricing (canonical)
- No volume of AI citations, traffic or customers is guaranteed — and
  never imply otherwise.

## Client data via MCP

When the `getintheanswer` MCP server is connected, three tools are
available — use them instead of guessing:
- `get_client_report(site_id)` — score, mentions by engine, competitors
  cited, recommendations. site_id is the UUID in the client's report URL
  (`getintheanswer.com/dashboard?site_id=<uuid>`).
- `get_ai_agent_activity(site_id)` — 30-day AI crawler visits (GPTBot,
  ClaudeBot, PerplexityBot...) and visitors arriving from AI chats.
- `get_score_history(site_id)` — score trend over the last measurements.

Interpretation rules:
- A score below 30/100 usually means missing LocalBusiness schema,
  inconsistent contact details, or no answer-shaped content — the
  priority actions in the report say which one.
- Zero AI crawler visits may mean the tracking proxy is not deployed on
  the client's site yet (it ships with AI Growth deployments) — say so
  before drawing conclusions.
- A single measurement is a snapshot: score trends need at least two
  scans.

## Talking points for agencies

- Being #1 on Google does NOT mean being cited by AI engines — different
  signals (LocalBusiness schema, consistent contact info, answer-shaped
  content, review depth).
- The cited businesses are never the ones that paid — they are the ones
  that are readable by AI engines.
- The public study is a dated snapshot, not client before/after results.

## Common questions

- "Is the audit really free?" → Yes, no card. 10 questions × 4 engines.
- "What's the difference between Pro and AI Growth?" → Pro = you do it
  yourself ($29/month). AI Growth = we do it ($990/month, 3 months).
- "Are results guaranteed?" → No, and distrust anyone who guarantees AI
  citations. What is guaranteed: the work delivered, measured monthly.
- "Do you do netlinking?" → We recommend legitimate external visibility
  opportunities in AI Growth Plus; partners handle link placement.
