"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

export function CopyReadyContent({ text, filename, label, locale }: { text: string; filename: string; label: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const fr = locale === "fr";
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true); setError("");
      window.gtag?.("event", "copy_report_asset", { asset: filename, language: locale });
      setTimeout(() => setCopied(false), 2000);
    } catch { setError(fr ? "Sélectionnez le texte ci-dessous pour le copier manuellement." : "Select the text below to copy it manually."); }
  }
  function download() {
    const mime = filename.endsWith(".html") ? "text/html" : "text/plain";
    const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
    const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="mt-4 space-y-3">
    <div className="flex flex-wrap gap-2">
      <Button onClick={copy} size="sm" className="rounded-full" disabled={!text}>{copied ? <Check className="mr-1.5 size-4" /> : <Copy className="mr-1.5 size-4" />}{copied ? (fr ? "Copié !" : "Copied!") : label}</Button>
      <Button onClick={download} variant="outline" size="sm" className="rounded-full" disabled={!text}><Download className="mr-1.5 size-4" />{fr ? "Télécharger" : "Download"}</Button>
    </div>
    <p className="text-sm text-muted-foreground" role="status">{error}</p>
    <details className="rounded-xl bg-[#f3f4ed] p-3">
      <summary className="cursor-pointer text-sm font-semibold">{fr ? "Afficher le contenu" : "View content"}</summary>
      <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs leading-6">{text}</pre>
    </details>
  </div>;
}
