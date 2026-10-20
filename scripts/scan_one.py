#!/usr/bin/env python3
"""Scan one business and print what the engines said. Sends no e-mail.

Built for agency outreach: the business scanned is somebody else's client, so
mailing them would be both useless and rude. notify=false is not optional here,
and the API only honours it for callers holding OUTREACH_API_KEY — without the
key this refuses to run rather than quietly mailing a stranger.

Usage:
  export OUTREACH_API_KEY=...
  python3 scripts/scan_one.py --name "Somers Plumbers" \\
      --url https://somersplumbers.com --city "Phoenix, AZ" --industry Plumber
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

DEFAULT_API = "https://www.getintheanswer.com"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--name", required=True, help="business name")
    parser.add_argument("--url", required=True, help="business website")
    parser.add_argument("--city", required=True, help='e.g. "Phoenix, AZ"')
    parser.add_argument("--industry", required=True, help='e.g. "Plumber"')
    parser.add_argument("--api", default=os.getenv("OUTREACH_API_BASE", DEFAULT_API))
    parser.add_argument("--timeout", type=int, default=300)
    parser.add_argument("--json", action="store_true", help="machine-readable output only")
    args = parser.parse_args()

    key = os.getenv("OUTREACH_API_KEY", "").strip()
    if not key:
        print(
            "[x] OUTREACH_API_KEY is not set.\n"
            "    Without it the API treats this as a public scan and e-mails the address below,\n"
            "    which here belongs to someone else's client. Refusing to run.\n"
            "    Get it with: railway variables --service api --kv | grep OUTREACH_API_KEY",
            file=sys.stderr,
        )
        return 1

    body = {
        "companyName": args.name,
        "websiteUrl": args.url,
        # Never a real inbox: notify=false suppresses delivery, and this address
        # is only stored against the report.
        "email": "outreach@getintheanswer.com",
        "city": args.city,
        "industry": args.industry,
        "notify": False,
    }

    request = urllib.request.Request(
        f"{args.api.rstrip('/')}/api/onboarding",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "X-Outreach-Key": key,
            "User-Agent": "GetInTheAnswer-ScanOne/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=args.timeout) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:300]
        print(f"[x] HTTP {exc.code}: {detail}", file=sys.stderr)
        return 1
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"[x] {exc}", file=sys.stderr)
        return 1

    summary = result.get("summary")
    if not summary:
        print(
            "[x] No summary returned — the API did not accept the key as internal.\n"
            "    Stopping: an e-mail written without the numbers would be guesswork.",
            file=sys.stderr,
        )
        return 1

    report_url = f"{args.api.rstrip('/')}/dashboard?site_id={result['site_id']}"
    payload = {
        "company": args.name,
        "city": args.city,
        "report_url": report_url,
        "mode": result.get("mode"),
        **summary,
    }

    if args.json:
        print(json.dumps(payload, indent=2))
        return 0

    if result.get("mode") == "simulation":
        print("[!] SIMULATION MODE — engines were unreachable. These numbers are not real.")
        print("[!] Do not write to anyone from this. Check OPENROUTER_API_KEY on the api service.\n")

    print(f"{args.name} — {args.city}")
    print(f"  visibility score : {summary.get('visibility_score')}/100")
    print(f"  named in         : {summary.get('brand_mentions')} of {summary.get('total_queries')} answers")
    print(f"  top competitor   : {summary.get('top_competitor') or '(none detected)'}")
    print(f"  engines          : {', '.join(summary.get('engines_used') or []) or '(none)'}")
    print(f"  question sample  : {summary.get('sample_query')}")
    print(f"  report           : {report_url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
