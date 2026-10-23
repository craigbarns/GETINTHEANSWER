import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from pydantic import ValidationError

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import email_service  # noqa: E402
import main  # noqa: E402


class FrontendPathTests(unittest.TestCase):
    def test_french_paths_live_under_fr(self):
        self.assertEqual(main.frontend_path("/dashboard", "fr"), "/fr/dashboard")
        self.assertEqual(main.frontend_path("/dashboard", "FR "), "/fr/dashboard")

    def test_english_and_unknown_locales_stay_at_the_root(self):
        for locale in ("en", None, "", "de"):
            self.assertEqual(main.frontend_path("/dashboard", locale), "/dashboard")


class CheckoutUrlTests(unittest.TestCase):
    def test_french_checkout_returns_to_the_french_dashboard(self):
        with patch.object(main, "FRONTEND_URL", "https://www.getintheanswer.com"):
            urls = main.checkout_urls("abc", "fr")
        self.assertEqual(
            urls["success_url"],
            "https://www.getintheanswer.com/api/checkout/confirm?site_id=abc&lang=fr&session_id={CHECKOUT_SESSION_ID}",
        )
        self.assertEqual(
            urls["cancel_url"],
            "https://www.getintheanswer.com/fr/dashboard?site_id=abc&checkout=cancelled",
        )
        self.assertEqual(urls["locale"], "fr")

    def test_english_checkout_keeps_the_configured_locale(self):
        with patch.object(main, "FRONTEND_URL", "https://www.getintheanswer.com"), patch.object(
            main, "STRIPE_CHECKOUT_LOCALE", "en"
        ):
            urls = main.checkout_urls("abc", None)
        self.assertNotIn("lang=", urls["success_url"])
        self.assertEqual(urls["cancel_url"], "https://www.getintheanswer.com/dashboard?site_id=abc&checkout=cancelled")
        self.assertEqual(urls["locale"], "en")


def inquiry(**overrides):
    values = {
        "fullName": "Jordan Lee",
        "workEmail": "jordan@example.com",
        "companyName": "Lakeside Kitchen Co.",
        "locationCount": 1,
    }
    values.update(overrides)
    return main.AgencyInquiryRequest(**values)


class InquiryTypeTests(unittest.TestCase):
    def test_done_for_you_accepts_a_single_location(self):
        self.assertEqual(inquiry(inquiryType="done_for_you").locationCount, 1)

    def test_agency_inquiry_still_needs_several_locations(self):
        with self.assertRaises(ValidationError):
            inquiry()
        self.assertEqual(inquiry(locationCount=25).inquiryType, "agency")

    def test_unknown_inquiry_type_is_rejected(self):
        with self.assertRaises(ValidationError):
            inquiry(inquiryType="free_lunch")

    def test_done_for_you_email_is_labelled(self):
        subject, html = email_service.agency_inquiry_email(
            "Jordan Lee", "jordan@example.com", "Lakeside Kitchen Co.", None, 1, None, inquiry_type="done_for_you"
        )
        self.assertEqual(subject, "Done-for-you request: Lakeside Kitchen Co.")
        self.assertIn("New done-for-you request", html)


class ReportEmailTests(unittest.TestCase):
    def test_french_report_email(self):
        subject, html = email_service.report_ready_email("Cuisines du Port", "https://x.test/fr/dashboard?site_id=1", "fr")
        self.assertEqual(subject, "Votre rapport de visibilité IA pour Cuisines du Port est prêt")
        self.assertIn("Voir mon rapport", html)

    def test_company_name_is_escaped_in_the_email_body(self):
        _subject, html = email_service.report_ready_email("<b>Acme</b>", "https://x.test/dashboard?site_id=1")
        self.assertIn("&lt;b&gt;Acme&lt;/b&gt;", html)
        self.assertNotIn("<b>Acme</b>", html)


if __name__ == "__main__":
    unittest.main()
