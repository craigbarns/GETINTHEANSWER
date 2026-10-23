import type { Locale } from "@/lib/i18n";
import type { Recommendation, SiteCheck } from "@/lib/seenbyai";

/** Translate the known legacy API templates without replacing custom advice. */
export function localizeRecommendation(item: Recommendation, locale: Locale): Recommendation {
  if (locale !== "fr") return item;
  const faq = item.description.match(/^Answer the questions customers actually ask about ([\s\S]+) and the areas you serve around ([\s\S]+)\.$/);
  if (item.title === "Create a local FAQ page" && faq) {
    return { ...item, title: "Créer une page FAQ locale", description: `Répondez aux questions de vos clients sur ${faq[1]} et les secteurs desservis autour de ${faq[2]}.` };
  }
  if (item.title === "Add LocalBusiness structured data" && item.description === "Mark up your business name, address, phone number and services so AI engines can verify this information.") {
    return { ...item, title: "Ajouter les données structurées LocalBusiness", description: "Balisez le nom de votre entreprise, son adresse, son téléphone et ses prestations pour rendre ces informations lisibles par les IA." };
  }
  const services = item.description.match(/^Describe your ([\s\S]+) specialties, proof of expertise and local projects completed in ([\s\S]+)\.$/);
  if (item.title === "Strengthen your Services page" && services) {
    return { ...item, title: "Enrichir votre page Prestations", description: `Présentez vos spécialités en ${services[1]}, vos références et vos réalisations à ${services[2]}.` };
  }
  return item;
}

export function localizeSiteCheck(check: SiteCheck, city: string, locale: Locale): SiteCheck {
  if (locale !== "fr") return check;
  const copy: Record<string, { label: string; yes: string; no: string }> = {
    local_business_schema: { label: "Données structurées de l’entreprise", yes: "Un balisage d’entreprise locale a été détecté sur la page.", no: "Aucun balisage d’entreprise locale n’a été détecté sur la page analysée." },
    city_mentioned: { label: `Mention de votre ville (${city})`, yes: `La ville « ${city} » est mentionnée dans le texte de la page.`, no: `La ville « ${city} » n’a pas été repérée dans le texte de la page.` },
    faq_content: { label: "FAQ et contenu en questions-réponses", yes: "Une FAQ ou du contenu en questions-réponses a été repéré.", no: "Aucune FAQ ni contenu en questions-réponses n’a été repéré sur la page." },
    nap_visible: { label: "Coordonnées : téléphone et adresse", yes: "Un numéro de téléphone et une adresse sont visibles sur la page.", no: "Le téléphone ou l’adresse manque dans les éléments repérés sur la page." },
    services_described: { label: "Présentation de vos prestations", yes: "Des prestations renseignées dans votre profil sont mentionnées dans le texte de la page.", no: "Les prestations renseignées dans votre profil n’ont pas été repérées dans le texte de la page." },
  };
  const translated = copy[check.key];
  return translated ? { ...check, label: translated.label, detail: check.passed ? translated.yes : translated.no } : check;
}
