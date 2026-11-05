import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    title: "Exemple de rapport de visibilité IA",
    badge: "Rapport exemple",
    eyebrow: "Voyez un rapport complet avant d'acheter",
  });
}
