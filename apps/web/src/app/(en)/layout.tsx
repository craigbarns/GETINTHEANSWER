import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";

export const metadata = rootMetadata("en");
export const viewport = rootViewport;

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
