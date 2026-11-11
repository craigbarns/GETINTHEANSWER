# Plan 30 jours — trois premiers clients à Marseille

Constat du 11 novembre 2026, d'après Search Console et Google Analytics : le
site est indexé et fonctionne, mais presque personne n'y arrive, et la marque
n'est citée nulle part ailleurs sur le web.

Le site fonctionne. Personne n'y est envoyé. Ce plan ne contient donc aucune
ligne de code : il contient des conversations.

## La règle

**On ne présente pas le produit. On montre au prospect ce que les IA répondent
à sa place.** Un dirigeant qui lit « ChatGPT recommande trois de vos
concurrents et pas vous, voici la question » ne lit pas de la publicité. Il lit
un problème sur son propre chiffre d'affaires.

Tout ce qui est affirmé dans un message vient d'un relevé réel
(`scripts/scan_one.py --lang fr`). Rien n'est supposé, rien n'est arrondi.

## Cible

Entreprises de rénovation à forte valeur de chantier, à Marseille et dans les
Bouches-du-Rhône : rénovation complète, cuisine et salle de bain, piscines,
menuiseries. Un chantier gagné vaut plusieurs milliers d'euros : 490 € se
remboursent au premier devis signé.

Pourquoi Marseille et pas Dallas : on peut téléphoner, se déplacer, être
recommandé. Le marché américain attendra les premiers cas clients.

## L'offre à vendre

Une seule, la plus simple à dire oui : **« On corrige pour vous », 490 €, payée
une fois.** Corrections prioritaires de l'audit, puis nouvelle analyse à
30 jours avec le score avant/après. Pas d'abonnement, devis confirmé avant
paiement.

AI Growth à 990 €/mois se propose **après** un premier résultat, aux clients
satisfaits. Pas avant.

## Semaine 1 — préparer (jours 1 à 5)

- [ ] Compléter `prospects.csv` : pour chaque entreprise, l'adresse de contact
      **publiée sur son site** et, si elle est indiquée, le prénom du dirigeant.
      Ne jamais deviner une adresse.
- [ ] Lancer les 10 premiers relevés :
      `python3 scripts/scan_one.py --lang fr --name "…" --url … --city Marseille --industry "…"`
- [ ] Écarter les entreprises déjà bien citées : le message n'aurait aucun
      fondement.
- [ ] Créer le profil LinkedIn du fondateur et renseigner son adresse dans
      `apps/web/src/lib/site.ts` (`SITE_AUTHOR.linkedin`).
- [ ] Publier le premier post (`launch/fr/posts-linkedin.md`).

## Semaines 2 et 3 — contacter (jours 6 à 20)

Chaque jour ouvré, une heure et demie, toujours dans cet ordre :

1. **5 relevés** sur de nouveaux prospects.
2. **5 messages** envoyés un par un depuis la boîte que vous lisez
   (`launch/fr/prospection-email.md`). Ce n'est pas une campagne : à ce volume,
   aucun outil d'envoi n'est nécessaire.
3. **5 appels** aux entreprises contactées trois jours plus tôt.
4. **1 commentaire utile** sous un post d'artisan ou d'architecte local.

Trois posts LinkedIn par semaine, toujours avec une capture d'écran réelle.

## Semaine 4 — conclure (jours 21 à 30)

- Relancer une dernière fois, puis clore.
- Pour chaque « oui » : devis écrit, périmètre exact, paiement avant démarrage.
- Livrer vite. Le premier chantier livré est le premier témoignage.

## Ce qu'on compte

| Indicateur | Objectif à 30 jours |
| --- | --- |
| Prospects scannés | 50 |
| Messages envoyés | 50 |
| Réponses | 8 à 10 |
| Échanges tenus (appel ou rendez-vous) | 10 |
| Clients payants à 490 € | 3 |

Ce sont des objectifs, pas des prévisions. Un relevé lancé n'est pas une vente,
une réponse polie non plus.

## À la fin des 30 jours

- **3 clients ou plus** : demander un témoignage écrit et l'autorisation de
  publier le avant/après. Proposer AI Growth. Recommencer avec 50 prospects.
- **1 ou 2 clients** : relire les refus. Changer une seule chose à la fois : le
  métier visé, le prix ou l'accroche.
- **Aucun client après 50 conversations réelles** : le problème n'est pas assez
  douloureux pour cette cible. Changer de cible avant d'écrire du code.

## Ce qu'on ne fait pas pendant 30 jours

- Aucune nouvelle page ville ou métier. Les pages existantes ne sont presque
  jamais affichées par Google : en ajouter ne changera rien avant des mois.
- Aucune nouvelle fonctionnalité qu'aucun client n'a demandée.
- Aucun envoi en masse, aucun message depuis `getintheanswer.com` via Resend :
  ce domaine porte les liens de rapport des clients.

## Cadre légal

La prospection par e-mail entre professionnels est permise en France sans
accord préalable, à trois conditions (CNIL) : le message concerne l'activité
professionnelle du destinataire, l'expéditeur est identifié, et il existe un
moyen simple de s'opposer. Tous les modèles de ce dossier respectent ces trois
points. Une personne qui demande à ne plus être contactée ne l'est plus jamais.
