import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

from fastapi import HTTPException
from pydantic import ValidationError

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import ai_agents  # noqa: E402
import main  # noqa: E402

SITE = "00000000-0000-0000-0000-000000000001"


class DetectAgentTests(unittest.TestCase):
    def test_detects_gptbot(self):
        self.assertEqual(ai_agents.detect_agent("GPTBot/1.0"), "ChatGPT (OpenAI)")

    def test_detects_claudebot(self):
        self.assertEqual(ai_agents.detect_agent("Mozilla/5.0 ClaudeBot"), "Claude (Anthropic)")

    def test_ignores_regular_browser(self):
        self.assertIsNone(ai_agents.detect_agent("Mozilla/5.0 (Macintosh) Chrome/126"))

    def test_handles_missing_user_agent(self):
        self.assertIsNone(ai_agents.detect_agent(None))

    def test_detects_chatgpt_referrer(self):
        self.assertEqual(ai_agents.detect_referrer_engine("https://chatgpt.com/c/abc"), "ChatGPT")

    def test_ignores_google_search_referrer(self):
        self.assertIsNone(ai_agents.detect_referrer_engine("https://www.google.com/"))


class LogHitsTests(unittest.TestCase):
    def _conn(self):
        conn = MagicMock()
        conn.__enter__.return_value = conn
        return conn

    def test_inserts_only_ai_hits(self):
        hits = [
            main.AiAgentHit(site_id=SITE, user_agent="GPTBot/1.0", path="/"),
            main.AiAgentHit(site_id=SITE, user_agent="Chrome", referrer="https://chatgpt.com/c/1", path="/p"),
            main.AiAgentHit(site_id=SITE, user_agent="Chrome", path="/x"),
        ]
        conn = self._conn()
        with patch.object(main, "db_engine", MagicMock(begin=lambda: conn)):
            out = main.log_ai_agent_hits(hits)
        self.assertEqual(out, {"inserted": 2})
        self.assertEqual(conn.execute.call_count, 2)

    def test_rejects_invalid_site_id(self):
        hits = [main.AiAgentHit(site_id="not-a-uuid", user_agent="GPTBot", path="/")]
        conn = self._conn()
        with patch.object(main, "db_engine", MagicMock(begin=lambda: conn)):
            with self.assertRaises(HTTPException) as ctx:
                main.log_ai_agent_hits(hits)
        self.assertEqual(ctx.exception.status_code, 400)

    def test_summary_shape(self):
        conn = self._conn()
        conn.execute.return_value.mappings.return_value.all.return_value = [
            {"agent": "ChatGPT (OpenAI)", "referral_engine": "ChatGPT", "path": "/"},
            {"agent": "Claude (Anthropic)", "referral_engine": None, "path": "/pricing"},
        ]
        with patch.object(main, "db_engine", MagicMock(begin=lambda: conn)):
            summary = main.ai_agent_summary(SITE)
        self.assertEqual(summary.crawler_visits, 2)
        self.assertEqual(summary.ai_referral_visits, 1)
        self.assertEqual(summary.crawlers["ChatGPT (OpenAI)"], 1)

    def test_summary_rejects_invalid_site_id(self):
        with patch.object(main, "db_engine", MagicMock(begin=lambda: self._conn())):
            with self.assertRaises(HTTPException) as ctx:
                main.ai_agent_summary("nope")
        self.assertEqual(ctx.exception.status_code, 404)


if __name__ == "__main__":
    unittest.main()
