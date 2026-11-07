"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const COPY = {
  en: {
    placeholderEmail: "Work email",
    placeholderShop: "Your shop URL (e.g. mystore.com)",
    submit: "Join the waitlist",
    loading: "Adding you…",
    success: "✅ You're on the list. We'll reach out when the AI Shopping audit opens.",
    error: "Something went wrong — try again in a moment.",
  },
  fr: {
    placeholderEmail: "E-mail professionnel",
    placeholderShop: "L'URL de votre boutique (ex. maboutique.fr)",
    submit: "Rejoindre la liste d'attente",
    loading: "Inscription en cours…",
    success: "✅ Vous êtes inscrit(e). On vous contactera à l'ouverture de l'audit Shopping IA.",
    error: "Une erreur est survenue — réessayez dans un instant.",
  },
};

export function AiShoppingWaitlist({ locale }: { locale: "en" | "fr" }) {
  const copy = COPY[locale];
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("email"),
          workEmail: form.get("email"),
          companyName: form.get("shop"),
          message: "AI Shopping Intelligence waitlist — shop: " + String(form.get("shop")) + " (locale: " + locale + ")",
        }),
      });
      if (!response.ok) throw new Error();
      setDone(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-emerald-700/25 bg-emerald-50/70 px-6 py-4">
        <Check className="size-5 shrink-0 text-emerald-700" aria-hidden="true" />
        <p className="text-sm font-bold">{copy.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
      <input required type="email" name="email" placeholder={copy.placeholderEmail} className="w-full rounded-full border border-foreground/15 bg-white px-5 py-3 text-sm outline-none focus:border-emerald-700" />
      <input required name="shop" placeholder={copy.placeholderShop} className="w-full rounded-full border border-foreground/15 bg-white px-5 py-3 text-sm outline-none focus:border-emerald-700" />
      <Button disabled={loading} className="h-12 shrink-0 rounded-full bg-lime-300 font-extrabold text-[#173b35] hover:bg-lime-200">
        {loading ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : null}
        {copy.submit} <ArrowRight className="ml-1 size-4" aria-hidden="true" />
      </Button>
      {error && <p className="text-sm text-red-700">{copy.error}</p>}
    </form>
  );
}
