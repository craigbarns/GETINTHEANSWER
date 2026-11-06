# AI Agent Analytics edge worker

Logs AI crawler visits and AI-chat referrals for ANY site behind Cloudflare —
server-side, because AI crawlers do not execute JavaScript.

## Deploy (5 min, per client site)

1. Client moves their DNS to Cloudflare (free plan) if not already there.
2. `npx wrangler init` in a copy of this folder (module worker).
3. Set secrets:
   - `wrangler secret put SITE_ID`    -> the client's site_id UUID
   - `wrangler secret put API_URL`    -> e.g. https://api.getintheanswer.com
4. `npx wrangler deploy`
5. In Cloudflare dashboard: Workers Routes -> add route `client-domain/*`
   (or use `wrangler.toml` routes). The worker forwards every request
   unchanged (`return fetch(request)`) and logs only AI hits.

## Verification
- curl -A "GPTBot/1.0" https://client-domain/ then check the client
  dashboard's AI agent analytics section within a minute.
