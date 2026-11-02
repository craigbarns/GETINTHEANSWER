# Pilote AI Growth — 2 novembre 2026

## Capacité

GetInTheAnswer propose aux dirigeants d’entreprises de services un audit IA gratuit, puis un accompagnement pour réaliser les optimisations. Le logiciel devient le support du diagnostic et du suivi. La décision est **go pour un pilote commercial**, avec livraison supervisée ; l’industrialisation du moteur de publication dépendra des ventes et du coût réel de livraison.

### Diagnostic produit

- **Pour qui ?** Hypothèse de départ : dirigeants d’entreprises de rénovation à forte valeur de chantier, dans une seule zone commerciale. Cette cible reste à confirmer par le fondateur ; le site conserve une formulation générale tant que ce choix n’est pas validé.
- **Quelle difficulté ?** Le dirigeant peut constater un manque de visibilité sans disposer du temps ou des compétences pour corriger son site et produire les contenus. L’ampleur de cette difficulté et la disposition à payer restent à mesurer en entretien.
- **Pourquoi maintenant ?** Le produit possède déjà des audits, des recommandations, des contenus à adapter et des relevés comparables. Ces éléments permettent un pilote de prestation sans reconstruire le logiciel.
- **Version complète ?** Diagnostic sourcé → travaux préparés → contrôle qualité → accord client → publication → mesures comparables et suivi des demandes commerciales.
- **MVP ?** Une offre lisible, une demande d’échange qualifiée, trois clients pilotes visés et une livraison accompagnée. Les publications sont réalisées dans le périmètre du devis et après accord client.
- **Hors objectif immédiat ?** Multiplier les secteurs, remplacer les moteurs de mesure, construire des connecteurs CMS avant les premières ventes ou garantir des citations.
- **Comment décider ?** Examiner les demandes qualifiées, les rendez-vous réellement tenus, les contrats payants et le temps de livraison. Une page consultée ou un audit lancé ne vaut pas une vente.

## Contraintes

- AI Growth : **990 € HT/mois**, deux pages utiles par mois, audit technique, corrections convenues, suivi IA hebdomadaire et compte rendu mensuel.
- AI Growth Plus : **1 990 € HT/mois**, socle Growth, programme éditorial renforcé, recherche de visibilité externe légitime et accompagnement stratégique. Le volume supplémentaire est défini au devis.
- Les deux propositions sont des **tarifs pilotes**, avec engagement initial de trois mois. Ni validation du marché ni rentabilité acquise ne sont revendiquées.
- Les prestations restent libellées en euros. Le sélecteur EUR/USD concerne uniquement le logiciel Pro existant à 29 €/29 $ par mois.
- Une demande de prestation ne crée aucun paiement Stripe ni abonnement. Le devis, les accès et les conditions contractuelles sont confirmés avant signature et paiement.
- Les trois premières recommandations sont visibles dans le rapport gratuit, lorsqu’elles existent. Les contenus prêts à adapter restent soumis aux droits Pro existants.
- Les simulations et les rapports sans opportunité observée ne déclenchent pas la proposition contextuelle AI Growth. Les exemples et relevés d’étude ne sont jamais présentés comme des résultats clients.
- Aucun changement de base, de secrets, de fournisseur IA ou de configuration Railway n’est nécessaire à cette version.

## Contrat d’implémentation

### Acteurs et surfaces

- Le prospect consulte l’accueil en français ou en anglais, lance l’audit gratuit, puis peut demander un échange sur l’offre choisie.
- Le formulaire collecte identité, email professionnel, entreprise, site et contexte commercial. Il n’annonce pas de créneau réservé : l’équipe organise l’échange par réponse à la demande.
- `GET /contact?plan=ai-growth` et `?plan=ai-growth-plus`, ainsi que leurs équivalents `/fr/contact`, sélectionnent l’offre dès le rendu serveur. Le changement de langue conserve cette sélection.
- `POST /api/contact` accepte `inquiryType=ai_growth` ou `ai_growth_plus`, impose un site et un objectif d’au moins dix caractères, conserve les protections anti-spam existantes et transmet l’offre au destinataire commercial déjà configuré.
- Les demandes historiques `agency` et `done_for_you` restent acceptées. Le succès est affiché seulement après une réponse API `received`. L’envoi réel repose toujours sur la configuration Resend existante ; aucun CRM persistant n’est ajouté.

### Cycle de livraison du pilote

| État | Résultat attendu | Condition pour avancer |
| --- | --- | --- |
| Diagnostic | Questions, réponses, date, moteurs utilisés et limites du relevé | Données réelles disponibles ; simulation explicitement signalée |
| Qualification | Objectif, zone, prestations, site et capacité à traiter de nouvelles demandes | Échange tenu et périmètre jugé réalisable |
| Devis | Prix, durée, contenus, corrections, accès et indicateurs convenus | Accord contractuel et paiement hors du formulaire public |
| Préparation | Brouillons et changements versionnés, sources et vérifications factuelles | Contrôle éditorial et technique effectué |
| Validation client | Liste exacte des changements et version approuvée | Accord explicite avant publication |
| Publication | Pages et corrections accessibles, liens et indexabilité vérifiés | Accès autorisés et possibilité de retour à la version précédente |
| Mesure | Travail livré, réponses comparables, trafic et demandes observables | Même périmètre de questions ; accès de mesure convenus |

Cette version livre le parcours public et la demande qualifiée. Le cycle de production est une procédure opérée par l’équipe ; aucun tableau de gestion des travaux ou connecteur de publication automatique n’est annoncé comme disponible.

### Google et modèles IA

Le suivi automatisé actuel porte sur les réponses des modèles disponibles, dont Gemini. **Gemini n’est pas une mesure de Google AI Overviews ni d’AI Mode.** Le travail sur Google repose sur les fondamentaux SEO : exploration et indexation, contenu utile, liens internes et données structurées cohérentes. Une présence n’est pas garantie. Référence : [Google Search Central — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features).

[GLM 5.3 existe bien chez Z.ai](https://z.ai/blog/glm-5.3). Son intérêt économique pour cette activité doit être mesuré sur nos tâches, avec le coût API, les reprises et le temps de contrôle humain. L’application dispose déjà d’un modèle utilitaire configurable via `OR_UTILITY_MODEL` dans le parcours OpenRouter ; cette version ne modifie pas sa valeur. Un changement de modèle exige de vérifier l’identifiant disponible chez le fournisseur et de comparer les recommandations et extractions sur des cas connus. La génération interne et la mesure de visibilité restent deux fonctions distinctes.

Les connecteurs WordPress et Shopify viendront après validation du pilote : brouillon par défaut, autorisation limitée au site concerné, validation attachée à une version précise, publication traçable, prévention des doublons et retour arrière. Aucun accès CMS ne doit être demandé dans le formulaire public.

### Mesure du parcours commercial

Les événements GA4 existants couvrent les visites consenties, `scan_intent`, `scan_started`, `scan_completed`, `scan_failed` et `begin_checkout`. Les liens des nouvelles offres portent des annotations distinctes. Le formulaire ajoute `growth_contact_submit`, `growth_inquiry_received` et `generate_lead` avec `service_plan` et langue, après réception réussie pour les événements de succès. Aucune donnée saisie dans le formulaire n’est ajoutée à ces événements.

Les chiffres GA4 sont limités aux visiteurs consentants et peuvent être incomplets. Les rendez-vous et contrats pilotes se comptent dans le suivi commercial réel ; cette version ne fabrique pas d’événement de rendez-vous ou de vente à partir d’une simple demande. Distinguer les leads d’audit des leads d’accompagnement avec `lead_source`.

### Expérience commerciale de 30 jours

1. Jours 1–3 : confirmer une cible, une zone et un responsable de livraison ; relever le parcours de conversion actuel ; préparer le devis pilote et la capacité mensuelle disponible.
2. Jours 4–14 : sélectionner **50 prospects qualifiés visés**, identifier leurs problèmes observables et proposer un audit personnalisé. Aucun envoi de prospection n’est déclenché par cette modification.
3. Jours 10–25 : viser **10 rendez-vous tenus**, documenter objections, refus et charge estimée ; proposer le pilote uniquement aux entreprises qui peuvent en bénéficier.
4. Jours 15–30 : viser **3 clients pilotes payants**. À 990 € HT/mois, cela représenterait **2 970 € de revenu mensuel contractuel**. C’est un objectif, pas une prévision ni du revenu déjà acquis.
5. Jour 30 : décider de continuer, modifier la cible/le périmètre ou arrêter l’acquisition du pilote. Évaluer les résultats SEO et IA sur la durée de livraison convenue, pas sur la seule fenêtre commerciale de 30 jours.

Pour chaque client : conserver l’état initial daté, les questions et moteurs, les URLs modifiées, la date de validation/publication, le temps humain, les frais API/outils et les mesures après intervention. Distinguer citations, visites, demandes et ventes ; ne pas attribuer automatiquement une évolution aux seuls travaux réalisés. Publier un cas client uniquement avec autorisation et éléments vérifiables.

## Hors périmètre

Cette livraison n’ajoute ni acquisition de prospects, ni prospection envoyée, ni faux témoignage, ni publication sur des sites clients. Elle ne connecte pas les comptes Analytics des futurs clients et ne crée pas d’abonnement de prestation récurrente. Ces étapes supposent un client, un contrat et les accès correspondants.

## Décisions ouvertes

- Cible et zone du pilote : rénovation à forte valeur proposée comme hypothèse, à confirmer.
- Responsable et capacité de livraison : quantité de temps disponible, coût complet par client et seuil de marge à définir avant de signer les trois pilotes.
- Périmètre AI Growth Plus : volume éditorial, sources externes et temps stratégique à préciser au devis.
- Conditions contractuelles de la prestation, modalités de paiement et mesure des demandes : à définir avant toute vente ; le formulaire public ne les remplace pas.

## Passage en exploitation Railway

Projet existant `seenbyai`, environnement `production`, services `web`, `api` et `Postgres`, constatés via le CLI Railway. Le web est associé au dépôt GitHub ; l’API utilise le parcours de déploiement par téléversement existant. Ne pas créer un nouveau projet.

Après validation de la version, déployer **l’API avant le web** : l’API accepte les nouvelles offres tout en restant compatible avec l’ancien frontend. Déployer le web ensuite pour exposer les nouveaux formulaires. Aucun changement de base ni de variable n’est requis. En cas de retour arrière, rétablir le web d’abord ; l’API élargie reste compatible.

Vérifier `/`, `/fr`, les deux offres dans `/contact` et `/fr/contact`, le changement de langue et un parcours d’audit. Une vérification réelle de remise des notifications commerciales doit être explicitement autorisée avant d’envoyer un message via le service de production.

Le cadrage est prêt pour l’implémentation du parcours public et pour la préparation commerciale du pilote. L’industrialisation CMS est une étape distincte, à décider avec des clients et des besoins observés.
