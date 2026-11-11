# Prospection — entreprises de rénovation, Marseille

Volume : **5 messages par jour, écrits et envoyés un par un** depuis votre
propre boîte. C'est de la correspondance, pas une campagne.

Chaque `{{variable}}` vient du relevé du prospect
(`scripts/scan_one.py --lang fr`). Si une valeur manque, on ne l'invente pas :
on retire la phrase.

---

## Avant d'écrire

1. Lancer le relevé :

   ```bash
   python3 scripts/scan_one.py --lang fr --name "{{Entreprise}}" \
     --url {{site}} --city "Marseille" --industry "{{métier}}"
   ```

2. Ouvrir le rapport et **faire une capture d'écran** de la question où un
   concurrent est cité. Cette image est le message.
3. Si l'entreprise est déjà bien citée, ne pas écrire. Passer à la suivante.
4. Si le relevé est en mode simulation, ne rien envoyer : les chiffres ne sont
   pas réels.

---

## Message 1 — le constat (jour 0)

**Objet :** `Les IA citent {{Concurrent}} à Marseille, pas {{Entreprise}}`

> Bonjour {{Prénom}},
>
> J'ai posé à ChatGPT, Claude, Gemini et Perplexity {{total}} questions que vos
> clients posent réellement avant de choisir une entreprise à Marseille.
>
> À la question « {{question exacte}} », les IA citent {{Concurrent}}.
> {{Entreprise}} n'apparaît dans aucune des {{total}} réponses.
>
> Le détail complet est ici, sans inscription : {{lien du rapport}}
>
> Si cela vous est utile, je vous montre en quinze minutes ce qui, sur votre
> site, les conduit à en citer d'autres. Sinon, aucun souci.
>
> Gregory Baranes
> GetInTheAnswer — WEMADE, 41 rue Fongate, 13006 Marseille
>
> Vous recevez ce message à votre adresse professionnelle, au sujet de votre
> activité. Répondez « stop » pour ne plus en recevoir.

Variante si l'entreprise est citée quelques fois :

> {{Entreprise}} apparaît dans {{mentions}} réponses sur {{total}}.
> {{Concurrent}} est cité plus souvent.

---

## Message 2 — la relance (jour 3)

En réponse au premier message, pour garder le fil.

> Bonjour {{Prénom}},
>
> Je me permets de revenir vers vous : j'ai joint la capture de la réponse de
> {{moteur}} à « {{question exacte}} ».
>
> De plus en plus de particuliers posent cette question à une IA avant de
> demander un devis. Je peux vous dire en un quart d'heure ce qu'il faudrait
> corriger. Jeudi ou vendredi, en fin de journée ?
>
> Gregory

Joindre la capture d'écran.

---

## Message 3 — la clôture (jour 8)

> Bonjour {{Prénom}},
>
> Dernier message de ma part. Votre rapport reste accessible ici :
> {{lien du rapport}}
>
> Si le sujet devient d'actualité, vous savez où me trouver. Bonne continuation.
>
> Gregory

On n'écrit pas une quatrième fois.

---

## L'appel (jour 3 ou 4)

Les artisans répondent mieux au téléphone qu'aux e-mails. Appeler entre
7 h 30 et 8 h 30 ou après 17 h 30, hors chantier.

> « Bonjour, Gregory Baranes, je suis à Marseille. Je vous ai écrit mardi : j'ai
> demandé à ChatGPT qui il recommande pour {{métier}} à Marseille, et votre
> entreprise n'apparaît pas. {{Concurrent}}, si. Vous avez deux minutes pour que
> je vous montre ? »

Puis se taire et écouter.

- **S'il est curieux** : envoyer le lien par SMS pendant l'appel, le parcourir
  avec lui.
- **S'il demande le prix** : « 490 €, une seule fois. On corrige les points
  prioritaires, et dans trente jours on refait la mesure ensemble. »
- **S'il n'a pas le temps** : « Je vous envoie la capture par SMS, vous regardez
  quand vous pouvez. » Rappeler une fois, pas davantage.

---

## Objections

**« Mes clients ne passent pas par ChatGPT. »**
C'est possible aujourd'hui pour la plupart d'entre eux. La question est de
savoir qui sera cité quand ils s'y mettront. Montrer la capture : la réponse
existe déjà, avec ou sans lui.

**« J'ai déjà quelqu'un pour mon référencement. »**
Très bien. Ce rapport lui sera utile, transmettez-le-lui. Les IA ne lisent pas
un site comme Google ; il manque souvent une page de questions-réponses et des
données structurées.

**« Vous garantissez que je serai cité ? »**
Non. Personne ne contrôle ce que répond une IA, et quiconque le promet ment. Ce
qui est garanti, c'est le travail livré et une mesure avant/après sur les mêmes
questions.

**« 490 €, c'est cher pour un test. »**
Combien vaut un chantier pour vous ? Si un seul devis vient de là, c'est
remboursé. Et il n'y a pas d'abonnement.

**« Envoyez-moi une plaquette. »**
« Je n'en ai pas, j'ai mieux : votre rapport. Je vous l'envoie maintenant. »

---

## Après un « oui »

1. Envoyer le devis le jour même : périmètre exact, 490 €, délai.
2. Demander les accès nécessaires seulement une fois le devis accepté.
3. Livrer, faire valider chaque changement avant publication.
4. À 30 jours : refaire le relevé, envoyer le avant/après.
5. Demander un témoignage de deux phrases et l'autorisation de le publier.

Aucun résultat client n'est publié sans autorisation écrite.
