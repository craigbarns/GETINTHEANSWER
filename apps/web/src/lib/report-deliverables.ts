import type { Locale } from "@/lib/i18n";
import type { DashboardData } from "@/lib/seenbyai";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const plain = (value: string) => value.replace(/<[^>]*>/g, "").replace(/(?:https?:\/\/|www\.)\S+/gi, "").replace(/\s+/g, " ").trim();

export function buildReportDeliverables(data: DashboardData, locale: Locale) {
  if (!data.unlocked || data.mode !== "live") return null;
  const fr = locale === "fr";
  const name = plain(data.company_name);
  const city = plain(data.city);
  const industry = plain(data.industry);
  const service = plain(data.services || data.industry);
  const base = fr ? `${name}, entreprise de ${industry} à ${city}. Prestations : ${service}. Contactez-nous pour préciser votre besoin et vérifier les disponibilités.`
    : `${name} provides ${industry} services in ${city}. Services: ${service}. Contact us to discuss your needs and confirm availability.`;
  const googleDescription = base.length <= 750 ? base : `${base.slice(0, 747).replace(/\s+\S*$/, "")}…`;
  const schema = {
    "@context": "https://schema.org", "@type": "LocalBusiness",
    name: data.company_name, url: data.website_url,
    address: { "@type": "PostalAddress", addressLocality: data.city },
    areaServed: data.city, description: googleDescription,
  };
  const schemaCode = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2).replace(/</g, "\\u003c")}\n</script>`;
  const sourceQuestions = [...new Set(data.queries.map((row) => row.query.trim()).filter(Boolean))];
  const used = new Set<string>();
  const faq = sourceQuestions.flatMap((sourceQuestion) => {
    const text = sourceQuestion.toLocaleLowerCase();
    const intent = /urgence|urgent|rapid|emergency|quick/.test(text) ? "urgency"
      : /prix|tarif|coût|combien|cost|price|budget/.test(text) ? "price"
      : /compar|meilleur|best|top|rated|noté|fiabl|reliable|avis|review/.test(text) ? "choice"
      : /near|près|around|secteur|zone|local|where|proche/.test(text) ? "area" : "services";
    if (used.has(intent)) return [];
    used.add(intent);
    const copy = fr ? {
      urgency: { question: `Comment contacter ${name} pour une demande urgente à ${city} ?`, answer: `Pour une demande urgente concernant ${service} à ${city}, contactez directement ${name} afin de vérifier les disponibilités et les délais possibles avant toute intervention.` },
      price: { question: `Comment connaître le tarif des prestations de ${name} ?`, answer: `Le montant dépend de votre besoin précis. Présentez votre demande concernant ${service} à ${name} pour connaître les conditions et le périmètre des prestations proposées à ${city}.` },
      choice: { question: `Comment choisir un prestataire de ${industry} à ${city} ?`, answer: `Comparez les prestations, les références vérifiables et les conditions d’intervention. ${name} propose ${service} à ${city}. Demandez les éléments correspondant à votre projet avant de choisir.` },
      area: { question: `${name} intervient-elle dans mon secteur à ${city} ?`, answer: `Les prestations indiquées concernent ${city}. Contactez ${name} pour confirmer que votre adresse et votre besoin en ${service} correspondent au périmètre d’intervention.` },
      services: { question: `Quelles prestations propose ${name} à ${city} ?`, answer: `${name} propose ${service} à ${city}. Précisez votre besoin pour confirmer les prestations adaptées à votre projet et les conditions de réalisation.` },
    } : {
      urgency: { question: `How can I contact ${name} about an urgent request in ${city}?`, answer: `Contact ${name} directly about ${service} in ${city} to confirm availability and possible response times before arranging any work.` },
      price: { question: `How can I find out the cost of ${name}’s services?`, answer: `Costs depend on your specific needs. Describe your request for ${service} to ${name} to confirm the scope and terms of services in ${city}.` },
      choice: { question: `How should I choose a ${industry} provider in ${city}?`, answer: `Compare services, verifiable references and the terms of the work. ${name} offers ${service} in ${city}. Ask for the information relevant to your project before choosing.` },
      area: { question: `Does ${name} serve my area in ${city}?`, answer: `The listed services concern ${city}. Contact ${name} to confirm whether your address and needs for ${service} fall within its service area.` },
      services: { question: `What services does ${name} offer in ${city}?`, answer: `${name} offers ${service} in ${city}. Describe your requirements to confirm which services and terms fit your project.` },
    };
    return [{ ...copy[intent], sourceQuestion }];
  }).slice(0, 5);
  const faqHtml = faq.length ? `<section>\n<h1>${escapeHtml(fr ? `Questions fréquentes — ${name}` : `Frequently asked questions — ${name}`)}</h1>\n${faq.map((item) => `<h2>${escapeHtml(item.question)}</h2>\n<p>${escapeHtml(item.answer)}</p>`).join("\n")}\n</section>` : "";
  return { faqHtml, schemaCode, googleDescription, sourceQuestions, faq };
}
