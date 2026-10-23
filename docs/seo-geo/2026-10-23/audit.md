# Audit SEO et GEO — GetInTheAnswer
Date : 23 octobre 2026. Référence du dépôt : `c5c75da`. Audit réalisé avant toute modification des sources.

## Périmètre et conclusion
Crawl des **271 URL du sitemap**, plus 12 contrôles (contact, tableaux de bord, anciennes URL, erreurs 404, robots et llms.txt). Vérification des sources Next.js et de 240 fichiers d’analyses. Le dépôt contient **12 métiers et 20 villes**, et non 14 et 22 : les 240 combinaisons disposent de données. Tous les relevés datent du **6 septembre 2026** : 960 réponses de moteurs et 2 528 entrées de noms, additionnées par recherche, pas 2 528 entreprises uniques au niveau national.

La base technique est saine et les pages sont rapides. Les priorités sont les affirmations non étayées, la fidélité des dates, la présentation des preuves et les métadonnées. Rien ne permet encore d’attribuer le faible trafic à une cause unique.

## Constats techniques
| Constat et preuve | Impact | Effort estimé |
|---|---|---|
| Le site public canonique est `https://www.getintheanswer.com`. Le domaine nu répond **302** vers www (en-têtes conservés dans les contrôles HTTP). Le repli de `src/lib/site.ts:1` utilise pourtant le domaine nu. | Moyen : cohérence de l’origine ; faire passer la redirection du domaine en 301 chez l’opérateur qui la sert. | 15–30 min de code ; réglage hébergeur à confirmer. |
| Les paires bilingues rendent des canonical absolus, des hreflang réciproques en/fr et x-default corrects. Les pages SEO uniquement anglaises n’annoncent pas de traduction inexistante. `src/lib/i18n.ts` et HTML du crawl. | Bon état ; conserver ce comportement. | Aucun changement. |
| Le sitemap contient 271 URL répondant 200, sans noindex ni doublon de titre/description entre ses URL. Les 240 pages ville sont à 3 clics, les guides à 2 ; aucune URL du sitemap orpheline dans le graphe parcouru. `crawl.json`. | Bon état ; pas besoin de créer plus de pages satellites. | Aucun correctif structurel urgent. |
| **267 dates lastmod** correspondent au déploiement du 23 octobre, même pour les analyses du 6 septembre. `app/sitemap.ts:9`, `lastModified: now`, capture `sitemap.xml`. | Moyen : signal de fraîcheur peu fidèle. Utiliser la date de mesure pour les résultats ; omettre les dates inconnues. | 1–2 h. |
| `/contact` et `/fr/contact` existent et sont indexables mais absentes du sitemap. Les quatre autres paires publiques y figurent. | Faible à moyen : découverte moins explicite de la conversion Agence/490. | 15 min. |
| **263/271 titres > 60 caractères** et **18 descriptions > 155**, marque ajoutée par le template comprise. Exemple Dallas : 102 caractères ; étude : 97. `crawl.json`, templates métier/ville, `root-document.tsx`. Ces limites sont celles du brief, pas une garantie de troncature ou de classement. | Moyen : lisibilité des résultats et ciblage. | 2–3 h. |
| Anglais déclaré sur les pages anglaises et français sur /fr ; le bloc français de Dallas explique maladroitement la traduction et son repli peut montrer une question anglaise non traduite. `home-page.tsx:27–41, 501–507`. | Moyen pour la compréhension et la conversion française. | 30 min. |
| Robots ouvre les robots IA cités ; dashboard/API exclus, mais pas `/fr/dashboard`. Les dashboards sont noindex dans les sources et redirigent vers l’analyse en l’absence de rapport. 404 de premier niveau correcte ; une URL métier/ville invalide rend 404 sans document complet. Ancien faux guide redirigé en permanence vers /study. | Faible ; harmoniser robots, conserver les vrais statuts 404 et la redirection existante. | 15–45 min. |

## Performance mobile
Lighthouse **13.5.0**, mesures du 23 octobre, émulation mobile et réseau simulé ; un passage exploratoire par URL, sans consentement Analytics accordé. Rapports JSON/HTML conservés. Les trois passages initiaux ont tourné en parallèle : ces valeurs sont un diagnostic, pas une médiane de référence.

| URL | Score performance | LCP | CLS | TBT, distinct de l’INP | JavaScript transféré |
|---|---:|---:|---:|---:|---:|
| / | 100 | 1,76 s | 0 | 8 ms | 173,4 Kio |
| /ai-seo-for/plumbers/dallas-tx | 99 | 1,70 s | 0 | 55 ms | 171,6 Kio |
| /guides/get-recommended-by-chatgpt | 100 | 1,77 s | 0 | 14,5 ms | 175,3 Kio |

Les mesures respectent les cibles LCP/CLS lors de ces passages. **INP réel non disponible** : aucune donnée terrain renvoyée par PageSpeed sur les URL contrôlées. Un test Lighthouse de navigation et son TBT ne valident pas INP < 200 ms. Impact immédiat d’une optimisation JS : faible au vu de ces résultats ; effort 0,5–1 journée, après les sujets de preuve. Voir [la distinction laboratoire/terrain de web.dev](https://web.dev/articles/lab-and-field-data-differences).

## Données structurées
Les JSON-LD des 271 URL se parsèment sans erreur. Contrôle de structure et de concordance avec les pages et les prix ; **pas de validation certifiée via Rich Results Test ou Schema Markup Validator**.

| Type contrôlé | Constat / preuve | Impact et effort |
|---|---|---|
| Organization | Présent sur les deux accueils : nom, URL, logo. Pas de sameAs ni de lien explicite vers l’éditeur WEMADE dans ce nœud. Les mentions légales identifient déjà WEMADE et Gregory Baranes. | Moyen, 1–2 h après confirmation des profils et de la présentation. |
| WebSite | Présent, URL et langue cohérentes sur les deux accueils. | Sain. |
| SoftwareApplication / Offer | Gratuit et Pro à 29 EUR/USD présents, sans faux AggregateRating. Les offres Agence et prise en charge ne sont pas décrites dans ces offres structurées. | Faible à moyen, 1 h ; conserver les prix dérivés de `pricing.ts`. |
| FAQPage | 255 nœuds, avec questions/réponses visibles sur les pages concernées ; les FAQ métier sont largement reprises sur les villes. | Faible : ne pas ajouter des FAQ identiques partout. Google a retiré l’affichage enrichi FAQ en mai 2026, donc aucun gain d’extrait FAQ à promettre. |
| BreadcrumbList | 261 nœuds : positions et chemins cohérents dans les échantillons métier, ville, guides, outil et rapport. Pas sur l’étude. | Faible, 30 min pour l’étude si utile à la navigation visible. |
| Article | 257 nœuds. Les 252 pages métier/ville n’ont pas de datePublished/dateModified ; les guides ont une organisation comme auteur et dateModified=datePublished, sans signature ni date visibles. | Moyen, 1–2 h pour les dates de mesure vérifiables ; auteur humain à confirmer. |
| Dataset | **Déjà présent sur /study**, avec description, créateur, date et méthode. Pas de distribution CSV/JSON, licence de réutilisation ni granularité modèle/source dans les données. | Fort pour une étude citable, 2–4 jours avec provenance et droits clarifiés. |

Références : [Google Dataset](https://developers.google.com/search/docs/appearance/structured-data/dataset), [Schema.org Dataset](https://schema.org/Dataset), [retrait du résultat enrichi FAQ, changelog Google](https://developers.google.com/search/updates#june-2026).

## Maillage, contenu et GEO
| Constat / preuve | Impact | Effort |
|---|---|---|
| Les pages ville commencent par un slogan générique ; la question et les résultats datés viennent plus bas. Les cinq « autres villes » sont les premières du catalogue, pas les plus proches. Pas de comparaison croisée de métiers au niveau ville. `ai-seo-for/[slug]/[city]/page.tsx:75–102,158,219–285,340`. | Moyen : exposer la réponse mesurée dès le début et améliorer la pertinence des liens. | 1–2 jours ; la proximité réelle nécessite des coordonnées vérifiées. |
| Le guide GEO définit le sujet immédiatement, l’étude expose son périmètre et un tableau par moteur. Le guide ChatGPT et l’accueil commencent par le problème commercial, pas une réponse directe. Les guides ne citent aucune source externe ni date visible. `lib/guides.ts`, HTML des premières phrases. | Moyen à fort : passages moins faciles à citer et affirmations difficiles à vérifier. | 2–4 jours pour les quatre guides. |
| **36 promesses de gains** chiffrés (+10 % à +30 %) dans `lib/industries.ts`, sans mesure permettant de les justifier. Le guide schema affirme aussi une corrélation dans « our scans » alors que les données ne mesurent pas le balisage des sites. | Fort : contredit la règle de preuve et affaiblit la confiance. | 1 h : supprimer les gains et remplacer l’affirmation par une limite explicite. |
| L’accueil montre trois noms par moteur mais annonce 11 entreprises sur Dallas ; les listes affichées n’en contiennent que neuf distinctes. Les variantes Baker Brothers/Roto-Rooter restent séparées dans les données. `home-page.tsx:518,529`, `plumbers__dallas-tx.json`. | Moyen : le total n’est pas celui de l’extrait ; préciser la portée ou afficher tous les noms. | 30–60 min. |
| /llms.txt inclut les relevés datés, guides, outil et analyse, mais manque l’étude en lien, le rapport d’exemple, les prix et les pages /fr. Pas de page méthodologie autonome ni export. `app/llms.txt/route.ts`. | Faible pour Google, utile pour les lecteurs et systèmes qui consomment ce fichier. | 1 h pour les liens existants ; méthodologie/export en vague suivante. |
| Les relevés enregistrent des noms, la question et la date, **pas le texte intégral, les URL citées, les modèles, les paramètres ou les erreurs**. Le script utilise des modèles via OpenRouter : ce n’est pas une mesure des interfaces grand public elles-mêmes. Le workflow mensuel existe, mais les fichiers n’ont pas changé depuis septembre. `scripts/generate_city_scans.py:48–54,215–245`, workflow et historique Git. | Fort : reproductibilité limitée, assertions « réelles réponses ChatGPT » à nuancer. | 2–4 jours puis nouvelle campagne de mesures, coût fournisseur à estimer. |

Google indique qu’aucun fichier IA ni balisage spécial n’est requis pour ses fonctions IA et que llms.txt n’influence pas ses classements : priorité aux données propres, au contenu utile et au maillage. [Documentation Google sur les fonctions IA](https://developers.google.com/search/docs/appearance/ai-features), [précision de juin 2026](https://developers.google.com/search/updates#june-2026). Cela ne démontre pas l’effet de llms.txt chez d’autres fournisseurs.

## Entité, confiance et mesure
- **Identité existante** : /legal nomme WEMADE (SASU), Gregory Baranes comme directeur de publication, adresse, immatriculation et contact. La marque publique est GetInTheAnswer ; SeenByAI reste surtout dans les identifiants techniques. **À propos et méthodologie autonome répondent 404** ; profils externes et biographie non établis. Impact moyen/fort ; 0,5–1 journée après informations validées.
- Les cartes Agence montrent des entreprises et des gains d’exemple sans mention assez explicite de leur caractère fictif. Impact confiance moyen ; 15–30 min pour les identifier comme illustrations.
- **GA4 existe déjà** : identifiant public `G-0GXB9TK0XH` trouvé dans le bundle déployé ; consentement préalable, événements `scan_started`, `scan_failed`, `scan_completed`, `generate_lead`, `begin_checkout` dans le code. Le formulaire du hero ne trace pas sa soumission d’intention. Impact moyen ; 30 min de code et vérification DebugView.
- La propriété Search Console `sc-domain:getintheanswer.com` et la propriété GA4 `GETINTHEANSWER` sont accessibles en découverte. Les requêtes de données échouent avec **LICENSE_NOT_FOUND** dans Supermetrics ; le navigateur a également échoué au chargement de sa politique de requêtes. **Trafic, positions actuelles, indexation effective, conversions et volumes de mots-clés non mesurés**. Aucun chiffre n’est déduit de ces échecs.
- Requêtes de départ pertinentes à tester, sans volume inventé : AI visibility checker, is my business on ChatGPT, how to get recommended by ChatGPT, local business GEO, les couples métier/ville ; visibilité IA entreprise, être recommandé par ChatGPT, GEO référencement IA. L’ordre éditorial doit être ajusté après un export Search Console et, si disponible, Keyword Planner.

