import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { AiChatForm } from "@/components/ai-chat-form";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "ChatGPT recommande-t-il votre entreprise ? Réponse en direct",
  description:
    "Entrez votre entreprise et votre ville : ChatGPT répond à la question que vos clients posent, et vous voyez instantanément si l’IA vous recommande — ou vos concurrents. Gratuit, sans carte.",
  alternates: localizedAlternates("fr", "/tools/ai-chat"),
};

export default function AiChatPageFr() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/fr" aria-label="GetInTheAnswer, accueil">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/fr">
          <ArrowLeft className="size-4" aria-hidden="true" /> Accueil
        </Link>
        <div className="mt-6 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Vérification instantanée</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">ChatGPT vous recommande-t-il ?</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Entrez votre entreprise, et ChatGPT répond à la question que vos clients posent vraiment. En direct, gratuit, sans inscription — puis lancez l’audit complet pour corriger ce que la réponse révèle.
          </p>
        </div>
        <div className="mt-10">
          <AiChatForm locale="fr" />
        </div>
      </main>
    </div>
  );
}
