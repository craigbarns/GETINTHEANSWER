import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";

export const metadata = rootMetadata("fr");
export const viewport = rootViewport;

export default function FrenchRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="fr">{children}</RootDocument>;
}
