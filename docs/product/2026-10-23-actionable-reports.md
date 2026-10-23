# Du diagnostic aux corrections utilisables

## Comportement livré

- Le rapport gratuit commence par un extrait réel d’une réponse IA, avec sa question, son moteur et sa date. La sélection privilégie une réponse ChatGPT où l’entreprise est absente et un concurrent apparaît dans l’extrait. Aucun extrait n’est fabriqué pour une simulation ou une archive sans citation.
- Le bouton de partage prépare un PNG et montre un aperçu avant de proposer le téléchargement ou le partage natif. L’image contient la citation, le contexte et la date ; elle ne publie pas le lien privé du rapport.
- Le rapport Pro fournit une FAQ en HTML, un bloc LocalBusiness et une description de fiche Google. Les textes reprennent les informations du profil et les intentions des vraies questions du relevé. Les questions sources restent consultables. Le rendu gratuit expose les offres de déblocage, sans sérialiser les textes réservés au Pro.
- La FAQ ne promet aucun tarif, horaire ou délai non fourni. Le balisage n’invente ni téléphone, adresse postale complète, avis, note ou horaires. La description Google reste sous 750 caractères, sans lien ni HTML, conformément à la [documentation Google](https://support.google.com/business/answer/3039617?hl=en).
- L’offre de prise en charge à 490 €/$ reste à côté des corrections à réaliser soi-même avec le Pro à 29 €/$ par mois. Aucun moteur, score ou indicateur supplémentaire n’est ajouté.
- Les relevés hebdomadaires réutilisent les mêmes questions. Les alertes comparent uniquement les réponses aux questions communes sur un même moteur : nouvelle citation, perte de citation ou concurrent passé devant dans l’échantillon comparable. Une simulation, une question différente ou un moteur sans réponse n’est pas présenté comme un gain ou une perte.
- Le courriel hebdomadaire contient les changements observés et l’évolution issue du véritable historique disponible. Aucun point antérieur n’est inventé lorsqu’il manque. L’envoi concerne les abonnements actifs ; les réponses d’échec temporaires sont réessayées avec une [clé d’idempotence Resend](https://resend.com/docs/dashboard/emails/idempotency-keys).

## Langue française

Les recommandations de repli sont rédigées dans la langue du rapport, et le prompt de génération distingue cette langue de celle des questions posées aux consommateurs. Les valeurs techniques high/medium/low sont affichées en français dans l’interface. Les anciennes recommandations correspondant exactement aux modèles anglais sont traduites au rendu, en conservant les prestations, la ville et les priorités ; les conseils personnalisés ne sont pas remplacés par des modèles génériques.

La langue est enregistrée pour les nouveaux rapports et réutilisée lors des relevés hebdomadaires. Pour les archives qui n’en comportaient pas, la première ouverture avec une langue explicite initialise uniquement cette métadonnée. Cette opération ne réécrit ni les mesures ni les droits de paiement.

## Vérifications

```sh
cd apps/web
npm run lint
npm test
npx next build --webpack
cd ../..
python3 -m unittest discover -s tests
```

Résultats : lint et compilation passent, **5 tests front et 49 tests Python passent**. Les tests couvrent notamment l’absence de citation fictive, le droit d’accès aux contenus, les limites et l’échappement du contenu généré, les langues, les questions comparables, les abonnements inactifs et l’envoi hebdomadaire simulé.

Quatre parcours ont aussi été vérifiés sur le HTML réellement servi par la version compilée, avec des données de test locales : rapport français gratuit, français Pro, français simulé et anglais Pro. La citation précède le diagnostic ; la copie et les contenus privés ne sont disponibles que dans le parcours prévu. La copie de FAQ et l’aperçu PNG ont été vérifiés dans Chrome. Le navigateur automatisé ne permet pas de récupérer les téléchargements blob ; la réception du PNG par un utilisateur et le partage via le système ne constituent donc pas des tests automatisés de bout en bout.

## Mise en service

Le frontend doit être déployé depuis main. Le service API doit également être redéployé pour activer la conservation de la langue et les notifications hebdomadaires. Ces notifications utilisent le planificateur existant : API active, base persistante, fournisseurs IA et facturation configurés, abonnements actifs et Resend configuré. Aucun nouveau compte ni secret n’est requis par cette modification.

Aucun paiement, courriel à un client ni appel réel aux fournisseurs IA n’a été déclenché pendant les vérifications. La réception des courriels dans une boîte réelle et le fonctionnement des relevés en production restent à contrôler après le déploiement de l’API.
