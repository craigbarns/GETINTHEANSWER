import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import main


class DailyScanBudgetTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        main.DAILY_SCAN_TIMES.clear()

    def tearDown(self):
        main.DAILY_SCAN_TIMES.clear()

    async def test_allows_scans_below_the_ceiling(self):
        with patch.object(main, "DAILY_SCAN_LIMIT", 2):
            main.DAILY_SCAN_TIMES.append(main.time.monotonic())
            await main.enforce_daily_scan_budget()

    async def test_refuses_once_the_daily_ceiling_is_reached(self):
        with patch.object(main, "DAILY_SCAN_LIMIT", 2):
            main.DAILY_SCAN_TIMES.extend([main.time.monotonic(), main.time.monotonic()])
            with self.assertRaises(HTTPException) as raised:
                await main.enforce_daily_scan_budget()

        self.assertEqual(raised.exception.status_code, 503)
        self.assertIn("Retry-After", raised.exception.headers)

    async def test_ceiling_forgets_scans_older_than_a_day(self):
        with patch.object(main, "DAILY_SCAN_LIMIT", 2):
            stale = main.time.monotonic() - 25 * 60 * 60
            main.DAILY_SCAN_TIMES.extend([stale, stale])
            await main.enforce_daily_scan_budget()

        self.assertEqual(len(main.DAILY_SCAN_TIMES), 0)


class ProviderEndpointTests(unittest.TestCase):
    def test_reports_the_default_host_when_no_base_url_is_configured(self):
        self.assertEqual(
            main.provider_endpoint("", "https://api.openai.com/v1"), "api.openai.com"
        )

    def test_reveals_a_redirected_base_url(self):
        self.assertEqual(
            main.provider_endpoint("https://openrouter.ai/api/v1", "https://api.openai.com/v1"),
            "openrouter.ai",
        )


if __name__ == "__main__":
    unittest.main()


class ProviderHeaderTests(unittest.TestCase):
    def test_labels_scans_so_a_reseller_can_attribute_them(self):
        headers = main.provider_headers("scan")
        self.assertEqual(headers["X-Title"], "GetInTheAnswer scan")
        self.assertTrue(headers["HTTP-Referer"])

    def test_weekly_rescans_carry_their_own_label(self):
        self.assertEqual(
            main.provider_headers("weekly rescan")["X-Title"], "GetInTheAnswer weekly rescan"
        )
