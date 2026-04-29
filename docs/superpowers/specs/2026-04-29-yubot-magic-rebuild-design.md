# YUBOT — Magic UI Rebuild Design Spec

**Date:** 2026-04-29  
**Status:** Approved

---

## Objective

Rebuild the entire YUBOT interface using exclusively MCP Magic (21st.dev) for every visual component. The backend is untouched. Only the UI layer is rebuilt.

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0A0A0A` |
| Surface | `#0D0D0D` / `#111111` |
| Border | `#1E1E1E` |
| Text primary | `#F5F0E8` |
| Text muted | `#6B6560` |
| Accent | `#FFE600` |
| Font heading | Bricolage Grotesque |
| Font body | DM Sans |
| Font mono | JetBrains Mono |

**Style:** Dark editorial SaaS, premium, modern typography, subtle animations.

---

## Absolute Rules

1. **Every visual component generated via MCP Magic** — no manual HTML/CSS
2. **No Tailwind UI / Shadcn / Aceternity used directly** — all goes through Magic
3. **Multiple variations requested per component** — best one selected
4. **Backend untouched**: `lib/claude/`, `lib/youtube/`, `lib/export/`, `lib/db/`, `lib/prompts/`
5. **Existing routes preserved**: `/`, `/dashboard`, `/generate`, `/library`, `/scripts/[id]`

---

## Approach

Generate page by page, component by component:
- Show each Magic variation before moving to next
- Iterate if variation doesn't match YUBOT identity
- Validate landing page fully before starting dashboard

---

## Pages & Routes (unchanged)

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/dashboard` | Overview stats + recent activity |
| `/generate` | Script generation (3 tabs: generate, adapt, analyze) |
| `/library` | Pattern library |
| `/scripts/[id]` | Script detail + export |

---

## Component List

### Phase 1 — Landing Page (22 components)

| # | Component | Description |
|---|-----------|-------------|
| 1 | Navigation sticky | Logo left, menu center, yellow CTA right |
| 2 | Hero section | Massive headline 70% width, subtitle, 2 CTAs, demo animation right |
| 3 | Social proof bar | "Used by creators with 50M+ views" + 5 channel logos |
| 4 | Problem section | Storytelling — pain points before YUBOT |
| 5 | Solution reveal | How YUBOT solves the problem |
| 6 | Feature showcase | 3-4 key features with icons and animations |
| 7 | How it works | Step-by-step process visualization |
| 8 | Stats section | Large animated numbers (50M views, 1000+ scripts, etc.) |
| 9 | Video demo embed | YouTube demo video with styled frame |
| 10 | Testimonials | Creator testimonials with avatars |
| 11 | Pricing section | Pricing cards (or "request access") |
| 12 | FAQ accordion | Frequently asked questions |
| 13 | Final CTA | Last conversion section before footer |
| 14 | Footer | Links, social, copyright |
| 15 | Pattern card | Individual pattern showcase card |
| 16 | Script preview card | Mini script preview tile |
| 17 | Feature pill | Small feature badge/pill component |
| 18 | Section divider | Animated separator between sections |
| 19 | Gradient blob | Background decorative element |
| 20 | Video thumbnail card | YouTube video card with stats |
| 21 | Creator avatar | Creator profile image with stats |
| 22 | Mobile menu | Responsive navigation drawer |

### Phase 2 — Dashboard (10 components)

| # | Component | Description |
|---|-----------|-------------|
| 23 | Sidebar navigation | Sticky sidebar with logo, nav, version |
| 24 | Stat card | Single metric card (videos, patterns, scripts) |
| 25 | Stats grid | 3-column grid of stat cards |
| 26 | Recent video item | Video list item with title + channel + views |
| 27 | Recent script item | Script list item with theme + tone + duration |
| 28 | Activity feed | Combined recent activity panel |
| 29 | Quick action button | Primary CTA button (Generate a script) |
| 30 | Dashboard header | Page header with label + title |
| 31 | Empty state | Empty state for no videos/scripts yet |
| 32 | Dashboard page layout | Full dashboard page assembly |

### Phase 3 — Library (5 components)

| # | Component | Description |
|---|-----------|-------------|
| 33 | Pattern card (full) | Full pattern card with type, hook, body |
| 34 | Pattern filter | Filter bar for pattern types |
| 35 | Pattern grid | Grid of pattern cards |
| 36 | Pattern detail modal | Expanded pattern detail |
| 37 | Library page layout | Full library page assembly |

### Phase 4 — Chatbot (3 components)

| # | Component | Description |
|---|-----------|-------------|
| 38 | Chatbot trigger button | Floating yellow action button |
| 39 | Chat message bubble | User / assistant message bubble |
| 40 | Chatbot panel | Full chatbot drawer/panel |

---

## Implementation Order

```
Phase 1: Landing (components 1→22)
  → Validate each component with user before next
  → Assemble full landing page when all 22 approved

Phase 2: Dashboard (components 23→32)
  → Validate each component with user before next
  → Assemble full dashboard layout when all 10 approved

Phase 3: Library (components 33→37)
  → Validate then assemble

Phase 4: Chatbot (components 38→40)
  → Validate then assemble

Phase 5: Backend wiring
  → Connect new components to existing logic (no backend changes)

Phase 6: Visual consistency pass
  → Colors, spacing, animations aligned across all pages

Phase 7: Testing
  → Verify generation mechanism and all existing features intact
```

---

## Backend Contracts (read-only reference)

- `getStats()` → `{ videos, patterns, scripts }` — used by stat cards
- `getRecentVideos(n)` → `Video[]` — used by recent video list
- `getRecentScripts(userId, n)` → `Script[]` — used by recent script list
- Script generation: `POST /api/generate` via `ScriptStream`
- Script adaptation: `POST /api/adapt` via `AdaptStream`
- Script analysis: `POST /api/analyze` via `AnalyzeScriptStream`
- Word export: `lib/export/generateDocx.ts`

---

## MCP Magic Workflow (per component)

1. Call `mcp__magic__21st_magic_component_builder` with detailed description
2. Receive variations
3. Present best variation to user
4. If approved → integrate
5. If not → refine description and re-call Magic
6. Proceed to next component
