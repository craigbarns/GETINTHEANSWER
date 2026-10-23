"use client";

import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { PRICES, readStoredCurrency } from "@/lib/pricing";

const COPY: Record<Locale, { failed: string; offline: string; redirecting: string }> = {
  en: {
    failed: "Checkout couldn’t open. Please try again in a moment.",
    offline: "Checkout couldn’t open. Check your connection and try again.",
    redirecting: "Redirecting…",
  },
  fr: {
    failed: "Le paiement n’a pas pu s’ouvrir. Merci de réessayer dans un instant.",
    offline: "Le paiement n’a pas pu s’ouvrir. Vérifiez votre connexion et réessayez.",
    redirecting: "Redirection…",
  },
};

interface UnlockButtonProps {
  siteId: string;
  placement?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
  locale?: Locale;
  children: React.ReactNode;
}

function readGaClientId(): string | null {
  // The GA cookie looks like "GA1.1.<client_id_part1>.<client_id_part2>";
  // the client_id GA4's Measurement Protocol expects is the last two segments.
  const match = document.cookie.match(/(?:^|; )_ga=([^;]+)/);
  if (!match) return null;
  const parts = decodeURIComponent(match[1]).split(".");
  return parts.length >= 4 ? parts.slice(-2).join(".") : null;
}

export function UnlockButton({
  siteId,
  placement = "unknown",
  className,
  size = "default",
  variant = "default",
  locale = "en",
  children,
}: UnlockButtonProps) {
  const copy = COPY[locale];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = `checkout-error-${placement.replace(/[^a-zA-Z0-9-]/g, "-")}`;

  const handleClick = async () => {
    setError(null);
    setLoading(true);
    // The visitor pays in the currency the page was showing them, so the
    // analytics event and the checkout have to agree on which one that is.
    const currency = readStoredCurrency();
    const value = PRICES.pro[currency];
    window.gtag?.("event", "begin_checkout", {
      currency: currency.toUpperCase(),
      value,
      site_id: siteId,
      checkout_placement: placement,
      items: [
        {
          item_id: "pro_monthly",
          item_name: "GetInTheAnswer Pro Monitoring",
          price: value,
          quantity: 1,
        },
      ],
    });
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_id: siteId, ga_client_id: readGaClientId(), currency, locale }),
      });
      const data = (await response.json()) as { url?: string; message?: string };
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      window.gtag?.("event", "checkout_error", {
        checkout_placement: placement,
        status_code: response.status,
      });
      setError(locale === "en" && data.message ? data.message : copy.failed);
    } catch {
      window.gtag?.("event", "checkout_error", {
        checkout_placement: placement,
        status_code: 0,
      });
      setError(copy.offline);
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={loading}
        size={size}
        variant={variant}
        className={className}
        aria-describedby={error ? errorId : undefined}
      >
        {loading ? (
          <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> {copy.redirecting}</>
        ) : (
          <><LockKeyhole className="mr-2 size-4" aria-hidden="true" /> {children}</>
        )}
      </Button>
      {error && (
        <span id={errorId} className="mt-2 block max-w-sm text-xs font-semibold leading-5 text-red-700" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
