#!/usr/bin/env python3
"""Give every /ai-seo-for/<industry>/<city> page something real to say.

Today those 100 pages are one industry template with the city name substituted
in, so plumbers/austin and plumbers/phoenix are the same document. Google
indexes them and ranks them around position 79 — indexed, valued at nothing.

This asks the engines one genuine local question per industry x city, records
which businesses they name, and writes the result to
apps/web/src/data/city-scans/<industry>__<city>.json. The page then reports a
measured fact no competitor can copy, and demonstrates the product while doing
it.

Cost: one question per pair, per engine (~3 calls x 100 pairs), plus one cheap
extraction call each. Cents, not dollars.

Usage:
  export OPENAI_API_KEY=...          # required (asks + extracts)
  export ANTHROPIC_API_KEY=...       # optional
  export PERPLEXITY_API_KEY=...      # optional
  python3 scripts/generate_city_scans.py
  python3 scripts/generate_city_scans.py --industry plumbers --limit 10
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import os
import pathlib
import re
import sys
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "apps" / "web" / "src" / "data" / "city-scans"
INDUSTRIES_TS = ROOT / "apps" / "web" / "src" / "lib" / "industries.ts"
CITIES_TS = ROOT / "apps" / "web" / "src" / "lib" / "cities.ts"

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5")
PERPLEXITY_MODEL = os.getenv("PERPLEXITY_MODEL", "sonar")

# Kept deliberately small and in sync by hand with AGGREGATOR_TOKENS in
# apps/api/main.py, which stays the source of truth for the product itself.
AGGREGATORS = {
    "yelp", "google", "googlemaps", "tripadvisor", "trustpilot", "yellowpages",
    "angi", "angieslist", "thumbtack", "houzz", "homeadvisor", "porch", "nextdoor",
    "zillow", "redfin", "trulia", "realtor", "apartments", "loopnet", "opentable",
    "facebook", "instagram", "linkedin", "amazon", "bbb", "bark", "taskrabbit",
    "zocdoc", "healthgrades", "reddit", "yellowpagescom", "expedia", "booking",
}
AGGREGATOR_HINTS = ("directory", "listing", "marketplace", "aggregator", "platform", "review site")


def normalize(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


def is_aggregator(name: str) -> bool:
    flat = normalize(name)
    if not flat or len(flat) < 3:
        return True
    for suffix in ("com", "net", "org", "co", "io"):
        if flat.endswith(suffix) and flat[: -len(suffix)] in AGGREGATORS:
            return True
    if flat in AGGREGATORS:
        return True
    lowered = name.lower()
    return any(hint in lowered for hint in AGGREGATOR_HINTS)


def post_json(url: str, payload: dict, headers: dict, timeout: int = 90, attempts: int = 4) -> dict:
    """POST with backoff on rate limits, and the provider's own error text on failure."""
    last_error: Exception | None = None
    for attempt in range(attempts):
        request = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", **headers},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", "replace")[:300]
            last_error = RuntimeError(f"HTTP {exc.code}: {body}")
            # 429 and 5xx are worth waiting out; 4xx of our own making are not.
            if exc.code != 429 and exc.code < 500:
                raise last_error from exc
        except (urllib.error.URLError, TimeoutError) as exc:
            last_error = exc

        if attempt < attempts - 1:
            time.sleep(2 ** attempt * 3)

    raise last_error if last_error else RuntimeError("request failed")


def ask_openai_compatible(base: str, key: str, model: str, query: str) -> str | None:
    try:
        data = post_json(
            f"{base}/chat/completions",
            {"model": model, "messages": [{"role": "user", "content": query}], "temperature": 0.2},
            {"Authorization": f"Bearer {key}"},
        )
        return data["choices"][0]["message"]["content"]
    except (urllib.error.URLError, urllib.error.HTTPError, KeyError, IndexError, TimeoutError, RuntimeError, json.JSONDecodeError) as exc:
        print(f"    [!] {model}: {exc}")
        return None


def ask_anthropic(key: str, query: str) -> str | None:
    try:
        data = post_json(
            "https://api.anthropic.com/v1/messages",
            {"model": ANTHROPIC_MODEL, "max_tokens": 800, "messages": [{"role": "user", "content": query}]},
            {"x-api-key": key, "anthropic-version": "2023-06-01"},
        )
        return data["content"][0]["text"]
    except (urllib.error.URLError, urllib.error.HTTPError, KeyError, IndexError, TimeoutError, RuntimeError, json.JSONDecodeError) as exc:
        print(f"    [!] {ANTHROPIC_MODEL}: {exc}")
        return None


def extract_businesses(key: str, answer: str) -> list[str]:
    """Pull the named businesses out of one engine answer."""
    system = (
        "Extract the specific local business names explicitly recommended in the text. "
        "Only businesses a consumer could actually hire or visit. Exclude review sites, "
        "directories, listing portals and marketplaces (Yelp, Google, Angi, Thumbtack, "
        "Zillow, TripAdvisor...). Exclude generic advice. "
        'Respond with JSON only: {"businesses": ["Name One", "Name Two"]}'
    )
    try:
        data = post_json(
            "https://api.openai.com/v1/chat/completions",
            {
                "model": OPENAI_MODEL,
                "messages": [{"role": "system", "content": system}, {"role": "user", "content": answer[:6000]}],
                "response_format": {"type": "json_object"},
                "temperature": 0,
            },
            {"Authorization": f"Bearer {key}"},
        )
        parsed = json.loads(data["choices"][0]["message"]["content"])
        names = parsed.get("businesses") or []
    except (urllib.error.URLError, urllib.error.HTTPError, KeyError, IndexError, TimeoutError, RuntimeError, json.JSONDecodeError) as exc:
        print(f"    [!] extraction: {exc}")
        return []

    seen, out = set(), []
    for name in names:
        if not isinstance(name, str):
            continue
        name = name.strip(" .,•-")
        flat = normalize(name)
        if not name or flat in seen or is_aggregator(name):
            continue
        seen.add(flat)
        out.append(name)
    return out[:8]


def parse_industries() -> list[dict]:
    """Read slug + first sampleQuery straight out of industries.ts."""
    source = INDUSTRIES_TS.read_text(encoding="utf-8")
    industries = []
    # Entries sit at two-space indentation inside the exported array.
    for block in re.split(r"\n  \{\n", source)[1:]:
        slug = re.search(r'slug:\s*"([^"]+)"', block)
        singular = re.search(r'singularName:\s*"([^"]+)"', block)
        queries = re.search(r"sampleQueries:\s*\[(.*?)\]", block, re.S)
        if not (slug and queries):
            continue
        first = re.search(r'"([^"]+)"', queries.group(1))
        if not first:
            continue
        industries.append(
            {
                "slug": slug.group(1),
                "singular": singular.group(1) if singular else slug.group(1),
                "query": first.group(1),
            }
        )
    return industries


def parse_cities() -> list[dict]:
    source = CITIES_TS.read_text(encoding="utf-8")
    cities = []
    for match in re.finditer(
        r'\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*state:\s*"([^"]+)",\s*stateCode:\s*"([^"]+)"', source
    ):
        cities.append({"slug": match.group(1), "name": match.group(2), "stateCode": match.group(4)})
    return cities


def scan_pair(industry: dict, city: dict, keys: dict) -> dict:
    label = f"{city['name']}, {city['stateCode']}"
    query = industry["query"].replace("{city}", label)
    print(f"[*] {industry['slug']} / {city['slug']}")

    engines = []

    answer = ask_openai_compatible("https://api.openai.com/v1", keys["openai"], OPENAI_MODEL, query)
    if answer:
        engines.append({"engine": "ChatGPT", "businesses": extract_businesses(keys["openai"], answer)})

    if keys.get("anthropic"):
        answer = ask_anthropic(keys["anthropic"], query)
        if answer:
            engines.append({"engine": "Claude", "businesses": extract_businesses(keys["openai"], answer)})

    if keys.get("perplexity"):
        answer = ask_openai_compatible(
            "https://api.perplexity.ai", keys["perplexity"], PERPLEXITY_MODEL, query
        )
        if answer:
            engines.append({"engine": "Perplexity", "businesses": extract_businesses(keys["openai"], answer)})

    tally: dict[str, dict] = {}
    for entry in engines:
        for name in entry["businesses"]:
            row = tally.setdefault(normalize(name), {"name": name, "engines": []})
            if entry["engine"] not in row["engines"]:
                row["engines"].append(entry["engine"])

    ranked = sorted(tally.values(), key=lambda row: (-len(row["engines"]), row["name"]))
    named = sum(len(entry["businesses"]) for entry in engines)
    print(f"    -> {len(engines)} engines, {len(ranked)} distinct businesses named")

    return {
        "industry": industry["slug"],
        "city": city["slug"],
        "cityLabel": label,
        "query": query,
        "scannedAt": time.strftime("%Y-%m-%d", time.gmtime()),
        "engines": engines,
        "businesses": ranked,
        "totalNamed": named,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--industry", help="only this industry slug")
    parser.add_argument("--city", help="only this city slug")
    parser.add_argument("--limit", type=int, default=0, help="stop after N pairs")
    parser.add_argument("--force", action="store_true", help="rescan pairs that already have a file")
    parser.add_argument("--workers", type=int, default=4, help="parallel pairs")
    args = parser.parse_args()

    keys = {
        "openai": os.getenv("OPENAI_API_KEY", "").strip(),
        "anthropic": os.getenv("ANTHROPIC_API_KEY", "").strip(),
        "perplexity": os.getenv("PERPLEXITY_API_KEY", "").strip(),
    }
    if not keys["openai"]:
        print("[x] OPENAI_API_KEY is required — it asks one engine and does every extraction.", file=sys.stderr)
        return 1

    industries = parse_industries()
    cities = parse_cities()
    if not industries or not cities:
        print("[x] Could not parse industries.ts / cities.ts", file=sys.stderr)
        return 1

    if args.industry:
        industries = [i for i in industries if i["slug"] == args.industry]
    if args.city:
        cities = [c for c in cities if c["slug"] == args.city]

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    pairs = []
    for industry in industries:
        for city in cities:
            target = OUT_DIR / f"{industry['slug']}__{city['slug']}.json"
            if target.exists() and not args.force:
                continue
            pairs.append((industry, city, target))
    if args.limit:
        pairs = pairs[: args.limit]

    if not pairs:
        print("[=] Nothing to do (use --force to rescan).")
        return 0

    engines_on = ["ChatGPT"] + (["Claude"] if keys["anthropic"] else []) + (["Perplexity"] if keys["perplexity"] else [])
    print(f"[+] {len(pairs)} pairs to scan across {', '.join(engines_on)}\n")

    written = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(scan_pair, i, c, keys): t for i, c, t in pairs}
        for future in concurrent.futures.as_completed(futures):
            target = futures[future]
            try:
                result = future.result()
            except Exception as exc:  # one bad pair must not sink the batch
                print(f"    [!] {target.name}: {exc}")
                continue
            if not result["businesses"]:
                print(f"    [-] {target.name}: no business named, file not written")
                continue
            target.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
            written += 1

    print(f"\n[=] {written} files written to {OUT_DIR.relative_to(ROOT)}")
    print("[=] Rebuild the site to publish them.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
