export type Currency = "eur" | "usd";

export const CURRENCIES: Currency[] = ["eur", "usd"];

export const DEFAULT_CURRENCY: Currency = "eur";

export const CURRENCY_STORAGE_KEY = "gita_currency";

/** Plan prices per currency. These are list prices: each must match the amount
 *  of the matching Stripe Price, or the page and the checkout disagree. */
export const PRICES: Record<"pro" | "agency", Record<Currency, number>> = {
  pro: { eur: 29, usd: 29 },
  agency: { eur: 149, usd: 149 },
};

const SYMBOLS: Record<Currency, string> = { eur: "€", usd: "$" };

/** French convention puts the euro sign after the amount, the dollar before. */
export function formatPrice(amount: number, currency: Currency) {
  return currency === "eur" ? `${amount} ${SYMBOLS.eur}` : `${SYMBOLS.usd}${amount}`;
}

export function isCurrency(value: unknown): value is Currency {
  return value === "eur" || value === "usd";
}

export function readStoredCurrency(): Currency {
  if (typeof document === "undefined") return DEFAULT_CURRENCY;
  const fromDom = document.documentElement.dataset.currency;
  if (isCurrency(fromDom)) return fromDom;
  try {
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (isCurrency(stored)) return stored;
  } catch {
    // Private browsing or blocked storage: the default is a fine answer.
  }
  return DEFAULT_CURRENCY;
}
