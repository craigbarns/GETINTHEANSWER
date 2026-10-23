# Validation des gains rapides

L’audit de production, présenté avant les modifications, se trouve dans [audit.md](audit.md). Le [plan priorisé](plan-et-actions.md) distingue les corrections de cette branche des chantiers suivants et des actions du propriétaire. Les [mesures avant/après](measurements.json) contiennent uniquement des valeurs observées.

## Changements livrés

1. Suppression des 36 gains chiffrés sans preuve dans les fiches métier ; retrait de l’affirmation de corrélation non mesurée dans le guide schema. Les exemples Agence et les exemples de plans sont identifiés comme illustrations.
2. Accueil anglais : tous les noms du relevé de Dallas sont affichés, et le total décrit des noms enregistrés plutôt que des entreprises juridiques uniques. La méthode de l’étude précise la portée API et les limites des archives.
3. Accueil français : le relevé américain est remplacé par une présentation française à Marseille. Ce bloc est explicitement illustratif : il explique les vérifications, sans inventer d’entreprises, de réponses, de scores ou de date de mesure française. Ses liens restent sous /fr.
4. Titres et descriptions raccourcis, canonical normalisés sur l’origine www par défaut, ajout du contact en/fr au sitemap. Dates de mesure réelles sur les villes ; date de modification éditoriale distincte sur l’étude ; dates inconnues omises. Les URL existantes sont conservées.
5. /llms.txt décrit la portée des mesures et relie étude, méthode, exemple de rapport, offres et pages françaises ; les prix viennent de pricing.ts.
6. Le formulaire du hero émet scan_intent avec la langue et le point d’entrée, sans nom d’entreprise ni email dans les paramètres. Les événements de génération de rapport déjà présents sont conservés.

## Vérifications

Avant chaque commit de code :

```sh
cd apps/web
npm run lint
npx next build --webpack
cd ../..
python3 -m unittest discover -s tests
```

Les tests Python ont utilisé un environnement Python 3.13 isolé, avec les dépendances de apps/api/requirements.txt installées : **36 tests passent**. Lint et build passent également. Aucun test ad hoc n’a été ajouté pour figer du texte ou reproduire son implémentation.

Inspection du HTML/XML réellement produit par le build :

- **273 URL** dans le sitemap, contre 271 avant l’ajout des deux pages contact.
- **0 titre de plus de 60 caractères**, contre 263 avant ; maximum observé : 59.
- **0 description de plus de 155 caractères**, contre 18 avant ; maximum observé : 151.
- Canonical absolus, langues et concordance des hreflang HTML/sitemap vérifiés sur les 273 pages ; aucune page noindex dans le sitemap.
- Dates des 240 pages ville comparées à leurs fichiers de mesure ; toutes correspondent aux relevés du 6 septembre 2026.
- Le texte visible de /fr contient la question à Marseille et la mention illustratif ; il ne contient plus Dallas, James Armstrong, Baker Brothers, Roto-Rooter ou la mention ambiguë de question anglaise. L’accueil anglais conserve les noms de son relevé réel.
- Les **261 liens** du llms.txt généré ciblent des pages publiques existantes ; liens français, ancre méthodologie et prix EUR/USD contrôlés.

Les rapports Lighthouse de production sont des passages exploratoires mobiles ; les mesures et leurs limites sont dans l’audit. Elles ne constituent pas une mesure d’INP réel ou une garantie de classement.

## Vérifications restant à faire dans les services

Les nombres de visites, positions, conversions et volumes de recherche n’ont pas pu être lus : Supermetrics découvre bien les propriétés Google mais retourne LICENSE_NOT_FOUND sur les données. Aucun chiffre n’a été substitué à ces résultats absents.

La réception des événements dans GA4 DebugView, les conversions réelles, un paiement Stripe et de nouveaux appels aux fournisseurs IA n’ont pas été déclenchés par cette branche. La suite Python couvre les routes bilingues et les configurations de paiement ; l’API et les routes Stripe ne sont pas modifiées.

Les nouveaux guides, outils, exports de données, IndexNow et la page À propos restent dans la vague suivante du plan. Les informations du responsable et les liens officiels ont été demandés ; aucun profil ni auteur humain n’a été créé par supposition.
