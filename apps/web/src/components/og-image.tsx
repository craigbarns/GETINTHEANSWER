import { ImageResponse } from "next/og";

import type { Locale } from "@/lib/i18n";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_ALT: Record<Locale, string> = {
  en: "GetInTheAnswer — Is your business recommended by ChatGPT, Claude & Perplexity?",
  fr: "GetInTheAnswer — Votre entreprise est-elle recommandée par ChatGPT, Claude et Perplexity ?",
};

const OG_TEXT: Record<Locale, { title: string; subtitle: string }> = {
  en: {
    title: "ChatGPT is recommending your competitors. Is it recommending you?",
    subtitle: "Measure your visibility in ChatGPT, Claude, Gemini & Perplexity. Free scan, instant score.",
  },
  fr: {
    title: "ChatGPT recommande vos concurrents. Et vous ?",
    subtitle: "Mesurez votre visibilité dans ChatGPT, Claude, Gemini et Perplexity. Analyse gratuite, score immédiat.",
  },
};

export function renderOgImage(locale: Locale) {
  const text = OG_TEXT[locale];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#173b35",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg viewBox="0 0 48 48" width="64" height="64">
            <rect x="3" y="3" width="42" height="36" rx="12" fill="#bef264" />
            <path d="M11 35 L11 45.6 C11 47.5 12.7 47 13.7 46 L23.5 37 Z" fill="#bef264" />
            <rect x="11.75" y="23" width="5.5" height="8" rx="2.75" fill="#173b35" opacity="0.35" />
            <rect x="21.25" y="17.5" width="5.5" height="13.5" rx="2.75" fill="#173b35" opacity="0.65" />
            <rect x="30.75" y="11" width="5.5" height="20" rx="2.75" fill="#173b35" />
          </svg>
          <div style={{ color: "#ffffff", fontSize: 44, fontWeight: 800, letterSpacing: -2 }}>GetInTheAnswer</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#ffffff", fontSize: 68, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, maxWidth: 1050 }}>
            {text.title}
          </div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 32, lineHeight: 1.4, maxWidth: 900 }}>
            {text.subtitle}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              background: "#bef264",
              color: "#173b35",
              fontSize: 28,
              fontWeight: 800,
              padding: "16px 36px",
              borderRadius: 999,
            }}
          >
            www.getintheanswer.com
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
