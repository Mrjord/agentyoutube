# Viral Script SaaS — Spec de design

**Date** : 2026-04-28
**Statut** : Draft — en attente de relecture utilisateur
**Cible V1** : Usage solo (auteur), architecturé pour bascule SaaS V2
**Niche** : Business + IA + Mindset + Entrepreneuriat

---

## 1. Vision

Application web qui :

1. **Analyse en continu** des vidéos YouTube virales sur la niche business / IA / mindset / entrepreneuriat
2. **Stocke et structure** les patterns viraux extraits dans une base de connaissances persistante
3. **Génère à la demande** des scripts YouTube complets, optimisés pour la rétention, à partir d'un thème + une durée + un ton, en s'appuyant sur l'ensemble des patterns appris

V1 sert un seul utilisateur (l'auteur). V2 ajoutera authentification, billing, et un modèle SaaS multi-tenant pour clients payants.

---

## 2. Flux utilisateur principal (génération)

1. L'utilisateur ouvre l'app
2. Il remplit 3 champs :
   - **Thème** (texte libre, ex : *"comment devenir riche en 2026"*)
   - **Durée cible** (sélection : 30s Short / 60s / 5min / 8min / 10min / 15min / 20min)
   - **Ton** (sélection : viral / éducatif / storytelling / tutoriel / provocateur / inspirant / analytique)
3. Il clique "Générer"
4. L'app récupère les patterns viraux les plus pertinents de la base de connaissances
5. Claude Opus 4.7 génère le script en **streaming** dans l'UI
6. Le script s'affiche minute par minute, avec intonation/pauses/visuels/objectifs de rétention
7. L'utilisateur peut copier, exporter (Markdown / PDF), ou sauvegarder dans sa bibliothèque

## 3. Flux d'auto-découverte (en arrière-plan)

Tous les jours à 03h00 UTC, **sans intervention utilisateur** :

1. Vercel Cron déclenche le pipeline
2. Le système recherche sur YouTube via l'API Data v3 sur ~15 mots-clés rotatifs (FR + EN)
3. Filtrage par virality (>100k vues, ratio likes/vues ≥ 2%, publié dans les 90 derniers jours)
4. Skip si la vidéo est déjà en base
5. Pour chaque nouvelle vidéo (max 30/jour) :
   - Récupération de la transcription (gratuit, sous-titres auto)
   - Analyse par Claude Sonnet 4.6 → extraction structurée de patterns
   - Stockage en Postgres
6. La base de connaissances grandit organiquement, jour après jour

---

## 4. Inputs de génération (le formulaire)

| Champ | Type | Effet |
|---|---|---|
| **Thème** | Texte libre, max 500 chars | Sujet exact du contenu généré |
| **Durée** | Liste : 30s / 60s / 5min / 8min / 10min / 15min / 20min | Adapte la structure (nombre de hooks, blocs de valeur, CTAs) |
| **Ton** | Liste : viral / éducatif / storytelling / tutoriel / provocateur / inspirant / analytique | Filtre les patterns prioritaires + style d'écriture |

### Détail des 7 tons

- **Viral** — hooks chocs, courbes de tension toutes les 30s, retours fréquents à la promesse, max retention
- **Éducatif** — progression pédagogique, exemples concrets, autorité posée, peu de chocs
- **Storytelling** — ouverture narrative, arc avant/après, ton intime
- **Tutoriel** — step-by-step structuré, démos, "regarde ce qui se passe quand…"
- **Provocateur** — opinion forte, contre-courant, crée le débat
- **Inspirant** — mindset, transformation, énergie élevée
- **Analytique** — données, comparaisons, breakdown chiffré

---

## 5. Format de sortie (le script)

Markdown, un bloc par segment temporel. Chaque bloc contient 7 champs.

```
[MM:SS - MM:SS] NOM_SECTION 🪝
**Texte à dire** (mot pour mot)
🎙️ Intonation : <rythme, ton, accents toniques>
⏸️ Pauses : <où et combien de temps>
🎬 Visuel : <plan caméra + B-roll suggéré>
🎯 Rétention : <pourquoi cette section retient (curiosity gap, payoff, promesse réitérée…)>
😮 Émotion : <émotion ciblée>
```

Les sections suivent un arc commun mais varient selon le ton :
- **HOOK** (0-8s)
- **PROMESSE** (8-25s)
- **CONTEXTE / PAIN POINT** (25s - 1:30)
- **VALUE BLOCKS** (variable, dépend de la durée)
- **TENSION / CTA intermédiaires** (périodiques)
- **OUTRO + CTA final** (15 dernières secondes)

---

## 6. Architecture

### 6.1 Stack technique

| Couche | Choix |
|---|---|
| Frontend + backend | Next.js 16 App Router sur Vercel |
| Base de données | Neon Postgres (Vercel Marketplace, free tier 0.5 GB) |
| ORM | Drizzle |
| LLM (analyse) | Claude Sonnet 4.6 via Anthropic SDK |
| LLM (génération) | Claude Opus 4.7 via Anthropic SDK + adaptive thinking + prompt caching |
| Streaming UI | Vercel AI SDK v6 |
| Background jobs | Vercel Cron + Vercel Functions (Fluid Compute) |
| YouTube discovery | YouTube Data API v3 |
| Transcriptions | Bibliothèque Node `youtube-transcript` (port de l'API non officielle) |
| Auth (V2) | Clerk via Vercel Marketplace |
| Billing (V2) | Stripe via Vercel Marketplace |
| Design system frontend | [`ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (Claude Code skill) |
| Composants UI génératifs | [21st.dev Magic MCP](https://21st.dev) (composants React/Tailwind à la demande) |
| Composants UI base | shadcn/ui (Tailwind CSS, installable via shadcn CLI) |

### 6.1.1 Système de design UI/UX

Le frontend utilise le skill **[`ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)** comme générateur de design system. Ce skill apporte :

- 67 styles UI (glassmorphism, claymorphism, minimalism, brutalism, etc.)
- 161 palettes de couleurs alignées sur des catégories produit
- 57 pairings de fonts (Google Fonts)
- 161 règles de raisonnement design par industrie
- 99 guidelines UX (accessibilité + best practices)

**Installation** (en phase d'implémentation, une fois Next.js scaffolded) :
```bash
npm install -g uipro-cli
cd <project-root>
uipro init --ai claude
```

**Usage** : invoqué naturellement pendant la construction du frontend (ex: *"Build a viral script generation dashboard for content creators"*) → le skill génère automatiquement palette, fonts, layout patterns adaptés à la niche SaaS / créateurs de contenu.

**Prérequis** : Python 3.x sur la machine de dev (déjà standard sur macOS).

### 6.1.2 Pipeline UI à 3 couches

Le frontend s'appuie sur 3 outils complémentaires :

1. **`ui-ux-pro-max-skill`** — décide du *style* (palette, fonts, ambiance, layout patterns) à partir de la nature du produit
2. **shadcn/ui** — composants de base accessibles, typés, théméables (boutons, modals, formulaires, tables)
3. **21st.dev Magic MCP** — génère des composants React/Tailwind sur-mesure à la demande pour tout ce qui sort de la base shadcn (hero sections, dashboards stylés, animations spécifiques)

**Workflow type pour une nouvelle page** :
1. `ui-ux-pro-max` → palette + fonts + layout
2. shadcn/ui → primitives (Button, Card, Input)
3. Magic MCP → composants signatures (script viewer animé, library grid, retention curve viz)

### 6.2 Structure projet

```
.
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx                    # Dashboard / library overview
│   │   ├── generate/page.tsx           # Form + streaming output
│   │   ├── scripts/[id]/page.tsx       # Script viewer
│   │   └── library/page.tsx            # Patterns browser (debug + curiosité)
│   ├── api/
│   │   ├── generate/route.ts           # POST — génération streaming
│   │   ├── scripts/route.ts            # GET — liste scripts user
│   │   └── cron/discover/route.ts      # Cron — pipeline découverte
│   └── layout.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts                   # Schéma Drizzle
│   │   └── queries.ts                  # Requêtes typées
│   ├── youtube/
│   │   ├── search.ts                   # Wrapper YouTube Data API v3
│   │   └── transcript.ts               # Récup sous-titres
│   ├── claude/
│   │   ├── analyze.ts                  # Sonnet 4.6 — extraction patterns
│   │   └── generate.ts                 # Opus 4.7 — génération script
│   ├── prompts/
│   │   ├── analyze-system.ts           # Prompt système d'analyse (cached)
│   │   └── generate-system.ts          # Prompt système de génération (cached)
│   └── retention/
│       └── retrieve-patterns.ts        # Sélection patterns pour génération
├── components/
│   ├── ScriptForm.tsx
│   ├── ScriptStream.tsx
│   └── LibraryDashboard.tsx
├── docs/
│   └── superpowers/specs/2026-04-28-viral-script-saas-design.md
├── drizzle.config.ts
├── next.config.ts
├── package.json
└── vercel.json (ou vercel.ts)
```

### 6.3 Flux de données

**Pipeline découverte :**

```
Vercel Cron (03:00 UTC quotidien)
    │
    ▼
fetchActiveKeywords()  ◄── search_keywords (Postgres)
    │
    ▼ (pour chaque keyword)
youtube.search.list({ q, order: "viewCount", publishedAfter: "-90d" })
    │
    ▼
filterByVirality({ minViews: 100k, minLikeRatio: 2% })
    │
    ▼
skipIfAlreadyInDB()  ◄── videos (Postgres)
    │
    ▼ (pour chaque vidéo, max 30/jour)
getTranscript(videoId)
    │
    ▼
analyzeWithSonnet(transcript, metadata)  ──► structured Pattern[]
    │
    ▼
saveVideo() + savePatterns()  ──► videos + patterns (Postgres)
```

**Pipeline génération :**

```
User submits form (theme, duration, tone)
    │
    ▼
POST /api/generate
    │
    ▼
retrievePatterns({ tone, durationBucket })  ◄── patterns (Postgres)
    │   (top 50 par virality_score, filtrés par ton et durée)
    ▼
buildPrompt({ patterns, theme, duration, tone })
    │
    ▼
claude.messages.stream({
  model: "claude-opus-4-7",
  system: GENERATE_SYSTEM_PROMPT,    // cached
  messages: [{ role: "user", content: buildPrompt(...) }],  // patterns aussi cached
  thinking: { type: "adaptive" },
  output_config: { effort: "high" }
})
    │
    ▼ (streaming)
Client UI affiche les tokens au fur et à mesure
    │
    ▼ (à la fin)
saveScript({ userId, theme, duration, tone, content, patternsUsed })
```

---

## 7. Modèle de données (Postgres / Drizzle)

```sql
-- Utilisateurs (V1 : un seul user hardcodé ; V2 : Clerk)
users (
  id            uuid PRIMARY KEY,
  email         text NOT NULL,
  created_at    timestamptz DEFAULT now()
)

-- Mots-clés de recherche (auto-découverte)
search_keywords (
  id              uuid PRIMARY KEY,
  keyword         text NOT NULL,
  language        text NOT NULL,           -- 'fr' | 'en'
  active          boolean DEFAULT true,
  last_used_at    timestamptz,
  results_count   int DEFAULT 0
)

-- Vidéos analysées
videos (
  id                  uuid PRIMARY KEY,
  youtube_video_id    text UNIQUE NOT NULL,
  title               text NOT NULL,
  channel             text NOT NULL,
  url                 text NOT NULL,
  view_count          bigint NOT NULL,
  like_count          bigint NOT NULL,
  published_at        timestamptz NOT NULL,
  duration_seconds    int NOT NULL,
  language            text NOT NULL,
  transcript          text NOT NULL,
  discovered_at       timestamptz DEFAULT now(),
  analyzed_at         timestamptz
)

-- Patterns extraits
patterns (
  id                uuid PRIMARY KEY,
  video_id          uuid NOT NULL REFERENCES videos(id),
  pattern_type      text NOT NULL,         -- 'hook' | 'retention_curve' | 'cta' | 'story_arc' | 'transition' | 'tonal_shift'
  content           jsonb NOT NULL,        -- structure dépend du pattern_type
  tone              text NOT NULL,         -- 'viral' | 'educational' | etc.
  duration_bucket   text NOT NULL,         -- 'short' | 'medium' | 'long'
  virality_score    float NOT NULL,        -- views × engagement_ratio
  created_at        timestamptz DEFAULT now()
)

CREATE INDEX patterns_tone_duration ON patterns(tone, duration_bucket);
CREATE INDEX patterns_virality ON patterns(virality_score DESC);

-- Scripts générés
scripts (
  id                uuid PRIMARY KEY,
  user_id           uuid NOT NULL REFERENCES users(id),
  theme             text NOT NULL,
  duration_seconds  int NOT NULL,
  tone              text NOT NULL,
  content_markdown  text NOT NULL,
  patterns_used     uuid[] NOT NULL,       -- references vers patterns.id
  revision_of       uuid REFERENCES scripts(id),  -- pour les régénérations
  created_at        timestamptz DEFAULT now()
)
```

---

## 8. Intégrations externes

### 8.1 YouTube Data API v3

- **Auth** : clé API (Google Cloud Console, gratuit)
- **Quota gratuit** : 10 000 unités/jour
- **Endpoints utilisés** :
  - `search.list` — 100 unités/appel — recherche par mot-clé + tri par viewCount
  - `videos.list` — 1 unité/appel (batch jusqu'à 50 vidéos) — détails
- **Budget quotidien estimé** : ~5 search + ~5 batch detail = ~510 unités, largement sous quota

### 8.2 Anthropic API

- **Auth** : clé API
- **Modèles** :
  - `claude-sonnet-4-6` — analyse (volume)
  - `claude-opus-4-7` — génération (qualité)
- **Features utilisées** :
  - Adaptive thinking sur Opus 4.7
  - Prompt caching (système + pool de patterns)
  - Streaming sur la génération

### 8.3 youtube-transcript (Node)

- Bibliothèque npm `youtube-transcript` (port communautaire)
- Scrape les sous-titres auto YouTube, gratuit
- ~10% des vidéos sans sous-titres → skip silencieux

---

## 9. Analyse des coûts

| Poste | Coût mensuel V1 | Notes |
|---|---|---|
| YouTube Data API | $0 | Quota gratuit suffisant |
| Vercel hosting | $0 | Tier Hobby OK |
| Vercel Cron | $0 | Inclus |
| Neon Postgres | $0 | Free tier 0.5 GB |
| Sonnet 4.6 (analyse) | ~$2 | 30 vidéos/jour × $0.03 × 30 jours |
| Opus 4.7 (génération) | ~$5-8 | ~5 scripts/semaine × $0.25/script (avec caching) |
| **Total V1** | **~$7-15/mo** | Coût réel quasi uniquement Claude |

Pour V2 SaaS :
- Clerk : gratuit jusqu'à 10k MAU
- Stripe : 2.9% + 0.30€ par transaction
- Pricing à définir (proposition initiale : 19€/mo pour 20 scripts/mois inclus)

---

## 10. Périmètre V1 vs V2

### V1 (à construire maintenant)

- [x] Pas d'auth UI — un seul utilisateur hardcodé en base
- [x] 15 mots-clés pré-seedés (FR + EN, business / IA / mindset)
- [x] Les 7 tons disponibles
- [x] Cron quotidien d'auto-découverte (max 30 vidéos/jour)
- [x] Formulaire de génération + streaming output
- [x] Dashboard library (lecture seule)
- [x] Export Markdown
- [x] Architecture multi-tenant (toutes les tables ont `user_id`)

### V2 (SaaS launch — projet séparé plus tard)

- [ ] Clerk auth
- [ ] Stripe billing + plans
- [ ] Per-user OR shared knowledge base (à décider — voir §11)
- [ ] Mots-clés personnalisables par user
- [ ] Édition / annotation de scripts dans l'UI
- [ ] Workspaces équipe
- [ ] Export PDF
- [ ] API publique pour intégrations tierces

---

## 11. Décisions différées

- **Partage de la base de connaissances en V2** : tous les users partagent une KB globale (meilleur moat, plus simple) ou KB par user (plus personnalisable) ? Recommandation initiale : KB globale + override mots-clés par user.
- **Pricing SaaS** : à définir au moment du launch V2.
- **Extension de niche** : V1 = business/IA/mindset uniquement. V2 pourra ajouter d'autres niches via mots-clés custom.

---

## 12. Stratégie de tests

- **Tests unitaires** :
  - Parser de patterns (input : réponse Sonnet → output : `Pattern` valide)
  - Formatter de script (input : output Opus → output : Markdown structuré)
- **Tests d'intégration** :
  - Wrapper YouTube transcript (mock API)
  - Pipeline découverte end-to-end (avec cassette/replay sur fixtures)
- **QA manuelle** :
  - Générer 10 scripts couvrant les 7 tons, noter qualité subjectivement
- **Pas de tests E2E en V1** — coût/bénéfice trop défavorable pour un projet solo

---

## 13. Questions ouvertes pré-implémentation

| # | Question | Résolution |
|---|---|---|
| 1 | Clé API Anthropic | À obtenir par l'utilisateur (étape de setup) |
| 2 | Compte Vercel | À obtenir par l'utilisateur (étape de setup) |
| 3 | Clé API YouTube Data v3 | À obtenir par l'utilisateur (Google Cloud Console, gratuit) |
| 4 | Liste initiale de 15 mots-clés | Je propose dans le plan d'implémentation, l'utilisateur valide |
| 5 | Identité du user V1 hardcodé | Email à fournir lors du setup |

---

## Fin de la spec
