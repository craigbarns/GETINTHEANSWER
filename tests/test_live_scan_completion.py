import sys
import unittest
from contextlib import ExitStack
from pathlib import Path
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "apps" / "api"))
import main


class LiveScanCompletionTests(unittest.TestCase):
    def test_live_onboarding_saves_report_with_engine_concurrency_configuration(self):
        for openrouter, expected_engines in (
            (True, ["ChatGPT", "Claude", "Gemini", "Perplexity"]),
            (False, ["ChatGPT"]),
        ):
            with self.subTest(openrouter=openrouter), ExitStack() as stack:
                for name, value in {
                    "LIVE_MODE": True, "USE_OPENROUTER": openrouter,
                    "ANTHROPIC_API_KEY": "", "GEMINI_API_KEY": "",
                    "PERPLEXITY_API_KEY": "", "db_engine": None,
                    "OUTREACH_API_KEY": "test-internal-key",
                }.items():
                    stack.enter_context(patch.object(main, name, value))
                stack.enter_context(patch.dict(main.MEMORY_DB, {}, clear=True))
                stack.enter_context(patch.dict(main.MEMORY_EMAILS, {}, clear=True))
                stack.enter_context(patch("openai.AsyncOpenAI"))
                for name, result in {
                    "validate_public_http_url": None,
                    "audit_site": None,
                    "generate_queries_llm": ["Who offers renovation in Lyon?"],
                    "ask_engine": "Example Business offers renovation in Lyon.",
                    "extract_mentions": None,
                    "generate_recommendations_llm": None,
                }.items():
                    stack.enter_context(patch.object(main, name, AsyncMock(return_value=result)))
                emails = stack.enter_context(patch.object(main, "dispatch_scan_emails", AsyncMock()))
                response = TestClient(main.app).post(
                    "/api/onboarding",
                    headers={"X-Outreach-Key": "test-internal-key"},
                    json={
                        "companyName": "Example Business", "websiteUrl": "https://example.com",
                        "email": "test@example.com", "city": "Lyon", "industry": "Renovation",
                        "locale": "fr", "notify": False,
                    },
                )
                self.assertEqual(response.status_code, 200)
                data = response.json()
                self.assertEqual(data["mode"], "live")
                report = main.load_report(data["site_id"])
                self.assertEqual(report.engines_used, expected_engines)
                self.assertEqual(report.total_queries, len(expected_engines))
                self.assertEqual(report.brand_mentions, len(expected_engines))
                self.assertEqual(report.visibility_score, 100)
                self.assertEqual(report.locale, "fr")
                emails.assert_not_called()


if __name__ == "__main__":
    unittest.main()
