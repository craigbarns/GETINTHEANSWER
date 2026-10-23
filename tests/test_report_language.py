import json
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "apps" / "api"))
import main


def profile(locale="fr"):
    return main.OnboardingRequest(
        companyName="Entreprise de test", websiteUrl="https://example.com",
        email="owner@example.com", city="Marseille", industry="Immobilier",
        services="agence immobilière", locale=locale,
    )


class ReportLanguageTests(unittest.TestCase):
    def test_french_fallback_preserves_profile_and_machine_readable_levels(self):
        recommendations = main.build_recommendations(profile(" FR "))
        self.assertEqual(recommendations[0].title, "Créer une page FAQ locale")
        self.assertIn("agence immobilière", recommendations[0].description)
        self.assertIn("Marseille", recommendations[0].description)
        self.assertEqual([r.priority for r in recommendations], ["high", "medium", "low"])

    def test_english_remains_default_for_existing_callers(self):
        self.assertEqual(main.build_recommendations(profile(None))[0].title, "Create a local FAQ page")

    def test_french_simulation_keeps_language_for_future_rescans(self):
        report = main.generate_mock_dashboard_data("test-language", profile())
        self.assertEqual(report.locale, "fr")
        self.assertTrue(all("Marseille" in q.query for q in report.queries))
        self.assertTrue(all(not q.query.startswith("Who ") for q in report.queries))


class GeneratedReportLanguageTests(unittest.IsolatedAsyncioTestCase):
    async def test_recommendation_language_follows_report_not_quoted_queries(self):
        items = [r.model_dump() for r in main.build_recommendations(profile())]
        create = AsyncMock(return_value=SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=json.dumps({"recommendations": items})))]))
        client = SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=create)))
        queries = [main.QueryResult(query="Who should I hire in Austin?", engine="ChatGPT", brand_mentioned=False, competitors_detected=[], confidence=0.9)]
        result = await main.generate_recommendations_llm(client, profile(), queries, [])
        self.assertEqual(result[0].title, "Créer une page FAQ locale")
        self.assertIn("in French", create.call_args.kwargs["messages"][0]["content"])

    async def test_weekly_rescan_preserves_original_report_locale(self):
        previous = main.generate_mock_dashboard_data("test-language", profile())
        run = AsyncMock(return_value=previous.model_copy(deep=True))
        with patch.object(main, "load_report", return_value=previous), patch.object(main, "get_report_email", return_value=None), patch.object(main, "run_live_scan", run), patch.object(main, "save_report"), patch.object(main, "record_history"):
            await main.rescan_report(previous.site_id)
        self.assertEqual(run.call_args.args[1].locale, "fr")


if __name__ == "__main__":
    unittest.main()
