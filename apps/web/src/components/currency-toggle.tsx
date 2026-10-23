"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  CURRENCIES,
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  readStoredCurrency,
  type Currency,
} from "@/lib/pricing";

const LABELS: Record<Currency, string> = { eur: "EUR €", usd: "USD $" };
const CHANGE_EVENT = "gita:currency";

/** The selected currency lives on the document, not in React state: the inline
 *  script in the layout sets it before paint, and CSS reads it. Subscribing to
 *  it keeps every toggle on the page in agreement without a shared provider. */
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function CurrencyToggle({
  className,
  defaultCurrency = DEFAULT_CURRENCY,
  label = "Display currency",
}: {
  className?: string;
  defaultCurrency?: Currency;
  label?: string;
}) {
  const currency = useSyncExternalStore(
    subscribe,
    readStoredCurrency,
    () => defaultCurrency,
  );

  const choose = useCallback((next: Currency) => {
    document.documentElement.setAttribute("data-currency", next);
    try {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
    window.gtag?.("event", "select_currency", { currency: next });
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-white p-1 shadow-sm ${className ?? ""}`}
      role="group"
      aria-label={label}
    >
      {CURRENCIES.map((option) => (
        <button
          aria-pressed={currency === option}
          className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
            currency === option
              ? "bg-[#173b35] text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
          key={option}
          onClick={() => choose(option)}
          type="button"
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  );
}
