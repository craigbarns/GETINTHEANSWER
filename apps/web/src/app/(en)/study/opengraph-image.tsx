import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    title: "Local AI Visibility Benchmark",
    badge: "Benchmark",
    eyebrow: "Data & Methods",
  });
}
