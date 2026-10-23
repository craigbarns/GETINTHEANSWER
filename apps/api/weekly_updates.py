"""Compare real answers to the same questions on the same engines."""
import re
from collections import Counter


def _key(text: str) -> str:
    return " ".join(text.casefold().split())


def build_weekly_changes(previous: dict, current: dict) -> list[dict]:
    if previous.get("mode") != "live" or current.get("mode") != "live":
        return []
    old = {(_key(q["engine"]), _key(q["query"])): q for q in previous.get("queries", [])}
    new = {(_key(q["engine"]), _key(q["query"])): q for q in current.get("queries", [])}
    common = old.keys() & new.keys()
    changes = []
    for engine in sorted({key[0] for key in common}):
        keys = sorted(key for key in common if key[0] == engine)
        before = [old[key] for key in keys]
        after = [new[key] for key in keys]
        old_mentions = sum(bool(q["brand_mentioned"]) for q in before)
        new_mentions = sum(bool(q["brand_mentioned"]) for q in after)
        base = {"engine": after[0]["engine"], "before": old_mentions, "after": new_mentions, "questions": len(keys)}
        if not old_mentions and new_mentions:
            changes.append({**base, "kind": "new_mention"})
        elif old_mentions and not new_mentions:
            changes.append({**base, "kind": "lost_mention"})

        def competitors(rows):
            counts, names = Counter(), {}
            for row in rows:
                unique = {}
                for name in row.get("competitors_detected", []):
                    key = re.sub(r"[\W_]+", "", name.casefold())
                    if key:
                        unique[key] = name
                counts.update(unique.keys())
                names.update(unique)
            return counts, names

        old_counts, _ = competitors(before)
        new_counts, names = competitors(after)
        for name, count in new_counts.most_common():
            if old_counts[name] > 0 and old_counts[name] <= old_mentions and count > new_mentions:
                changes.append({**base, "kind": "competitor_overtook", "competitor": names[name], "competitor_mentions": count})
                break
    return changes
