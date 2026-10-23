"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

const COPY: Record<Locale, { opening: string; retry: string; manage: string }> = {
  en: { opening: "Opening…", retry: "Try again", manage: "Manage subscription" },
  fr: { opening: "Ouverture…", retry: "Réessayer", manage: "Gérer l’abonnement" },
};

interface ManageSubscriptionButtonProps {
  siteId: string;
  className?: string;
  locale?: Locale;
}

export function ManageSubscriptionButton({ siteId, className, locale = "en" }: ManageSubscriptionButtonProps) {
  const copy = COPY[locale];
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setFailed(false);
    window.gtag?.("event", "manage_subscription", { site_id: siteId });
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_id: siteId, locale }),
      });
      const data = (await response.json()) as { url?: string };
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // The retry state below gives the user visible feedback.
    }
    setFailed(true);
    setLoading(false);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleClick}
      disabled={loading}
      aria-live="polite"
    >
      {loading ? (
        <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> {copy.opening}</>
      ) : (
        <><CreditCard className="mr-2 size-4" aria-hidden="true" /> {failed ? copy.retry : copy.manage}</>
      )}
    </Button>
  );
}
