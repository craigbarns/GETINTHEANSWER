"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Locale } from "@/lib/i18n";

type Props = { company: string; city: string; engine: string; query: string; excerpt: string; measured: string; locale: Locale };

function lines(context: CanvasRenderingContext2D, text: string, width: number): string[] {
  const result: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > width) { result.push(line); line = word; }
    else line = next;
  }
  if (line) result.push(line);
  return result;
}

export function ShareAnswerImage(props: Props) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState<{ file: File; url: string; height: number } | null>(null);
  const fr = props.locale === "fr";
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview.url); }, [preview]);

  async function share() {
    setBusy(true);
    setStatus("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.font = "bold 32px system-ui, sans-serif";
      const companyLines = lines(context, `${props.company} · ${props.city}`, 1056);
      context.font = "26px system-ui, sans-serif";
      const queryLines = lines(context, props.query, 1056);
      context.font = "bold 34px system-ui, sans-serif";
      const quoteLines = lines(context, props.excerpt, 1056);
      canvas.height = 330 + companyLines.length * 44 + queryLines.length * 38 + quoteLines.length * 48;
      context.fillStyle = "#173b35";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#bef264";
      context.font = "bold 26px system-ui, sans-serif";
      context.fillText("GetInTheAnswer", 72, 70);
      context.fillStyle = "#ffffff";
      let y = 132;
      context.font = "bold 32px system-ui, sans-serif";
      for (const line of companyLines) { context.fillText(line, 72, y); y += 44; }
      y += 28;
      context.font = "26px system-ui, sans-serif";
      for (const line of queryLines) { context.fillText(line, 72, y); y += 38; }
      y += 32;
      context.fillStyle = "#bef264";
      context.fillText(fr ? `${props.engine} a répondu :` : `${props.engine} answered:`, 72, y);
      y += 52;
      context.fillStyle = "#ffffff";
      context.font = "bold 34px system-ui, sans-serif";
      for (const line of quoteLines) { context.fillText(line, 72, y); y += 48; }
      context.font = "22px system-ui, sans-serif";
      context.fillStyle = "#c8d5ce";
      context.fillText([fr ? "Extrait original" : "Original excerpt", props.measured].filter(Boolean).join(" · "), 72, canvas.height - 54);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Image unavailable")), "image/png"));
      const file = new File([blob], "getintheanswer-reponse-ia.png", { type: "image/png" });
      setPreview({ file, url: URL.createObjectURL(blob), height: canvas.height });
    } catch (error) {
      console.warn("Could not export the answer image", error);
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setStatus(fr ? "L’image n’a pas pu être créée. Réessayez." : "The image could not be created. Try again.");
      }
    } finally { setBusy(false); }
  }

  async function sharePreparedImage() {
    if (!preview) return;
    try {
      if (!navigator.canShare?.({ files: [preview.file] })) {
        setStatus(fr ? "Téléchargez le PNG pour le partager." : "Download the PNG to share it.");
        return;
      }
      await navigator.share({ files: [preview.file], title: "GetInTheAnswer" });
      window.gtag?.("event", "share", { method: "answer_image", content_type: "ai_answer_excerpt", language: props.locale });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setStatus(fr ? "Le partage natif est indisponible. Vous pouvez télécharger le PNG." : "Native sharing is unavailable. You can download the PNG.");
      }
    }
  }

  return <div className="flex flex-wrap items-center gap-3">
    <Button variant="outline" className="rounded-full bg-white" onClick={share} disabled={busy}>
      <Share2 className="mr-2 size-4" aria-hidden="true" />
      {busy ? (fr ? "Préparation…" : "Preparing…") : (fr ? "Partager en image" : "Share as an image")}
    </Button>
    <span className="text-sm text-muted-foreground" role="status">{status}</span>
    <Dialog open={Boolean(preview)} onOpenChange={(open) => { if (!open) setPreview(null); }}>
      <DialogContent showCloseButton={false} className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{fr ? "Partager cette réponse en image" : "Share this answer as an image"}</DialogTitle>
          <DialogDescription>{fr ? "La citation et la date de votre relevé sont conservées dans l’image." : "The image preserves the quote and the date of your scan."}</DialogDescription>
        </DialogHeader>
        {preview && <Image src={preview.url} width={1200} height={preview.height} unoptimized className="h-auto w-full rounded-xl" alt={fr ? "Aperçu de la citation à partager" : "Preview of the quote to share"} />}
        <p role="status" className="text-sm text-muted-foreground">{status}</p>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>{fr ? "Fermer" : "Close"}</DialogClose>
          {preview && <Button asChild variant="outline"><a href={preview.url} download={preview.file.name}><Download className="mr-2 size-4" />{fr ? "Télécharger le PNG" : "Download PNG"}</a></Button>}
          <Button onClick={sharePreparedImage}><Share2 className="mr-2 size-4" />{fr ? "Ouvrir le partage" : "Open sharing"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}
