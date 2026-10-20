import sys
import unittest
from pathlib import Path
from unittest.mock import patch

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import main


class PriceForCurrencyTests(unittest.TestCase):
    def test_euro_request_uses_the_euro_price(self):
        with patch.object(main, "STRIPE_PRICE_ID", "price_usd"), patch.object(
            main, "STRIPE_PRICE_ID_EUR", "price_eur"
        ):
            self.assertEqual(main.price_for_currency("eur"), ("price_eur", "eur"))

    def test_dollar_request_uses_the_dollar_price(self):
        with patch.object(main, "STRIPE_PRICE_ID", "price_usd"), patch.object(
            main, "STRIPE_PRICE_ID_EUR", "price_eur"
        ):
            self.assertEqual(main.price_for_currency("usd"), ("price_usd", "usd"))

    def test_euro_request_falls_back_when_no_euro_price_exists(self):
        with patch.object(main, "STRIPE_PRICE_ID", "price_usd"), patch.object(
            main, "STRIPE_PRICE_ID_EUR", ""
        ), patch.object(main, "STRIPE_DEFAULT_CURRENCY", "usd"):
            self.assertEqual(main.price_for_currency("eur"), ("price_usd", "usd"))

    def test_dollar_request_falls_back_to_the_only_price_configured(self):
        with patch.object(main, "STRIPE_PRICE_ID", ""), patch.object(
            main, "STRIPE_PRICE_ID_EUR", "price_eur"
        ):
            self.assertEqual(main.price_for_currency("usd"), ("price_eur", "eur"))

    def test_missing_currency_uses_the_configured_default(self):
        with patch.object(main, "STRIPE_PRICE_ID", "price_usd"), patch.object(
            main, "STRIPE_PRICE_ID_EUR", "price_eur"
        ), patch.object(main, "STRIPE_DEFAULT_CURRENCY", "eur"):
            self.assertEqual(main.price_for_currency(None), ("price_eur", "eur"))

    def test_unknown_currency_does_not_break_checkout(self):
        with patch.object(main, "STRIPE_PRICE_ID", "price_usd"), patch.object(
            main, "STRIPE_PRICE_ID_EUR", "price_eur"
        ), patch.object(main, "STRIPE_DEFAULT_CURRENCY", "usd"):
            self.assertEqual(main.price_for_currency("gbp"), ("price_usd", "usd"))

    def test_checkout_request_accepts_a_currency(self):
        body = main.CheckoutRequest(site_id="abc", currency="eur")
        self.assertEqual(body.currency, "eur")


if __name__ == "__main__":
    unittest.main()
