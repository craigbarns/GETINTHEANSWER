import { OG_ALT, OG_SIZE, renderOgImage } from "@/components/og-image";

export const alt = OG_ALT.fr;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage("fr");
}
