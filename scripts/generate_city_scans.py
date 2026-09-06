#!/usr/bin/env python3
"""Give every /ai-seo-for/<industry>/<city> page something real to say.

Those pages were one industry template with the city name substituted in, so
plumbers/austin and plumbers/phoenix were the same document. Google indexed
them and ranked them around position 79 — indexed, valued at nothing.

This asks the engines one genuine local question per industry x city, records
which businesses they name, and writes the result to
apps/web/src/data/city-scans/<industry>__<city>.json. The page then reports a
measured fact no competitor can copy, and demonstrates the product while doing
it.

Everything goes through OpenRouter, and every engine model carries the
":online" suffix. That suffix is the whole point: asked without retrieval,
gpt-4o-mini answers "I don't have real-time data" and names nobody, which is
what produced ten city files with zero ChatGPT results. Perplexity retrieves
natively and needs no suffix.

Cost: one question per pair per engine, plus one cheap extraction call each.

Usage:
  export OPENROUTER_API_KEY=...
  python3 scripts/generate_city_scans.py
  python3 scripts/generate_city_scans.py --industry plumbers --force
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

OPENROUTER_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1") + "/chat/completions"

# Kept in step with the engine list in apps/api/main.py.
ENGINES = [
    ("ChatGPT", os.getenv("OR_CHATGPT_MODEL", "openai/gpt-4o-mini:online")),
    ("Claude", os.getenv("OR_CLAUDE_MODEL", "anthropic/claude-haiku-4.5:online")),
    ("Gemini", os.getenv("OR_GEMINI_MODEL", "google/gemini-2.5-flash:online")),
    ("Perplexity", os.getenv("OR_PERPLEXITY_MODEL", "perplexity/sonar")),
]
UTILITY_MODEL = os.getenv("OR_UTILITY_MODEL", "openai/gpt-4o-mini")

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

NETWORK_ERRORS = (
    urllib.error.URLError,
    urllib.error.HTTPError,
    KeyError,
    IndexError,
    TypeError,
    TimeoutError,
    RuntimeError,
    json.JSONDecodeError,
)


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


def chat(key: str, model: str, messages: list[dict], timeout: int = 150, attempts: int = 4, **extra) -> str:
    """One OpenRouter chat call, with backoff on rate limits and overload."""
    payload = {"model": model, "messages": messages, **extra}
    last_error: Exception | None = None

    for attempt in range(attempts):
        request = urllib.request.Request(
            OPENROUTER_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {key}",
                # OpenRouter attributes traffic with these.
                "HTTP-Referer": "https://www.getintheanswer.com",
                "X-Title": "GetInTheAnswer city scans",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                data = json.loads(response.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"] or ""
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", "replace")[:300]
            last_error = RuntimeError(f"HTTP {exc.code}: {body}")
            if exc.code != 429 and exc.code < 500:
                raise last_error from exc
        except (urllib.error.URLError, TimeoutError) as exc:
            last_error = exc

        if attempt < attempts - 1:
            time.sleep(2**attempt * 3)

    raise last_error if last_error else RuntimeError("request failed")


def ask_engine(key: str, model: str, query: str) -> str | None:
    try:
        return chat(key, model, [{"role": "user", "content": query}], temperature=0.2, max_tokens=800) or None
    except NETWORK_ERRORS as exc:
        print(f"    [!] {model}: {exc}")
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
        raw = chat(
            key,
            UTILITY_MODEL,
            [{"role": "system", "content": system}, {"role": "user", "content": answer[:6000]}],
            response_format={"type": "json_object"},
            temperature=0,
        )
        names = (json.loads(raw) or {}).get("businesses") or []
    except NETWORK_ERRORS as exc:
        print(f"    [!] extraction: {exc}")
        return []

    seen, out = set(), []
    for name in names:
        if not isinstance(name, str):
            continue
        name = name.strip(" .,•-*")
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


def scan_pair(industry: dict, city: dict, key: str) -> dict:
    label = f"{city['name']}, {city['stateCode']}"
    query = industry["query"].replace("{city}", label)
    print(f"[*] {industry['slug']} / {city['slug']}")

    engines = []
    for engine_name, model in ENGINES:
        answer = ask_engine(key, model, query)
        if answer:
            engines.append({"engine": engine_name, "businesses": extract_businesses(key, answer)})

    tally: dict[str, dict] = {}
    for entry in engines:
        for name in entry["businesses"]:
            row = tally.setdefault(normalize(name), {"name": name, "engines": []})
            if entry["engine"] not in row["engines"]:
                row["engines"].append(entry["engine"])

    ranked = sorted(tally.values(), key=lambda row: (-len(row["engines"]), row["name"]))
    named = sum(len(entry["businesses"]) for entry in engines)
    silent = [e["engine"] for e in engines if not e["businesses"]]
    print(
        f"    -> {len(engines)}/{len(ENGINES)} engines answered, "
        f"{len(ranked)} distinct businesses" + (f", silent: {', '.join(silent)}" if silent else "")
    )

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
    parser.add_argument("--workers", type=int, default=3, help="parallel pairs")
    args = parser.parse_args()

    key = os.getenv("OPENROUTER_API_KEY", "").strip()
    if not key:
        print("[x] OPENROUTER_API_KEY is required.", file=sys.stderr)
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

    print(f"[+] {len(pairs)} pairs across {', '.join(name for name, _ in ENGINES)} via OpenRouter\n")

    written = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(scan_pair, i, c, key): t for i, c, t in pairs}
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
