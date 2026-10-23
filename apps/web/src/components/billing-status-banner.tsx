"use client";

import { useEffect } from "react";
import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";

import { Price } from "@/components/price";
import { UnlockButton } from "@/components/unlock-button";
import type { Locale } from "@/lib/i18n";
import { PRICES } from "@/lib/pricing";

type BillingStatus = "cancelled" | "confirmation_error" | "success";

interface BillingStatusBannerProps {
  siteId: string;
  status: BillingStatus;
  locale?: Locale;
}

const EVENTS: Record<BillingStatus, string> = {
  cancelled: "checkout_cancelled",
  confirmation_error: "checkout_confirmation_failed",
  success: "checkout_confirmed",
};

const CONTENT: Record<Locale, Record<BillingStatus, { title: string; copy: string }> & { retry: string; perMonth: string }> = {
  en: {
    cancelled: {
      title: "Checkout cancelled — you haven’t been charged.",
      copy: "Your report preview is still here. You can unlock it whenever you like.",
    },
    confirmation_error: {
      title: "We couldn’t confirm the payment yet.",
      copy: "If Stripe charged you, refresh this page in a moment. Otherwise you can safely try again.",
    },
    success: {
      title: "Your full report is unlocked.",
      copy: "Every answer and recommendation is visible, and weekly tracking is on.",
    },
    retry: "Try checkout again —",
    perMonth: "/mo",
  },
  fr: {
    cancelled: {
      title: "Paiement annulé — rien n’a été débité.",
      copy: "L’aperçu de votre rapport est toujours là. Vous pourrez le débloquer quand vous le souhaitez.",
    },
    confirmation_error: {
      title: "Nous n’avons pas encore pu confirmer le paiement.",
      copy: "Si Stripe vous a débité, actualisez cette page dans un instant. Sinon, vous pouvez réessayer sans risque.",
    },
    success: {
      title: "Votre rapport complet est débloqué.",
      copy: "Toutes les réponses et recommandations sont visibles, et le suivi hebdomadaire est actif.",
    },
    retry: "Réessayer le paiement —",
    perMonth: " / mois",
  },
};

export function BillingStatusBanner({ siteId, status, locale = "en" }: BillingStatusBannerProps) {
  const text = CONTENT[locale];
  const details = { ...text[status], event: EVENTS[status] };

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
          locale={locale}
        >
          {text.retry} <Price amounts={PRICES.pro} suffix={text.perMonth} />
        </UnlockButton>
      )}
    </section>
  );
}
