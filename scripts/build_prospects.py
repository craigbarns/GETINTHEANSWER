#!/usr/bin/env python3
"""Turn the city scans into a prospect list.

Every business here was named by a real engine answer in a real city, and the
gap stated for it was measured, not guessed. A business named by three engines
and missed by the fourth is the strongest prospect on this list: it is clearly
real, someone there already works on its visibility, and it has one specific
hole worth paying to close.

Output is a CSV with the finding already written. Two columns are left empty on
purpose — websiteUrl and email — because those have to come from somewhere
legitimate, and scripts/outreach_generator.py needs both to run a scan and
address a mail.

The file is gitignored: it is third-party business data and this repo is public.

Usage:
  python3 scripts/build_prospects.py
  python3 scripts/build_prospects.py --industry plumbers --min-engines 3
"""

from __future__ import annotations

import argparse
import csv
import glob
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCANS_DIR = ROOT / "apps" / "web" / "src" / "data" / "city-scans"


def natural_join(items: list[str]) -> str:
    if not items:
        return ""
    if len(items) == 1:
        return items[0]
    return f"{', '.join(items[:-1])} and {items[-1]}"


def build_hook(named_by: list[str], missing: list[str], city: str) -> str:
    """The one sentence the outreach opens with. Every claim is measured."""
    return (
        f"{natural_join(named_by)} named you when we asked for the best option in {city}. "
        f"{natural_join(missing)} did not mention you at all."
    )


def collect(min_engines: int, industry_filter: str | None) -> list[dict]:
    rows = []
    for path in sorted(glob.glob(str(SCANS_DIR / "*.json"))):
        scan = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
        if industry_filter and scan["industry"] != industry_filter:
            continue

        answering = [entry["engine"] for entry in scan["engines"]]
        for business in scan["businesses"]:
            named_by = business["engines"]
            missing = [engine for engine in answering if engine not in named_by]
            if not missing or len(named_by) < min_engines:
                continue
            rows.append(
                {
                    "companyName": business["name"],
                    "websiteUrl": "",
                    "email": "",
                    "city": scan["cityLabel"],
                    "industry": scan["industry"],
                    "ownerName": "",
                    "namedBy": ", ".join(named_by),
                    "missingFrom": ", ".join(missing),
                    "coverage": f"{len(named_by)}/{len(answering)}",
                    "questionAsked": scan["query"],
                    "hook": build_hook(named_by, missing, scan["cityLabel"]),
                    "scannedAt": scan["scannedAt"],
                }
            )

    # Strongest first: the more engines already name a business, the more real it
    # is and the more the remaining gap stings.
    rows.sort(key=lambda row: (-int(row["coverage"].split("/")[0]), row["city"], row["companyName"]))
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", default=str(ROOT / "prospects_from_scans.csv"))
    parser.add_argument("--industry", help="only this industry slug")
    parser.add_argument(
        "--min-engines",
        type=int,
        default=2,
        help="drop businesses named by fewer engines than this (1 is often noise)",
    )
    args = parser.parse_args()

    if not SCANS_DIR.exists():
        print(f"[x] No scans at {SCANS_DIR}. Run scripts/generate_city_scans.py first.", file=sys.stderr)
        return 1

    rows = collect(args.min_engines, args.industry)
    if not rows:
        print("[x] No businesses matched. Try --min-engines 1.", file=sys.stderr)
        return 1

    out = pathlib.Path(args.out)
    with out.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    by_coverage: dict[str, int] = {}
    for row in rows:
        by_coverage[row["coverage"]] = by_coverage.get(row["coverage"], 0) + 1

    print(f"[=] {len(rows)} prospects -> {out.name}")
    for coverage in sorted(by_coverage, reverse=True):
        print(f"      {coverage} engines: {by_coverage[coverage]}")
    print("\nFill in websiteUrl and email, then:")
    print("  python3 scripts/outreach_generator.py --csv prospects_from_scans.csv --limit 20")
    return 0


if __name__ == "__main__":
    sys.exit(main())
