"use client";

import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";

const SUPPORT_EMAIL = "gregory@wemade.fr";

interface UnlockButtonProps {
  siteId: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
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

export function UnlockButton({ siteId, className, size = "default", variant = "default", children }: UnlockButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    window.gtag?.("event", "begin_checkout", { currency: "USD", value: 29, site_id: siteId });

    let status = 0;
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_id: siteId, ga_client_id: readGaClientId() }),
      });
      status = response.status;
      const data = (await response.json().catch(() => null)) as { url?: string } | null;
      if (response.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // Network error: status stays 0 and the message below covers it.
    }

    // A checkout that fails silently costs a sale and leaves no trace, so the
    // failure is both shown to the customer and reported to analytics.
    window.gtag?.("event", "checkout_failed", { site_id: siteId, status });
    setError(
      status === 503
        ? "Payments are temporarily unavailable. Please try again in a few minutes."
        : "We couldn't open the payment page. Please try again, or email us and we'll unlock your report.",
    );
    setLoading(false);
  };

  return (
    <span className="inline-flex flex-col items-center gap-2">
      <Button onClick={handleClick} disabled={loading} size={size} variant={variant} className={className}>
        {loading ? (
          <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> Redirecting…</>
        ) : (
          <><LockKeyhole className="mr-2 size-4" aria-hidden="true" /> {error ? "Try again" : children}</>
        )}
      </Button>
      {error && (
        <span className="max-w-72 text-xs font-semibold leading-5 text-red-700" role="alert" aria-live="polite">
          {error}{" "}
          <a className="underline" href={`mailto:${SUPPORT_EMAIL}?subject=Unlock%20my%20report%20${siteId}`}>
            {SUPPORT_EMAIL}
          </a>
        </span>
      )}
    </span>
  );
}
