"use client";

import { useEffect } from "react";
import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";

import { UnlockButton } from "@/components/unlock-button";

type BillingStatus = "cancelled" | "confirmation_error" | "success";

interface BillingStatusBannerProps {
  siteId: string;
  status: BillingStatus;
}

const content: Record<BillingStatus, { event: string; title: string; copy: string }> = {
  cancelled: {
    event: "checkout_cancelled",
    title: "Paiement annulé — rien n'a été débité.",
    copy: "L'aperçu de votre rapport est toujours là. Vous pourrez le débloquer quand vous le souhaitez.",
  },
  confirmation_error: {
    event: "checkout_confirmation_failed",
    title: "Nous n'avons pas encore pu confirmer le paiement.",
    copy: "Si Stripe vous a débité, actualisez cette page dans un instant. Sinon, vous pouvez réessayer sans risque.",
  },
  success: {
    event: "checkout_confirmed",
    title: "Votre rapport complet est débloqué.",
    copy: "Toutes les réponses et recommandations sont visibles, et le suivi hebdomadaire est actif.",
  },
};

export function BillingStatusBanner({ siteId, status }: BillingStatusBannerProps) {
  const details = content[status];

  useEffect(() => {
    const storageKey = `seenbyai_${details.event}_${siteId}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    window.gtag?.("event", details.event, { site_id: siteId });
    window.sessionStorage.setItem(storageKey, "1");
  }, [details.event, siteId]);

  const isSuccess = status === "success";
  const Icon = isSuccess ? CheckCircle2 : status === "cancelled" ? XCircle : CircleAlert;

  return (
    <section
      className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
          : "border-amber-200 bg-amber-50 text-amber-950"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 size-5 shrink-0 ${isSuccess ? "text-emerald-700" : "text-amber-700"}`} aria-hidden="true" />
        <div>
          <h2 className="font-extrabold">{details.title}</h2>
          <p className="mt-1 text-sm leading-6 opacity-75">{details.copy}</p>
        </div>
      </div>
      {!isSuccess && (
        <UnlockButton
          siteId={siteId}
          placement={`checkout_${status}`}
          size="sm"
          className="shrink-0 rounded-full px-5"
        >
          Try checkout again — $29/mo
        </UnlockButton>
      )}
    </section>
  );
}
