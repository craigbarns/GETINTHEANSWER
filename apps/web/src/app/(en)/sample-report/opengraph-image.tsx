import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    title: "Sample AI Visibility Report",
    badge: "Sample Report",
    eyebrow: "See a Full Report Before You Buy",
  });
}
