import sys
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "apps" / "api"))
import email_service
import main
from weekly_updates import build_weekly_changes


def row(mentioned=False, engine="Perplexity", query="Quel prestataire à Marseille ?", competitors=None):
    return {"engine": engine, "query": query, "brand_mentioned": mentioned, "competitors_detected": competitors or []}


def report(*queries, mode="live"):
    return {"mode": mode, "queries": list(queries)}


class ComparableChangesTests(unittest.TestCase):
    def test_detects_new_and_lost_mentions_on_identical_questions(self):
        old, new = report(row()), report(row(True))
        self.assertEqual(build_weekly_changes(old, new)[0]["kind"], "new_mention")
        self.assertEqual(build_weekly_changes(new, old)[0]["kind"], "lost_mention")

    def test_changed_questions_or_an_unavailable_engine_do_not_imply_a_loss(self):
        old = report(row(True))
        self.assertEqual(build_weekly_changes(old, report(row(query="Une autre question"))), [])
        self.assertEqual(build_weekly_changes(old, report(row(engine="ChatGPT"))), [])

    def test_does_not_compare_simulation_with_real_measurements(self):
        self.assertEqual(build_weekly_changes(report(row(), mode="simulation"), report(row(True))), [])

    def test_competitor_only_overtakes_when_previously_known_and_comparable(self):
        old = report(row(True, competitors=["Atelier de test"]))
        new = report(row(False, competitors=["Atelier de test", "Atelier de test"]))
        change = next(c for c in build_weekly_changes(old, new) if c["kind"] == "competitor_overtook")
        self.assertEqual(change["competitor_mentions"], 1)
        self.assertEqual(change["questions"], 1)

    def test_french_email_uses_real_changes_and_escapes_profile_text(self):
        changes = build_weekly_changes(report(row()), report(row(True)))
        subject, html = email_service.weekly_report_email("<script>test</script>", "https://example.com/fr/dashboard", changes, [{"score": 10, "date": "2026-10-16"}, {"score": 20, "date": "2026-10-23"}], "fr")
        self.assertIn("Bonne nouvelle", subject)
        self.assertIn("Perplexity", subject)
        self.assertNotIn("<script>", html)
        self.assertIn("1 des 1 questions comparables", html)
        self.assertIn("2026-10-16", html)


class WeeklyDeliveryTests(unittest.IsolatedAsyncioTestCase):
    def fixture(self):
        profile = main.OnboardingRequest(companyName="Entreprise de test", websiteUrl="https://example.com", email="owner@example.com", city="Marseille", industry="Plomberie", locale="fr")
        return main.generate_mock_dashboard_data("weekly-test", profile).model_copy(update={"mode": "live", "unlocked": True, "has_subscription": True})

    async def test_rescan_reuses_questions_and_sends_localized_update_after_saving(self):
        previous = self.fixture()
        current = previous.model_copy(deep=True)
        run, send = AsyncMock(return_value=current), AsyncMock(return_value=True)
        with patch.object(main, "load_report", return_value=previous), patch.object(main, "get_report_email", return_value="owner@example.com"), patch.object(main, "run_live_scan", run), patch.object(main, "save_report") as save, patch.object(main, "record_history"), patch.object(main, "load_history", return_value=[]), patch.object(main, "send_email", send):
            await main.rescan_report(previous.site_id)
        self.assertEqual(run.call_args.kwargs["fixed_queries"], list(dict.fromkeys(q.query for q in previous.queries)))
        self.assertEqual(run.call_args.args[1].locale, "fr")
        save.assert_called_once()
        send.assert_awaited_once()
        self.assertIn("/fr/dashboard", send.call_args.args[2])
        self.assertTrue(send.call_args.kwargs["idempotency_key"].startswith("weekly/"))

    async def test_does_not_rescan_or_email_inactive_subscribers(self):
        previous = self.fixture().model_copy(update={"has_subscription": False})
        with patch.object(main, "load_report", return_value=previous), patch.object(main, "run_live_scan", AsyncMock()) as run, patch.object(main, "send_email", AsyncMock()) as send:
            await main.rescan_report(previous.site_id)
        run.assert_not_awaited()
        send.assert_not_awaited()


if __name__ == "__main__":
    unittest.main()
