export function WebPageSchema({ path, title }: { path: string; title: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          url: `https://www.getintheanswer.com${path}`,
          isPartOf: { "@id": "https://www.getintheanswer.com/#website" },
        }),
      }}
    />
  );
}
