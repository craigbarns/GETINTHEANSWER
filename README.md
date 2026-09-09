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
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` : abonnement Pro.
- `STRIPE_WEBHOOK_SECRET` : signature du webhook Stripe.
- `FRONTEND_URL` : URL canonique du frontend.
- `SCAN_RATE_LIMIT` : scans gratuits autorisés par IP, email et domaine sur la fenêtre (3 par défaut).
- `SCAN_RATE_WINDOW_SECONDS` : fenêtre de limitation (24 heures par défaut).
- `MAX_CONCURRENT_SCANS` : scans exécutés simultanément par instance API (3 par défaut).
- `DAILY_SCAN_LIMIT` : plafond de scans démarrés par jour glissant (100 par défaut). Chaque scan
  coûte une douzaine d'appels LLM facturés : au-delà du plafond l'API répond 503 au lieu de dépenser.
- `OPENAI_BASE_URL` / `ANTHROPIC_BASE_URL` : à ne définir que pour passer par un revendeur
  (OpenRouter par exemple). Les SDK lisent ces variables même sans code dédié, donc une valeur
  oubliée ici redirige — et refacture — tous les scans. `/api/admin/stats` affiche l'hôte réellement
  appelé dans `engine_endpoints`.
- `ADMIN_STATS_TOKEN` : active `GET /api/admin/stats` (volume de scans, mode live/simulation,
  rapports débloqués, budget du jour). Sans ce token, la route répond 404.

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
