import Link from "next/link";

import { localizedAlternates } from "@/lib/i18n";

export type ChangelogEntry = {
  date: string;
  title: string;
  body: string;
  items: string[];
  links?: [string, string][];
};

const COPY = {
  en: {
    title: "What we've built",
    intro:
      "GetInTheAnswer is a one-person company shipping in public. This page lists what changed, newest first — the same transparency we apply to our methodology and our study.",
    entries: [
      {
        date: "November 7, 2026",
        title: "Free AEO audit — the audit an AI agent would run on your site",
        body:
          "We audited our own website the way a citation engine would: 16 technical checks, 6 content-quality dimensions. Ours scored B- (missing JSON-LD on two pages, no RSS feed). So we shipped the audit as a free public tool.",
        items: [
          "16 deterministic checks across up to 5 pages: JSON-LD, robots.txt AI-crawler rules, FAQ blocks, canonical tags, llms.txt, RSS, dates…",
          "6 content dimensions (answer readiness, quotability, evidence density, entity clarity, freshness, structure) scored by AI, with a deterministic fallback when the model is unavailable",
          "Final score 50/50 weighted, mapped to an A-F grade, with a prioritized fix list and impact labels",
          "Honest labeling throughout: quality scores are research-derived heuristics, not proven causality",
        ],
        links: [["/tools/aeo-audit", "Run the free audit"]],
      },
      {
        date: "November 7, 2026",
        title: "AI Shopping Intelligence — waitlist opened",
        body:
          "The same platform that measures AI visibility for local businesses is opening a vertical for online stores: which of your products ChatGPT, Gemini and Perplexity recommend when shoppers ask what to buy, and which competitors they place in front of you.",
        items: [
          "Product-level visibility tracking (SKU, position, share of recommendations)",
          "Catalog import from Shopify, CSV or Merchant Center feed",
          "Fix and re-measure loop: Product/Offer schema audit, then measure again",
          "Waitlist open — the audit itself ships after the demand validation window",
        ],
        links: [["/ai-shopping", "Join the waitlist"]],
      },
      {
        date: "November 6, 2026",
        title: "MCP connector — ask Claude for your AI visibility score",
        body:
          "Our API is now a remote MCP server. Connect it once in Claude Desktop or Cursor and ask about a client report in plain language — the first MCP server in the SMB AI-visibility category.",
        items: [
          "Three tools: get_client_report, get_ai_agent_activity, get_score_history",
          "Streamable HTTP at /mcp — zero installation, remote connectors supported",
          "Share of Voice dashboard: your brand vs competitors in AI answers, EN + FR",
        ],
        links: [["/agency", "See the agency offer"]],
      },
      {
        date: "November 6, 2026",
        title: "AI Agent Analytics — see AI crawlers and AI-chat visitors",
        body:
          "Every visit from a known AI crawler or chat referral is now detected and logged, so you can see whether GPTBot, ClaudeBot or PerplexityBot actually read your site — and whether visitors arrive from ChatGPT or Perplexity.",
        items: [
          "Detection of 15+ AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Meta, Apple…)",
          "Referrer engine detection on chatgpt.com, perplexity.ai and others",
          "Summary endpoint feeds the dashboard and the MCP tools",
        ],
      },
      {
        date: "November 5, 2026",
        title: "Clearer positioning and pricing",
        body:
          "The homepage now leads with the question that matters — is ChatGPT recommending you? — and every plan is named: free scan, Pro at $29/month, AI Growth at 990 €/month done-for-you.",
        items: [
          "Bilingual EN/FR site with separated currencies per locale",
          "Live directory presence: Geocitely (listed), Geodeck and The AI Search Directory (in review)",
          "Public methodology study with measured data",
        ],
        links: [["/pricing", "See pricing"], ["/study", "Read the study"]],
      },
    ] as ChangelogEntry[],
  },
  fr: {
    title: "Ce qu'on a construit",
    intro:
      "GetInTheAnswer est une entreprise d'une personne qui construit en public. Cette page liste ce qui change, du plus récent au plus ancien — la même transparence que dans notre méthodologie et notre étude.",
    entries: [
      {
        date: "7 novembre 2026",
        title: "Audit AEO gratuit — l'audit qu'un agent IA ferait sur votre site",
        body:
          "Nous avons audité notre propre site comme le ferait un moteur de citations : 16 vérifications techniques, 6 dimensions de qualité de contenu. Résultat chez nous : B- (JSON-LD absent sur deux pages, pas de flux RSS). Alors on a transformé cet audit en outil gratuit et public.",
        items: [
          "16 vérifications déterministes sur 5 pages : JSON-LD, règles robots.txt pour les crawlers IA, blocs FAQ, canonical, llms.txt, RSS, dates…",
          "6 dimensions de contenu (capacité à répondre, citabilité, densité de preuves, clarté de l'entité, fraîcheur, structure) notées par IA, avec un repli déterministe si le modèle est indisponible",
          "Score final pondéré 50/50, note de A à F, corrections priorisées avec leur impact",
          "Étiquetage honnête partout : les scores de qualité sont des heuristiques dérivées de recherche, pas des causalités prouvées",
        ],
        links: [["/tools/aeo-audit", "Lancer l'audit gratuit"]],
      },
      {
        date: "7 novembre 2026",
        title: "Shopping Intelligence IA — liste d'attente ouverte",
        body:
          "La plateforme qui mesure la visibilité IA des entreprises locales ouvre une verticale pour les boutiques en ligne : quels produits ChatGPT, Gemini et Perplexity recommandent quand un client demande quoi acheter, et quels concurrents passent devant vous.",
        items: [
          "Suivi de visibilité par produit (SKU, position, part des recommandations)",
          "Import du catalogue depuis Shopify, CSV ou flux Merchant Center",
          "Boucle corriger et re-mesurer : audit schema Product/Offer puis nouvelle mesure",
          "Liste d'attente ouverte — l'audit sort après la fenêtre de validation de la demande",
        ],
        links: [["/ai-shopping", "Rejoindre la liste d'attente"]],
      },
      {
        date: "6 novembre 2026",
        title: "Connecteur MCP — demandez votre score à Claude",
        body:
          "Notre API est désormais un serveur MCP distant. Connectez-le une fois dans Claude Desktop ou Cursor et posez vos questions en langage naturel — le premier serveur MCP de la catégorie visibilité IA pour PME.",
        items: [
          "Trois outils : get_client_report, get_ai_agent_activity, get_score_history",
          "Streamable HTTP sur /mcp — zéro installation, connecteurs distants compatibles",
          "Tableau de bord Share of Voice : votre marque face aux concurrents dans les réponses IA, EN + FR",
        ],
        links: [["/agency", "Voir l'offre agence"]],
      },
      {
        date: "6 novembre 2026",
        title: "AI Agent Analytics — voyez les crawlers IA et les visiteurs venus des chats",
        body:
          "Chaque visite d'un crawler IA connu ou chaque recommandation venant d'un chat est détectée et enregistrée : vous savez si GPTBot, ClaudeBot ou PerplexityBot lisent vraiment votre site, et si des clients arrivent depuis ChatGPT ou Perplexity.",
        items: [
          "Détection de plus de 15 crawlers IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Meta, Apple…)",
          "Détection des sources sur chatgpt.com, perplexity.ai et autres",
          "Un endpoint de synthèse alimente le dashboard et les outils MCP",
        ],
      },
      {
        date: "5 novembre 2026",
        title: "Positionnement et tarifs clarifiés",
        body:
          "La page d'accueil mène maintenant avec la question qui compte — ChatGPT vous recommande-t-il ? — et chaque offre est nommée : scan gratuit, Pro à 29 $/mois, AI Growth à 990 €/mois fait pour vous.",
        items: [
          "Site bilingue EN/FR avec devise séparée par langue",
          "Présence annuaires : Geocitely (listé), Geodeck et The AI Search Directory (en relecture)",
          "Étude de méthodologie publique avec données mesurées",
        ],
        links: [["/pricing", "Voir les tarifs"], ["/study", "Lire l'étude"]],
      },
    ] as ChangelogEntry[],
  },
};

export function ChangelogContent({ locale }: { locale: "en" | "fr" }) {
  const copy = COPY[locale];
  return (
    <div>
      <h1 className="max-w-2xl text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">{copy.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.intro}</p>
      <div className="mt-12 space-y-10">
        {copy.entries.map((entry) => (
          <article className="rounded-[1.75rem] border border-foreground/10 bg-white p-7 shadow-sm sm:p-9" key={entry.title}>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">{entry.date}</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">{entry.title}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{entry.body}</p>
            <ul className="mt-4 space-y-2 text-sm leading-6">
              {entry.items.map((item) => (
                <li className="flex gap-2.5" key={item}>
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {entry.links && (
              <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                {entry.links.map(([href, label]) => (
                  <Link className="underline decoration-lime-500 decoration-2 underline-offset-2" href={locale === "fr" ? `/fr${href}` : href} key={href}>
                    {label} →
                  </Link>
                ))}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
