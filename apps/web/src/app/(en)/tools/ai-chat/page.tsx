import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { AiChatForm } from "@/components/ai-chat-form";
import { localizedAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Ask ChatGPT about your business — free, live, no signup",
  description:
    "Type your business and city: ChatGPT answers the question your customers ask, and you see instantly whether AI recommends you or your competitors. Free, no card.",
  alternates: localizedAlternates("en", "/tools/ai-chat"),
};

export default function AiChatPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, home">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <Link className="flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="/">
          <ArrowLeft className="size-4" aria-hidden="true" /> Home
        </Link>
        <div className="mt-6 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Instant AI check</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Does ChatGPT recommend you?</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Type your business, and ChatGPT answers the question your customers actually ask. Live, free, no signup — then run the full audit to fix what the answer reveals.
          </p>
        </div>
        <div className="mt-10">
          <AiChatForm locale="en" />
        </div>
      </main>
    </div>
  );
}
