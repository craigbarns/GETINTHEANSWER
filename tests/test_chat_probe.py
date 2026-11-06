import sys
import unittest
from pathlib import Path

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import chat_probe  # noqa: E402


class ProbeQuestionTests(unittest.TestCase):
    def test_english_question(self):
        req = chat_probe.ChatProbeRequest(company_name="ACME", city="miami", industry="Plumbers")
        self.assertEqual(chat_probe.probe_question(req), "Who is the best plumbers in Miami?")

    def test_french_question(self):
        req = chat_probe.ChatProbeRequest(company_name="ACME", city="marseille", industry="Plombiers", locale="fr")
        self.assertEqual(
            chat_probe.probe_question(req),
            "Quel professionnel de plombiers recommanderiez-vous à Marseille ?",
        )


class BrandMatchTests(unittest.TestCase):
    def test_exact_match_ignores_case(self):
        self.assertTrue(chat_probe.brand_in_answer("Consider ACME Plumbing for emergencies.", "acme plumbing"))

    def test_collapses_whitespace(self):
        self.assertTrue(chat_probe.brand_in_answer("Try ACME\n  Plumbing today.", "ACME   Plumbing"))

    def test_rejects_partial_word(self):
        self.assertFalse(chat_probe.brand_in_answer("AcmeCorp is great.", "ACME"))

    def test_empty_name_never_matches(self):
        self.assertFalse(chat_probe.brand_in_answer("Anything", ""))


if __name__ == "__main__":
    unittest.main()
