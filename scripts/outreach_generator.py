#!/usr/bin/env python3
"""Build an outbound queue from real GetInTheAnswer scans.

This script NEVER sends anything. It scans prospects through the live API,
writes truthful copy derived from each scan, and produces a CSV you import
into a dedicated cold-email tool (Instantly, Smartlead, lemlist...).

Why it never sends:
  POST /api/onboarding emails the address it is given. Sending prospecting
  mail from the transactional domain (getintheanswer.com, via Resend) would
  wreck deliverability for real customers' report links and breaches Resend's
  terms, which cover transactional mail only. Scans here run with
  notify=false, which the API honours for callers holding OUTREACH_API_KEY.

Required environment:
  OUTREACH_API_KEY            same value as the API service variable
  OUTREACH_POSTAL_ADDRESS     real postal address, required by CAN-SPAM
  OUTREACH_UNSUBSCRIBE_URL    working opt-out link, required by CAN-SPAM

Usage:
  export OUTREACH_API_KEY=...
  export OUTREACH_POSTAL_ADDRESS="SEVEN SEVENTY, 44 rue des Forges, 13010 Marseille, France"
  export OUTREACH_UNSUBSCRIBE_URL="https://www.getintheanswer.com/unsubscribe"
  python3 scripts/outreach_generator.py --csv prospects.csv --limit 50
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import pathlib
import sys
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_API = "https://www.getintheanswer.com"

# A business the engines already recommend is not a prospect: the mail would
# have no hook and the claim would be false. Scans at or above this score are
# recorded and skipped.
DEFAULT_SKIP_ABOVE = 60


class ConfigError(RuntimeError):
    pass


def require_env() -> dict[str, str]:
    missing = []
    values = {}
    for name in ("OUTREACH_API_KEY", "OUTREACH_POSTAL_ADDRESS", "OUTREACH_UNSUBSCRIBE_URL"):
        value = os.getenv(name, "").strip()
        if not value:
            missing.append(name)
        values[name] = value
    if missing:
        raise ConfigError(
            "Missing required environment variables: "
            + ", ".join(missing)
            + "\n\nThe postal address and unsubscribe link are mandatory under CAN-SPAM "
            "for commercial mail to US recipients. This script will not produce a queue "
            "without them."
        )
    return values


def load_prospects(csv_path: pathlib.Path) -> list[dict[str, str]]:
    if not csv_path.exists():
        raise ConfigError(f"Prospect file not found: {csv_path}")
    prospects = []
    with csv_path.open(encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            company = (row.get("companyName") or "").strip()
            website = (row.get("websiteUrl") or "").strip()
            email = (row.get("email") or "").strip()
            if not (company and website and email):
                continue
            prospects.append(
                {
                    "companyName": company,
                    "websiteUrl": website,
                    "email": email,
                    "city": (row.get("city") or "").strip(),
                    "industry": (row.get("industry") or "").strip(),
                    "ownerName": (row.get("ownerName") or "").strip(),
                }
            )
    return prospects


def load_state(path: pathlib.Path) -> dict[str, dict]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        print(f"[!] Unreadable state file {path}, starting fresh")
        return {}


def save_state(path: pathlib.Path, state: dict[str, dict]) -> None:
    path.write_text(json.dumps(state, indent=2, sort_keys=True), encoding="utf-8")


def scan(prospect: dict[str, str], api_base: str, api_key: str, timeout: int) -> dict:
    """Run one scan with e-mail delivery suppressed. Returns the API payload."""
    body = {
        "companyName": prospect["companyName"],
        "websiteUrl": prospect["websiteUrl"],
        "email": prospect["email"],
        "city": prospect["city"] or "United States",
        "industry": prospect["industry"] or "Local Business",
        "notify": False,
    }
    request = urllib.request.Request(
        f"{api_base.rstrip('/')}/api/onboarding",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "X-Outreach-Key": api_key,
            "User-Agent": "GetInTheAnswer-Outreach/2.0",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def compose(prospect: dict[str, str], summary: dict, report_url: str, env: dict[str, str]) -> tuple[str, str]:
    """Write the mail from what the scan actually found.

    Every factual claim below is read off the scan. Nothing is asserted about
    the prospect's visibility before it has been measured.
    """
    company = prospect["companyName"]
    city = prospect["city"] or "your area"
    trade = (prospect["industry"] or "local business").lower()
    greeting = prospect["ownerName"] or "there"

    mentions = summary.get("brand_mentions", 0)
    total = summary.get("total_queries", 0)
    competitor = (summary.get("top_competitor") or "").strip()
    engines = ", ".join(summary.get("engines_used") or []) or "ChatGPT, Claude and Perplexity"
    sample_query = summary.get("sample_query")

    if mentions == 0:
        subject = f"{competitor or 'Your competitors'} came up for {trade} in {city} — {company} didn't"
        finding = (
            f"I ran {total} of the questions your customers actually ask across {engines}. "
            f"{company} was not named in any of them."
        )
    else:
        subject = f"{company} shows up in {mentions} of {total} AI answers for {city}"
        finding = (
            f"I ran {total} of the questions your customers actually ask across {engines}. "
            f"{company} came up in {mentions} of them."
        )

    if competitor:
        finding += f" {competitor} came up most often."

    query_line = f'\nOne of the questions I used: "{sample_query}"\n' if sample_query else ""

    body = f"""Hi {greeting},

{finding}
{query_line}
The full breakdown is here, no signup needed:
{report_url}

It lists every question tested, which businesses each engine named, and what
on your site is making them pick someone else.

If this is useful I can walk you through the fixes. If not, no hard feelings.

Gregory Baranes
GetInTheAnswer
www.getintheanswer.com

{env['OUTREACH_POSTAL_ADDRESS']}
Unsubscribe: {env['OUTREACH_UNSUBSCRIBE_URL']}
"""
    return subject, body


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--csv", default=str(ROOT / "prospects.csv"), help="prospect CSV")
    parser.add_argument("--out", default=str(ROOT / "outreach_queue.csv"), help="queue written for your sending tool")
    parser.add_argument("--state", default=str(ROOT / "outreach_state.json"), help="resume file")
    parser.add_argument("--api", default=os.getenv("OUTREACH_API_BASE", DEFAULT_API))
    parser.add_argument("--limit", type=int, default=0, help="stop after N new scans (0 = all)")
    parser.add_argument("--delay", type=float, default=2.0, help="seconds between scans")
    parser.add_argument("--timeout", type=int, default=180, help="per-scan timeout")
    parser.add_argument(
        "--skip-above",
        type=int,
        default=DEFAULT_SKIP_ABOVE,
        help="do not queue businesses already scoring at or above this",
    )
    args = parser.parse_args()

    try:
        env = require_env()
        prospects = load_prospects(pathlib.Path(args.csv))
    except ConfigError as exc:
        print(f"\n[x] {exc}\n", file=sys.stderr)
        return 1

    if not prospects:
        print("[x] No usable rows. Required columns: companyName, websiteUrl, email", file=sys.stderr)
        return 1

    state_path = pathlib.Path(args.state)
    state = load_state(state_path)

    print(f"[+] {len(prospects)} prospects loaded, {len(state)} already scanned")
    print(f"[+] API: {args.api}")
    print("[+] Scans run with notify=false — no e-mail leaves the transactional domain\n")

    scanned = 0
    for prospect in prospects:
        key = prospect["websiteUrl"].lower()
        if key in state:
            continue
        if args.limit and scanned >= args.limit:
            print(f"\n[i] Reached --limit {args.limit}")
            break

        label = f"{prospect['companyName']} ({prospect['city'] or 'n/a'})"
        print(f"[*] Scanning {label}...")
        try:
            result = scan(prospect, args.api, env["OUTREACH_API_KEY"], args.timeout)
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", "replace")[:200]
            print(f"    [!] HTTP {exc.code}: {detail}")
            if exc.code in (401, 403):
                print("    [x] OUTREACH_API_KEY rejected. Set the same value on the API service.")
                return 1
            continue
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            print(f"    [!] {exc}")
            continue

        summary = result.get("summary")
        if not summary:
            print("    [x] No summary returned — the API did not accept the key as internal.")
            print("    [x] Stopping: without it the copy would be guesswork.")
            return 1

        site_id = result["site_id"]
        report_url = f"{args.api.rstrip('/')}/dashboard?site_id={site_id}"
        score = summary.get("visibility_score", 0)

        record = {
            "company": prospect["companyName"],
            "email": prospect["email"],
            "city": prospect["city"],
            "industry": prospect["industry"],
            "owner": prospect["ownerName"],
            "website": prospect["websiteUrl"],
            "site_id": site_id,
            "report_url": report_url,
            "score": score,
            "brand_mentions": summary.get("brand_mentions", 0),
            "total_queries": summary.get("total_queries", 0),
            "top_competitor": summary.get("top_competitor", ""),
            "mode": result.get("mode", ""),
            "scanned_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }

        if result.get("mode") == "simulation":
            record["queued"] = False
            record["skip_reason"] = "simulation mode — engines unavailable, results not real"
            print("    [!] Simulation mode, not queued (engines returned nothing)")
        elif score >= args.skip_above:
            record["queued"] = False
            record["skip_reason"] = f"already visible (score {score})"
            print(f"    [-] Score {score} — already visible, not queued")
        else:
            subject, body = compose(prospect, summary, report_url, env)
            record["queued"] = True
            record["subject"] = subject
            record["body"] = body
            print(f"    [+] Score {score} — queued")

        state[key] = record
        save_state(state_path, state)
        scanned += 1
        time.sleep(args.delay)

    queued = [row for row in state.values() if row.get("queued")]
    out_path = pathlib.Path(args.out)
    with out_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "email", "first_name", "company", "city", "industry",
                "score", "top_competitor", "report_url", "subject", "body",
            ],
        )
        writer.writeheader()
        for row in queued:
            writer.writerow(
                {
                    "email": row["email"],
                    "first_name": row.get("owner", ""),
                    "company": row["company"],
                    "city": row["city"],
                    "industry": row["industry"],
                    "score": row["score"],
                    "top_competitor": row["top_competitor"],
                    "report_url": row["report_url"],
                    "subject": row.get("subject", ""),
                    "body": row.get("body", ""),
                }
            )

    skipped = len(state) - len(queued)
    print(f"\n[=] {len(queued)} queued, {skipped} scanned but skipped")
    print(f"[=] Queue: {out_path}")
    print("\nNext: import that CSV into your sending tool on a SEPARATE warmed domain.")
    print("Do not send from getintheanswer.com — it carries your customers' report links.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
