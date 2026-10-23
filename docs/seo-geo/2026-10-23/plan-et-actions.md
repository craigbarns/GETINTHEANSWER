# Plan priorisé et actions du propriétaire
Date : 23 octobre 2026. À lire avec l’audit avant correction. Les efforts sont des estimations de travail, aucun gain de trafic n’est promis.

## Vague 1 — gains rapides autorisés, moins d’une journée
| Ordre | Changement | Effet attendu | Effort |
|---|---|---|---|
| 1 | Retirer les 36 gains non prouvés, corriger l’affirmation du guide schema et identifier les cartes Agence comme illustrations. Clarifier le bloc français et son total/extrait. | Cohérence des preuves et meilleure compréhension. | 1–2 h |
| 2 | Raccourcir les titres/descriptions, en tenant compte du suffixe de marque ; garder les URL et canonical bilingues. | Résultats plus lisibles et cibles explicites. | 2–3 h |
| 3 | Sitemap : dates connues seulement, dates des relevés pour les résultats, ajout contact en/fr ; compléter les exclusions robots de façon cohérente. | Métadonnées fidèles et découverte des conversions. | 1 h |
| 4 | Compléter llms.txt avec étude/méthode existante, exemples, offres et pages françaises, en dérivant les prix du code. Tracer l’intention de soumission du hero sans nom d’entreprise ni email. | Navigation et mesure du passage vers l’analyse gratuite. | 1 h |

Un commit par changement logique, après lint, build webpack et toute la suite Python au vert. Branche dédiée et PR de revue. Les gros chantiers ci-dessous ne sont pas lancés dans cette vague.

## Vague 2 — fond, une à deux semaines
| Ordre | Action | Impact visé / condition | Effort |
|---|---|---|---|
| 1 | Rendre les mesures auditables : réponses brutes, sources, modèles et paramètres, erreurs conservées ; distinguer modèle via API et assistant grand public. Définir la déduplication des entreprises et relancer des relevés. | Solidité de l’actif de données ; coût fournisseur et périmètre à arrêter avant exécution. | 2–4 jours |
| 2 | Étude : méthodologie dédiée, licence de réutilisation décidée par le propriétaire, CSV/JSON, sous-ensembles par métier/ville, Dataset/distribution, figures exportables et attribution. | Faciliter la vérification et les citations, sans transformer des mentions par requête en entreprises nationales uniques. | 2–4 jours |
| 3 | Réécrire les débuts des quatre guides, ajouter des sources primaires datées, dates visibles et limites ; publier 3–5 guides français substantiels plutôt que traduire des pages américaines. | Répondre aux intentions de recherche vérifiées. | 2–4 jours |
| 4 | Pages ville : synthèse datée avant le CTA, tableau par moteur, liens de métiers/villes motivés par les données ; garder les pages sans mesure en noindex. | Information propre immédiatement utile. | 1–2 jours |
| 5 | À propos, signature et sameAs à partir des informations approuvées ; rattacher la marque à WEMADE. | Entité identifiable, sans auteur/profil inventé. | 0,5–1 journée après réponse |
| 6 | IndexNow : clé publiée sur le même hôte, envoi des URL réellement changées après succès du déploiement ; contrôle des réponses et déduplication. | Découverte plus rapide par les moteurs participants ; aucune garantie d’indexation ou de citation par ChatGPT. | 0,5–1 journée |
| 7 | Protocole mensuel de visibilité de GetInTheAnswer : requêtes fixes en/fr sur 4 modèles, paramètres, date, réponse et sources conservés, mention de marque contrôlée, suivi séparé des citations de sources. | Mesurer le produit sur lui-même sans confondre variabilité et progression. | 1 journée puis exécution planifiée |

Les trois nouveaux outils et les pages comparatives viennent **après** les preuves et la mesure. Commencer par un seul outil (générateur de llms.txt ou lecteur public de robots.txt), avec une utilité vérifiable et des protections réseau adaptées ; effort 2–4 jours. Le vérificateur IA « en une question » exige un vrai appel fournisseur et l’affichage du périmètre ; ne pas afficher un score simulé.

## Vague 3 — autorité hors site
1. Profils officiels de la marque et du responsable, cohérents avec les mentions légales ; aucune URL ajoutée à sameAs sans vérification.
2. Présenter l’étude reproductible à des associations professionnelles locales, agences et publications du secteur, avec données réutilisables et limites.
3. Comparaisons honnêtes : critères observables, prix et fonctionnalités sourcés et datés, différences entre API et interfaces publiques.
4. Suivre domaines référents, citations et analyses gratuites issues des visites ; ne pas acheter ni promettre des liens ou mentions.

## Actions qui reviennent à Gregory
- Confirmer le responsable à présenter, son rôle, une biographie factuelle courte, les profils officiels de WEMADE/GetInTheAnswer et ceux du responsable. Les mentions légales sont une preuve existante, pas une biographie inventée.
- Chez le gestionnaire du domaine, remplacer la redirection temporaire du domaine nu par une **301 vers https://www.getintheanswer.com**, en conservant chemins et paramètres. Le serveur en amont répond Apache : une modification de Next.js ne suffit pas à prouver que cette redirection changera.
- **Search Console existe déjà** : ouvrir la propriété de domaine, vérifier/soumettre `https://www.getintheanswer.com/sitemap.xml`, inspecter accueil, étude et une ville, consulter Pages et Performances par pays, requête et page. Exporter 90 jours de performances pour prioriser. Une erreur du connecteur n’implique pas une propriété absente.
- **Bing Webmaster Tools** : importer la propriété depuis Search Console si autorisé, sinon vérifier le domaine avec la méthode proposée ; soumettre le sitemap, contrôler l’exploration et préparer la propriété pour IndexNow. L’absence d’authentification du connecteur ne prouve pas qu’aucun compte Bing n’existe.
- **GA4** : ouvrir GETINTHEANSWER, tester avec consentement accepté et DebugView. Marquer `generate_lead` comme événement clé après vérification qu’il correspond à un rapport effectivement créé ; garder `scan_completed` comme diagnostic pour éviter de compter deux conversions. Contrôler `scan_started`, échecs et `begin_checkout`. Les analyses refusant les cookies ne seront pas présentes dans GA4.
- Débloquer l’accès aux données si souhaité : utiliser directement les interfaces Google/export CSV ou le compte/licence Supermetrics approprié. L’erreur rencontrée est LICENSE_NOT_FOUND ; aucun achat n’a été engagé.
- Décider la licence de réutilisation des exports et le budget mensuel des appels IA ; vérifier les secrets et exécutions du workflow de rafraîchissement avant toute relance payante.

## Tableau de mesure mensuel
Indicateurs : impressions/clics/CTR Search Console par langue et type de page ; indexation des URL importantes ; sessions organiques GA4 après consentement ; `generate_lead` organiques et passage intention → début → rapport créé ; coût et erreurs par relevé ; présence/citation de la marque par requête, modèle et langue. Reporter les valeurs brutes et dates. Ne pas assimiler les mentions d’un modèle à des recommandations garanties dans toutes les interfaces.

Sources primaires vérifiées le 23 octobre 2026 : [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [sitemaps et lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [IndexNow](https://www.indexnow.org/documentation).

