"""Tests for the on-site AEO audit engine (aeo_audit)."""

import asyncio
import re
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import aeo_audit  # noqa: E402

HOME = """
<html><head><title>Best Auto Repair in Austin — Honest Fix</title>
<meta name="description" content="Independent auto repair shop in Austin, TX. Honest diagnostics, fair prices.">
<link rel="canonical" href="https://honestfix.example/">
<meta property="og:title" content="Honest Fix">
<meta property="og:description" content="Auto repair in Austin.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script type="application/ld+json">{"@type": "AutoRepair"}</script>
<link type="application/rss+xml" href="/feed.xml">
</head><body>
<h1>Honest Fix Auto Repair</h1>
<h2>What services do we offer?</h2>
<p>Brake repair from $89, oil change in 30 minutes, 12 years serving Austin with 4,000 clients.</p>
<h2>Why choose an independent shop?</h2>
<p>According to a 2025 study, independents save 30 percent.</p>
<ul><li>Brakes</li><li>Oil</li></ul>
<a href="/services">Services</a><a href="/faq">FAQ</a><a href="/about">About</a>
<a href="/pricing">Pricing</a><a href="/blog">Blog</a>
<time datetime="2026-10-01">Oct 2026</time>
<p>Honest Fix is an independent auto repair shop serving Austin drivers since 2014. Our team of six certified mechanics handles brakes, oil changes, batteries, transmission service and full diagnostics from our workshop on South Congress. Every repair is quoted in writing before work starts.</p>
</body></html>
"""

SUB = HOME.replace("Honest Fix Auto Repair</h1>", "Services</h1>") + (
    "<p>Full service list: brake repair from $89, oil change in 30 minutes, tire rotation, "
    "battery replacement, pre-purchase inspection, transmission service, AC recharge. "
    "We serve Austin, Round Rock and Cedar Park with a team of 6 certified mechanics. "
    "Our workshop covers 4,000 square feet with 8 service bays.</p>"
)


def make_pages(n):
    pages = [{"url": "https://honestfix.example/", "html": HOME, "robots_txt": "User-agent: *\nAllow: /", "llms_txt": "# llms"}]
    for i in range(n - 1):
        pages.append({"url": f"https://honestfix.example/p{i}", "html": SUB, "robots_txt": "", "llms_txt": ""})
    return pages


class AeoAuditTests(unittest.TestCase):
    def test_foundational_scores_perfect_site(self):
        checks = aeo_audit._foundational_checks(make_pages(3), "https://honestfix.example/")
        failed = [(c.key, c.failed_pages) for c in checks if not c.passed]
        self.assertEqual(failed, [], f"unexpected failures: {failed}")
        self.assertEqual(len(checks), 16)

    def test_missing_signals_fail(self):
        pages = make_pages(2)
        pages[1]["html"] = SUB.replace('<script type="application/ld+json">{"@type": "AutoRepair"}</script>', "")
        checks = aeo_audit._foundational_checks(pages, "https://honestfix.example/")
        structured = next(c for c in checks if c.key == "structured_data")
        self.assertFalse(structured.passed)
        self.assertEqual(structured.failed_pages, 1)

    def test_intelligence_prior_bounds(self):
        dims = aeo_audit._intelligence_prior(make_pages(1)[0])
        self.assertEqual(len(dims), 6)
        for d in dims:
            self.assertGreaterEqual(d.score, 0.0)
            self.assertLessEqual(d.score, 5.0)

    def test_grade_mapping(self):
        self.assertEqual(aeo_audit._grade(92), "A")
        self.assertEqual(aeo_audit._grade(85), "B")
        self.assertEqual(aeo_audit._grade(73), "C")
        self.assertEqual(aeo_audit._grade(61), "D")
        self.assertEqual(aeo_audit._grade(40), "F")

    def test_fixes_prioritized(self):
        pages = make_pages(1)
        pages[0]["html"] = re.sub(r'<link[^>]+rss\+xml[^>]*>', '', pages[0]["html"])
        checks = aeo_audit._foundational_checks(pages, "https://honestfix.example/")
        dims = aeo_audit._intelligence_prior(pages[0])
        fixes = aeo_audit._fixes(checks, dims)
        titles = [f.title for f in fixes]
        self.assertTrue(any("RSS" in t for t in titles), f"RSS fix missing: {titles}")

    def test_end_to_end_mocked(self):
        async def fake_fetch(url):
            return HOME

        async def fake_text(client, url):
            return "User-agent: *\nAllow: /"

        async def fake_validate(url):
            return None

        with patch.object(aeo_audit, "fetch_via_http", fake_fetch), \
             patch.object(aeo_audit, "_fetch_text_resource", fake_text), \
             patch("site_audit.validate_public_http_url", fake_validate):
            report = asyncio.run(aeo_audit.aeo_audit("https://honestfix.example/"))
        self.assertTrue(report.fetched)
        self.assertGreater(report.final_score, 0)
        self.assertIn(report.grade, list("ABCDF"))

    def test_unsafe_url_rejected(self):
        with self.assertRaises(aeo_audit.UnsafeWebsiteUrl):
            asyncio.run(aeo_audit.aeo_audit("http://localhost:8080/"))

    def test_ai_crawlers_blocked_parsing(self):
        # Groupe dedie GPTBot avec blocage complet -> bloque
        self.assertTrue(aeo_audit._ai_crawlers_blocked("User-agent: GPTBot\nDisallow: /"))
        # Wildcard blocage complet -> bloque (s applique aux IA aussi)
        self.assertTrue(aeo_audit._ai_crawlers_blocked("User-agent: *\nDisallow: /"))
        # Blocage partiel -> autorise
        self.assertFalse(aeo_audit._ai_crawlers_blocked("User-agent: GPTBot\nDisallow: /admin/"))
        # Disallow vide = autorise
        self.assertFalse(aeo_audit._ai_crawlers_blocked("User-agent: *\nDisallow:"))
        # Groupe sans rapport -> autorise
        self.assertFalse(aeo_audit._ai_crawlers_blocked("User-agent: evilbot\nDisallow: /"))
        # Commentaires ignores
        self.assertFalse(aeo_audit._ai_crawlers_blocked("# Disallow: /\nUser-agent: GPTBot\nAllow: /"))


if __name__ == "__main__":
    unittest.main()
