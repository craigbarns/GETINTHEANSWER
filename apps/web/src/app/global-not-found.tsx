import type { Metadata } from "next";

import { NotFoundPage } from "@/components/pages/not-found-page";
import { RootDocument, rootMetadata } from "@/components/root-document";

// The site has two root layouts (English and French), so unmatched URLs need a
// 404 that brings its own document. RootDocument imports the global styles.
export const metadata: Metadata = {
  ...rootMetadata("en"),
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootDocument locale="en">
      <NotFoundPage />
    </RootDocument>
  );
}
