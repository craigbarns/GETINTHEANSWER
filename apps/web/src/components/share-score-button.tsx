"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localePath, type Locale } from "@/lib/i18n";

const COPY: Record<Locale, { button: string; heading: string; linkedin: string; x: string; copy: string; copied: string; text: (company: string, city: string, score: number) => string }> = {
  en: {
    button: "Share score",
    heading: "Share your results",
    linkedin: "Share on LinkedIn",
    x: "Share on X / Twitter",
    copy: "Copy report link",
    copied: "Link copied!",
    text: (company, city, score) =>
      `We tested how visible ${company} (${city}) is across ChatGPT, Claude & Perplexity with @GetInTheAnswer. Our AI Visibility Score is ${score}/100! 🚀 Check your local AI ranking:`,
  },
  fr: {
    button: "Partager le score",
    heading: "Partagez vos résultats",
    linkedin: "Partager sur LinkedIn",
    x: "Partager sur X / Twitter",
    copy: "Copier le lien du rapport",
    copied: "Lien copié !",
    text: (company, city, score) =>
      `Nous avons mesuré la visibilité de ${company} (${city}) dans ChatGPT, Claude et Perplexity avec @GetInTheAnswer. Notre score de visibilité IA : ${score}/100 ! 🚀 Testez la vôtre :`,
  },
};

interface ShareScoreButtonProps {
  companyName: string;
  score: number;
  city: string;
  siteId: string;
  locale?: Locale;
}

export function ShareScoreButton({ companyName, score, city, siteId, locale = "en" }: ShareScoreButtonProps) {
  const copy = COPY[locale];
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const buildReportUrl = (source: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.getintheanswer.com";
    const url = new URL(localePath(locale, "/dashboard"), origin);
    url.searchParams.set("site_id", siteId);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", "score_share");
    return url.toString();
  };

  const linkedinReportUrl = buildReportUrl("linkedin");
  const twitterReportUrl = buildReportUrl("x");
  const copiedReportUrl = buildReportUrl("copy_link");

  const shareText = copy.text(companyName, city, score);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(twitterReportUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedinReportUrl)}`;

  const trackShare = (method: string) => {
    window.gtag?.("event", "share", {
      method,
      content_type: "ai_visibility_report",
      item_id: siteId,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copiedReportUrl);
      trackShare("copy_link");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => setOpen(!open)}
        variant="outline"
        size="sm"
        className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
      >
        <Share2 className="mr-1.5 size-3.5" />
        {copy.button}
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-foreground/10 bg-white p-3 text-foreground shadow-2xl">
          <p className="px-2 py-1 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            {copy.heading}
          </p>
          <div className="mt-2 space-y-1.5">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackShare("linkedin")}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors hover:bg-[#f8f8f3]"
            >
              <span>{copy.linkedin}</span>
              <span className="text-[10px] text-muted-foreground">↗</span>
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackShare("x")}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors hover:bg-[#f8f8f3]"
            >
              <span>{copy.x}</span>
              <span className="text-[10px] text-muted-foreground">↗</span>
            </a>
            <button
              onClick={handleCopy}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-[#f8f8f3]"
            >
              <span>{copied ? copy.copied : copy.copy}</span>
              {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3 text-muted-foreground" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
