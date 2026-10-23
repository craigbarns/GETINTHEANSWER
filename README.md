# GetInTheAnswer (ex-SeenByAI)

**"Est-ce que l’IA recommande votre entreprise ?"**

SeenByAI est une application SaaS B2B destinée aux PME locales pour mesurer et améliorer leur visibilité dans les réponses des moteurs IA.

## Architecture

- **Frontend**: Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Backend API**: FastAPI (Python)
- **Base de données**: PostgreSQL + Supabase (Auth, RLS)
- **Workers**: Celery / Redis (pour l'exécution asynchrone des scans)
- **Déploiement**: Docker Compose (Local), Railway (Prod)
- **Paiements**: Stripe

## Structure du projet

- `apps/web` : Application Next.js.
- `apps/api` : API FastAPI.
- `packages/shared` : Types partagés (si applicable) ou utilitaires.
- `packages/scoring` : Moteur de scoring déterministe.
- `packages/providers` : Adapters pour les moteurs IA (mock, openai, perplexity, etc.).
- `workers/scanner` : Workers asynchrones pour les requêtes IA.
- `supabase/migrations` : Schémas et politiques RLS de la base de données.
- `tests` : Tests unitaires et d'intégration.
- `docker` : Fichiers Dockerfile.

## Checklist (MVP)

- [x] Initialisation du projet (Next.js, FastAPI, Docker Compose)
- [x] Configuration UI (Tailwind, shadcn/ui)
- [x] Modélisation de la base de données et persistance des rapports
- [x] Implémentation du backend (API)
- [ ] Intégration Supabase Auth
- [x] Onboarding (génération des questions)
- [x] Scan Engine (ChatGPT, Claude, Perplexity et mode simulation)
- [x] Scoring Engine
- [x] Détection des concurrents
- [x] Moteur de recommandations
- [x] UI Landing Page
- [x] UI Dashboard (score, mentions, concurrents, actions)
- [x] Stripe Checkout, webhook et portail d'abonnement
- [ ] Weekly Report (Mock/Stub)

## Langues

- Anglais par défaut à la racine (`/`), français sous `/fr`.
- Pages bilingues : accueil, analyse gratuite, exemple de rapport, agences, contact et rapport
  (liste dans `apps/web/src/lib/i18n.ts`). Les pages de contenu SEO (métiers, villes, guides, étude)
  restent en anglais et visent le marché américain.
- Chaque langue a sa propre mise en page racine (`app/(en)/layout.tsx` et `app/fr/layout.tsx`),
  d'où le `global-not-found.tsx` pour les URL inconnues.
- La langue suit le visiteur jusqu'au bout : e-mail du rapport, Stripe Checkout, retour après
  paiement et portail d'abonnement (champ `locale` envoyé à l'API).
- L'offre « on corrige pour vous » (490 € / 490 $, paiement unique) passe par le formulaire de
  contact (`/contact?plan=done-for-you`). Son prix se règle dans `DONE_FOR_YOU_PRICE`
  (`apps/web/src/lib/pricing.ts`).

## Lancement local

```bash
docker-compose up -d
```

Pour le développement frontend :
```bash
cd apps/web
npm run dev
```

Pour le développement backend :
```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Configuration de production

Variables principales de l'API :

- `DATABASE_URL` : PostgreSQL persistant.
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `PERPLEXITY_API_KEY` : moteurs du scan live.
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` : abonnement Pro (prix en dollars).
- `STRIPE_PRICE_ID_EUR` : prix Stripe en euros du même abonnement. Stripe facture la devise
  dans laquelle le Price a été créé : vendre dans les deux devises demande donc un Price par
  devise. Sans cette variable, tous les paiements retombent sur `STRIPE_PRICE_ID`.
- `STRIPE_DEFAULT_CURRENCY` : devise utilisée quand le visiteur n'a rien choisi (`eur` par défaut).
- `STRIPE_WEBHOOK_SECRET` : signature du webhook Stripe.
- `STRIPE_CHECKOUT_LOCALE` : langue du Checkout Stripe (`en` par défaut pour le marché US).
- `FRONTEND_URL` : URL canonique du frontend.
- `SCAN_RATE_LIMIT` : scans gratuits autorisés par IP, email et domaine sur la fenêtre (3 par défaut).
- `SCAN_RATE_WINDOW_SECONDS` : fenêtre de limitation (24 heures par défaut).
- `MAX_CONCURRENT_SCANS` : scans exécutés simultanément par instance API (3 par défaut).
- `CONTACT_RATE_LIMIT` : demandes Agency autorisées par IP et email sur la fenêtre (5 par défaut).
- `CONTACT_RATE_WINDOW_SECONDS` : fenêtre de limitation des demandes Agency (24 heures par défaut).
- `RESEND_API_KEY`, `RESEND_FROM_ADDRESS`, `NOTIFY_EMAIL` : envoi des rapports et des demandes Agency.

Le webhook Stripe doit pointer vers :

```text
https://www.getintheanswer.com/api/stripe/webhook
```

Événements attendus :

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Vérifications

```bash
cd apps/web
npm run lint
npx next build --webpack

cd ../..
python3 -m unittest discover -s tests -v
```
