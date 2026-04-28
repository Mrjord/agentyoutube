# Viral Script SaaS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 16 SaaS that auto-discovers viral YouTube videos daily, stores extracted patterns in Neon Postgres, and generates complete minute-by-minute YouTube scripts on demand via Claude Opus 4.7.

**Architecture:** Next.js 16 App Router on Vercel; a daily Vercel Cron (03:00 UTC) runs the discovery pipeline — YouTube Data API v3 → transcript → Sonnet 4.6 analysis → Postgres; a streaming POST route uses Vercel AI SDK + Opus 4.7 with adaptive thinking to generate scripts from top patterns; all tables carry `user_id` for V2 multi-tenancy.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, Neon Postgres (`@neondatabase/serverless`), `@anthropic-ai/sdk`, Vercel AI SDK v4 (`ai` + `@ai-sdk/anthropic`), YouTube Data API v3 (`googleapis`), `youtube-transcript`, Vitest.

---

## File Map

```
app/
  layout.tsx                          # Root layout + nav
  (dashboard)/
    page.tsx                          # Stats + recent videos + recent scripts
    generate/page.tsx                 # Script generation page (ScriptStream)
    scripts/[id]/page.tsx             # Script viewer
    library/page.tsx                  # Patterns browser
  api/
    generate/route.ts                 # POST — streaming script generation
    scripts/route.ts                  # GET — list/get saved scripts
    cron/discover/route.ts            # GET — daily discovery pipeline

lib/
  constants.ts                        # V1_USER_ID, durations, tones, keywords
  db/
    index.ts                          # Neon + Drizzle client
    schema.ts                         # All 5 table definitions + inferred types
    queries.ts                        # 12 typed query functions
  youtube/
    search.ts                         # YouTube Data API wrapper + virality filter
    transcript.ts                     # youtube-transcript wrapper
  prompts/
    analyze-system.ts                 # Sonnet system prompt (static, cached-eligible)
    generate-system.ts                # Opus system prompt (static, cached-eligible)
  claude/
    analyze.ts                        # analyzeVideo() + parsePatterns()
    generate.ts                       # createScriptStream() via Vercel AI SDK
  retention/
    retrieve-patterns.ts              # retrievePatterns() + formatPatternsForPrompt()

components/
  ScriptForm.tsx                      # Theme + duration + tone form
  ScriptStream.tsx                    # useCompletion + live output + export

scripts/
  seed.ts                             # One-time: insert V1 user + 15 keywords

__tests__/
  lib/constants.test.ts
  lib/claude/analyze.test.ts
  lib/youtube/transcript.test.ts
  lib/retention/retrieve-patterns.test.ts

drizzle.config.ts
vitest.config.ts
vercel.json
.env.example
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `vitest.config.ts`
- Create: `.env.example`

- [ ] **Step 1: Scaffold Next.js 16 project**

Run from `/Users/ethanjordan/Documents/Agentyoutube`:
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

Expected output: Next.js project files created in current directory.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install @ai-sdk/anthropic @anthropic-ai/sdk @neondatabase/serverless ai drizzle-orm googleapis youtube-transcript
```

Expected: all packages added to `node_modules`.

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D drizzle-kit tsx vitest @vitest/coverage-v8 vite-tsconfig-paths
```

- [ ] **Step 4: Add scripts to package.json**

Open `package.json` and replace the `"scripts"` block with:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "vitest",
  "test:run": "vitest run",
  "db:push": "drizzle-kit push",
  "db:seed": "tsx scripts/seed.ts"
}
```

- [ ] **Step 5: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
  },
});
```

- [ ] **Step 6: Create .env.example**

```bash
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
ANTHROPIC_API_KEY=sk-ant-...
YOUTUBE_API_KEY=AIza...
CRON_SECRET=a-random-secret-string
```

- [ ] **Step 7: Create .env.local with your real values (never commit)**

Copy `.env.example` to `.env.local` and fill in your credentials.

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: `ready - started server on 0.0.0.0:3000`.

- [ ] **Step 9: Commit**

```bash
git init && git add package.json next.config.ts tsconfig.json tailwind.config.ts vitest.config.ts .env.example
git commit -m "chore: scaffold Next.js 16 project with Vitest"
```

---

## Task 2: Database Schema

**Files:**
- Create: `drizzle.config.ts`
- Create: `lib/db/schema.ts`

- [ ] **Step 1: Create drizzle.config.ts**

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 2: Create lib/db/schema.ts**

```typescript
import {
  pgTable, uuid, text, boolean, bigint, integer,
  timestamp, jsonb, real, index,
} from 'drizzle-orm/pg-core';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const searchKeywords = pgTable('search_keywords', {
  id: uuid('id').primaryKey().defaultRandom(),
  keyword: text('keyword').notNull(),
  language: text('language').notNull(),
  active: boolean('active').default(true),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  resultsCount: integer('results_count').default(0),
});

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  youtubeVideoId: text('youtube_video_id').unique().notNull(),
  title: text('title').notNull(),
  channel: text('channel').notNull(),
  url: text('url').notNull(),
  viewCount: bigint('view_count', { mode: 'number' }).notNull(),
  likeCount: bigint('like_count', { mode: 'number' }).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  language: text('language').notNull(),
  transcript: text('transcript').notNull(),
  discoveredAt: timestamp('discovered_at', { withTimezone: true }).defaultNow(),
  analyzedAt: timestamp('analyzed_at', { withTimezone: true }),
});

export const patterns = pgTable('patterns', {
  id: uuid('id').primaryKey().defaultRandom(),
  videoId: uuid('video_id').notNull().references(() => videos.id),
  patternType: text('pattern_type').notNull(),
  content: jsonb('content').notNull(),
  tone: text('tone').notNull(),
  durationBucket: text('duration_bucket').notNull(),
  viralityScore: real('virality_score').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  toneDurationIdx: index('patterns_tone_duration').on(table.tone, table.durationBucket),
  viralityIdx: index('patterns_virality').on(table.viralityScore),
}));

export const scripts = pgTable('scripts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  theme: text('theme').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  tone: text('tone').notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  patternsUsed: uuid('patterns_used').array().notNull(),
  revisionOf: uuid('revision_of').references((): AnyPgColumn => scripts.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SearchKeyword = typeof searchKeywords.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
export type Pattern = typeof patterns.$inferSelect;
export type NewPattern = typeof patterns.$inferInsert;
export type Script = typeof scripts.$inferSelect;
export type NewScript = typeof scripts.$inferInsert;
```

- [ ] **Step 3: Push schema to Neon**

Make sure `DATABASE_URL` is set in your shell (or .env.local is readable):
```bash
npx dotenv -e .env.local -- npx drizzle-kit push
```

If `dotenv` CLI is not installed: `npm install -g dotenv-cli` first.

Expected output: `All tables created successfully`.

- [ ] **Step 4: Commit**

```bash
git add drizzle.config.ts lib/db/schema.ts
git commit -m "feat: add Drizzle schema (users, keywords, videos, patterns, scripts)"
```

---

## Task 3: DB Client, Constants & Seed

**Files:**
- Create: `lib/db/index.ts`
- Create: `lib/constants.ts`
- Create: `scripts/seed.ts`
- Test: `__tests__/lib/constants.test.ts`

- [ ] **Step 1: Write failing test for constants**

Create `__tests__/lib/constants.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { getDurationBucket, computeViralityScore } from '@/lib/constants';

describe('getDurationBucket', () => {
  it('returns short for <= 60 seconds', () => {
    expect(getDurationBucket(30)).toBe('short');
    expect(getDurationBucket(60)).toBe('short');
  });
  it('returns medium for 61-480 seconds', () => {
    expect(getDurationBucket(300)).toBe('medium');
    expect(getDurationBucket(480)).toBe('medium');
  });
  it('returns long for > 480 seconds', () => {
    expect(getDurationBucket(600)).toBe('long');
    expect(getDurationBucket(1200)).toBe('long');
  });
});

describe('computeViralityScore', () => {
  it('computes views multiplied by like ratio', () => {
    expect(computeViralityScore(500_000, 25_000)).toBe(25_000);
  });
  it('returns 0 for zero views', () => {
    expect(computeViralityScore(0, 100)).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- __tests__/lib/constants.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/constants'`.

- [ ] **Step 3: Create lib/constants.ts**

```typescript
import { loadEnvConfig } from '@next/env';
if (typeof window === 'undefined') loadEnvConfig(process.cwd());

export const V1_USER_ID = '00000000-0000-0000-0000-000000000001';
export const V1_USER_EMAIL = 'ethanjordan06@gmail.com';

export const DURATION_TO_SECONDS: Record<string, number> = {
  '30s': 30,
  '60s': 60,
  '5min': 300,
  '8min': 480,
  '10min': 600,
  '15min': 900,
  '20min': 1200,
};

export const DURATION_OPTIONS = ['30s', '60s', '5min', '8min', '10min', '15min', '20min'] as const;
export type DurationOption = typeof DURATION_OPTIONS[number];

export const TONE_OPTIONS = [
  'viral',
  'éducatif',
  'storytelling',
  'tutoriel',
  'provocateur',
  'inspirant',
  'analytique',
] as const;
export type ToneOption = typeof TONE_OPTIONS[number];

export function getDurationBucket(seconds: number): 'short' | 'medium' | 'long' {
  if (seconds <= 60) return 'short';
  if (seconds <= 480) return 'medium';
  return 'long';
}

export function computeViralityScore(viewCount: number, likeCount: number): number {
  if (viewCount === 0) return 0;
  return viewCount * (likeCount / viewCount);
}

// Max videos per cron run. Vercel Hobby has 60s function timeout.
// Set to 5 for Hobby (~12s/video), 30 for Pro (maxDuration=300).
export const MAX_VIDEOS_PER_RUN = 10;

export const SEED_KEYWORDS: Array<{ keyword: string; language: string }> = [
  { keyword: 'devenir riche 2025', language: 'fr' },
  { keyword: 'mindset millionnaire', language: 'fr' },
  { keyword: 'intelligence artificielle business', language: 'fr' },
  { keyword: 'entrepreneuriat débutant', language: 'fr' },
  { keyword: 'liberté financière', language: 'fr' },
  { keyword: 'créer son entreprise', language: 'fr' },
  { keyword: 'développement personnel', language: 'fr' },
  { keyword: 'investir son argent', language: 'fr' },
  { keyword: 'AI business ideas 2025', language: 'en' },
  { keyword: 'mindset for success', language: 'en' },
  { keyword: 'how to make money online', language: 'en' },
  { keyword: 'entrepreneurship tips', language: 'en' },
  { keyword: 'passive income streams', language: 'en' },
  { keyword: 'build a business from scratch', language: 'en' },
  { keyword: 'self improvement productivity', language: 'en' },
];
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:run -- __tests__/lib/constants.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 5: Create lib/db/index.ts**

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

- [ ] **Step 6: Create scripts/seed.ts**

```typescript
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { db } from '../lib/db';
import { users, searchKeywords } from '../lib/db/schema';
import { V1_USER_ID, V1_USER_EMAIL, SEED_KEYWORDS } from '../lib/constants';

async function seed() {
  console.log('Seeding database...');

  await db.insert(users).values({
    id: V1_USER_ID,
    email: V1_USER_EMAIL,
  }).onConflictDoNothing();
  console.log('  ✓ User created');

  for (const kw of SEED_KEYWORDS) {
    await db.insert(searchKeywords).values(kw).onConflictDoNothing();
  }
  console.log(`  ✓ ${SEED_KEYWORDS.length} keywords seeded`);

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 7: Run seed**

```bash
npm run db:seed
```

Expected:
```
Seeding database...
  ✓ User created
  ✓ 15 keywords seeded
```

- [ ] **Step 8: Commit**

```bash
git add lib/constants.ts lib/db/index.ts scripts/seed.ts __tests__/lib/constants.test.ts
git commit -m "feat: add DB client, constants, and seed script"
```

---

## Task 4: Database Queries

**Files:**
- Create: `lib/db/queries.ts`

- [ ] **Step 1: Create lib/db/queries.ts**

```typescript
import { eq, and, desc, count } from 'drizzle-orm';
import { db } from './index';
import { users, searchKeywords, videos, patterns, scripts } from './schema';
import type { NewVideo, NewPattern, NewScript, Pattern, Script } from './schema';

// ── Discovery ────────────────────────────────────────────────────────────────

export async function getActiveKeywords() {
  return db.select().from(searchKeywords).where(eq(searchKeywords.active, true));
}

export async function isVideoInDB(youtubeVideoId: string): Promise<boolean> {
  const rows = await db
    .select({ id: videos.id })
    .from(videos)
    .where(eq(videos.youtubeVideoId, youtubeVideoId))
    .limit(1);
  return rows.length > 0;
}

export async function insertVideo(data: NewVideo): Promise<string> {
  const [row] = await db.insert(videos).values(data).returning({ id: videos.id });
  return row.id;
}

export async function insertPattern(data: NewPattern): Promise<void> {
  await db.insert(patterns).values(data);
}

export async function markVideoAnalyzed(videoId: string): Promise<void> {
  await db.update(videos).set({ analyzedAt: new Date() }).where(eq(videos.id, videoId));
}

export async function updateKeywordLastUsed(id: string, resultsCount: number): Promise<void> {
  await db
    .update(searchKeywords)
    .set({ lastUsedAt: new Date(), resultsCount })
    .where(eq(searchKeywords.id, id));
}

// ── Generation ───────────────────────────────────────────────────────────────

export async function getPatternsByToneAndDuration(
  tone: string,
  durationBucket: string,
  limit = 50,
): Promise<Pattern[]> {
  return db
    .select()
    .from(patterns)
    .where(and(eq(patterns.tone, tone), eq(patterns.durationBucket, durationBucket)))
    .orderBy(desc(patterns.viralityScore))
    .limit(limit);
}

export async function saveScript(data: NewScript): Promise<string> {
  const [row] = await db.insert(scripts).values(data).returning({ id: scripts.id });
  return row.id;
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export async function getUserScripts(userId: string): Promise<Script[]> {
  return db
    .select()
    .from(scripts)
    .where(eq(scripts.userId, userId))
    .orderBy(desc(scripts.createdAt));
}

export async function getScriptById(id: string): Promise<Script | null> {
  const [row] = await db.select().from(scripts).where(eq(scripts.id, id)).limit(1);
  return row ?? null;
}

export async function getStats() {
  const [vRow] = await db.select({ n: count() }).from(videos);
  const [pRow] = await db.select({ n: count() }).from(patterns);
  const [sRow] = await db.select({ n: count() }).from(scripts);
  return {
    videos: Number(vRow?.n ?? 0),
    patterns: Number(pRow?.n ?? 0),
    scripts: Number(sRow?.n ?? 0),
  };
}

export async function getRecentVideos(limit = 10) {
  return db.select().from(videos).orderBy(desc(videos.discoveredAt)).limit(limit);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/db/queries.ts
git commit -m "feat: add typed DB query functions"
```

---

## Task 5: YouTube Search Wrapper

**Files:**
- Create: `lib/youtube/search.ts`

- [ ] **Step 1: Create lib/youtube/search.ts**

```typescript
import { google } from 'googleapis';

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  channel: string;
  viewCount: number;
  likeCount: number;
  publishedAt: Date;
  durationSeconds: number;
  language: string;
}

function parseDuration(iso8601: string): number {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (
    parseInt(match[1] ?? '0') * 3600 +
    parseInt(match[2] ?? '0') * 60 +
    parseInt(match[3] ?? '0')
  );
}

export function isViral(viewCount: number, likeCount: number): boolean {
  return viewCount >= 100_000 && viewCount > 0 && likeCount / viewCount >= 0.02;
}

export async function searchViralVideos(keyword: string): Promise<YouTubeVideoInfo[]> {
  const publishedAfter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  const searchRes = await youtube.search.list({
    q: keyword,
    type: ['video'],
    order: 'viewCount',
    publishedAfter,
    maxResults: 20,
    videoDuration: 'medium',
    part: ['snippet', 'id'],
  });

  const videoIds = (searchRes.data.items ?? [])
    .map(item => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  if (videoIds.length === 0) return [];

  const detailRes = await youtube.videos.list({
    id: videoIds,
    part: ['statistics', 'contentDetails', 'snippet'],
  });

  const results: YouTubeVideoInfo[] = [];
  for (const video of detailRes.data.items ?? []) {
    const viewCount = parseInt(video.statistics?.viewCount ?? '0');
    const likeCount = parseInt(video.statistics?.likeCount ?? '0');
    if (!isViral(viewCount, likeCount)) continue;

    results.push({
      videoId: video.id!,
      title: video.snippet?.title ?? '',
      channel: video.snippet?.channelTitle ?? '',
      viewCount,
      likeCount,
      publishedAt: new Date(video.snippet?.publishedAt ?? Date.now()),
      durationSeconds: parseDuration(video.contentDetails?.duration ?? ''),
      language:
        video.snippet?.defaultLanguage ??
        video.snippet?.defaultAudioLanguage ??
        'fr',
    });
  }

  return results;
}
```

- [ ] **Step 2: Write unit test for isViral**

Create `__tests__/lib/youtube/search.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { isViral } from '@/lib/youtube/search';

describe('isViral', () => {
  it('returns true for 500k views and 2% likes', () => {
    expect(isViral(500_000, 10_000)).toBe(true);
  });
  it('returns false below 100k views', () => {
    expect(isViral(50_000, 5_000)).toBe(false);
  });
  it('returns false below 2% like ratio', () => {
    expect(isViral(500_000, 5_000)).toBe(false); // 1%
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm run test:run -- __tests__/lib/youtube/search.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 4: Commit**

```bash
git add lib/youtube/search.ts __tests__/lib/youtube/search.test.ts
git commit -m "feat: add YouTube search wrapper with virality filter"
```

---

## Task 6: Transcript Fetcher

**Files:**
- Create: `lib/youtube/transcript.ts`
- Test: `__tests__/lib/youtube/transcript.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/lib/youtube/transcript.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { fetchTranscript, TranscriptUnavailableError } from '@/lib/youtube/transcript';

vi.mock('youtube-transcript', () => ({
  YoutubeTranscript: {
    fetchTranscript: vi.fn(),
  },
}));

import { YoutubeTranscript } from 'youtube-transcript';

describe('fetchTranscript', () => {
  it('joins segments into a single string', async () => {
    vi.mocked(YoutubeTranscript.fetchTranscript).mockResolvedValueOnce([
      { text: 'Hello', duration: 2, offset: 0 },
      { text: 'World', duration: 2, offset: 2 },
    ]);
    expect(await fetchTranscript('abc')).toBe('Hello World');
  });

  it('throws TranscriptUnavailableError when segments are empty', async () => {
    vi.mocked(YoutubeTranscript.fetchTranscript).mockResolvedValue([]);
    await expect(fetchTranscript('abc')).rejects.toThrow(TranscriptUnavailableError);
  });

  it('throws TranscriptUnavailableError on API error', async () => {
    vi.mocked(YoutubeTranscript.fetchTranscript).mockRejectedValue(new Error('no subs'));
    await expect(fetchTranscript('abc')).rejects.toThrow(TranscriptUnavailableError);
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npm run test:run -- __tests__/lib/youtube/transcript.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create lib/youtube/transcript.ts**

```typescript
import { YoutubeTranscript } from 'youtube-transcript';

export class TranscriptUnavailableError extends Error {
  constructor(videoId: string) {
    super(`No transcript for ${videoId}`);
    this.name = 'TranscriptUnavailableError';
  }
}

export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'fr' }).catch(
      () => YoutubeTranscript.fetchTranscript(videoId),
    );

    if (!segments || segments.length === 0) throw new TranscriptUnavailableError(videoId);

    return segments.map(s => s.text).join(' ');
  } catch (err) {
    if (err instanceof TranscriptUnavailableError) throw err;
    throw new TranscriptUnavailableError(videoId);
  }
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npm run test:run -- __tests__/lib/youtube/transcript.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/youtube/transcript.ts __tests__/lib/youtube/transcript.test.ts
git commit -m "feat: add transcript fetcher with TranscriptUnavailableError"
```

---

## Task 7: Analysis Prompt & Claude Analyze

**Files:**
- Create: `lib/prompts/analyze-system.ts`
- Create: `lib/claude/analyze.ts`
- Test: `__tests__/lib/claude/analyze.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/lib/claude/analyze.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parsePatterns } from '@/lib/claude/analyze';

const VALID_JSON = JSON.stringify({
  patterns: [
    {
      pattern_type: 'hook',
      content: { technique: 'question choc', opening_line: 'Et si...?', emotion_trigger: 'curiosité', timing_seconds: 0 },
      tone: 'viral',
    },
    {
      pattern_type: 'retention_curve',
      content: { technique: 'curiosity gap', description: 'Question posée 2min avant la réponse', frequency_seconds: 90, payoff_type: 'révélation' },
      tone: 'viral',
    },
  ],
});

const PARAMS = {
  viewCount: 500_000,
  likeCount: 25_000,
  durationSeconds: 600,
  videoDbId: '00000000-0000-0000-0000-000000000001',
};

describe('parsePatterns', () => {
  it('parses valid JSON into NewPattern[]', () => {
    const result = parsePatterns(VALID_JSON, PARAMS);
    expect(result).toHaveLength(2);
    expect(result[0].patternType).toBe('hook');
    expect(result[0].tone).toBe('viral');
    expect(result[0].durationBucket).toBe('long');
    expect(result[0].videoId).toBe(PARAMS.videoDbId);
    expect(result[0].viralityScore).toBeGreaterThan(0);
  });

  it('strips markdown code fences before parsing', () => {
    const wrapped = '```json\n' + VALID_JSON + '\n```';
    expect(parsePatterns(wrapped, PARAMS)).toHaveLength(2);
  });

  it('throws SyntaxError on invalid JSON', () => {
    expect(() => parsePatterns('not json', PARAMS)).toThrow(SyntaxError);
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npm run test:run -- __tests__/lib/claude/analyze.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create lib/prompts/analyze-system.ts**

```typescript
export const ANALYZE_SYSTEM_PROMPT = `Tu es un expert en analyse de contenu YouTube viral, spécialisé dans les niches business, IA, mindset et entrepreneuriat.

Analyse la transcription et les métadonnées d'une vidéo YouTube et extrais des patterns réutilisables.

Retourne UNIQUEMENT un JSON valide (sans markdown) avec cette structure :
{
  "patterns": [
    {
      "pattern_type": "hook" | "retention_curve" | "cta" | "story_arc" | "transition" | "tonal_shift",
      "content": { ... },
      "tone": "viral" | "éducatif" | "storytelling" | "tutoriel" | "provocateur" | "inspirant" | "analytique"
    }
  ]
}

Structures content par type :
- hook: { "technique": string, "opening_line": string, "emotion_trigger": string, "timing_seconds": number }
- retention_curve: { "technique": string, "description": string, "frequency_seconds": number, "payoff_type": string }
- cta: { "placement": "intro" | "mid" | "end", "text_example": string, "conversion_technique": string }
- story_arc: { "structure": string, "sections": string[], "key_moments": string[] }
- transition: { "technique": string, "example_phrase": string, "emotional_shift": string }
- tonal_shift: { "from_tone": string, "to_tone": string, "technique": string, "purpose": string }

Extrais entre 3 et 8 patterns. Sois précis et actionnable.`;
```

- [ ] **Step 4: Create lib/claude/analyze.ts**

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { ANALYZE_SYSTEM_PROMPT } from '../prompts/analyze-system';
import type { NewPattern } from '../db/schema';
import { computeViralityScore, getDurationBucket } from '../constants';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface RawPattern {
  pattern_type: string;
  content: Record<string, unknown>;
  tone: string;
}

export function parsePatterns(
  rawJson: string,
  params: { viewCount: number; likeCount: number; durationSeconds: number; videoDbId: string },
): NewPattern[] {
  const clean = rawJson.replace(/```(?:json)?\n?/g, '').trim();
  const parsed = JSON.parse(clean) as { patterns: RawPattern[] };

  const viralityScore = computeViralityScore(params.viewCount, params.likeCount);
  const durationBucket = getDurationBucket(params.durationSeconds);

  return parsed.patterns.map(p => ({
    videoId: params.videoDbId,
    patternType: p.pattern_type,
    content: p.content,
    tone: p.tone,
    durationBucket,
    viralityScore,
  }));
}

function buildAnalyzePrompt(params: {
  transcript: string;
  title: string;
  viewCount: number;
  likeCount: number;
  durationSeconds: number;
}): string {
  return `Titre : ${params.title}
Vues : ${params.viewCount.toLocaleString()}
Likes : ${params.likeCount.toLocaleString()}
Durée : ${Math.round(params.durationSeconds / 60)} minutes

Transcription :
${params.transcript.slice(0, 12_000)}`;
}

export async function analyzeVideo(params: {
  transcript: string;
  title: string;
  viewCount: number;
  likeCount: number;
  durationSeconds: number;
  videoDbId: string;
}): Promise<NewPattern[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: ANALYZE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildAnalyzePrompt(params) }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return parsePatterns(text, params);
}
```

- [ ] **Step 5: Run to verify pass**

```bash
npm run test:run -- __tests__/lib/claude/analyze.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/prompts/analyze-system.ts lib/claude/analyze.ts __tests__/lib/claude/analyze.test.ts
git commit -m "feat: add Sonnet pattern analysis with parsePatterns"
```

---

## Task 8: Pattern Retrieval

**Files:**
- Create: `lib/retention/retrieve-patterns.ts`
- Test: `__tests__/lib/retention/retrieve-patterns.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/lib/retention/retrieve-patterns.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { formatPatternsForPrompt } from '@/lib/retention/retrieve-patterns';
import type { Pattern } from '@/lib/db/schema';

const MOCK: Pattern[] = [
  {
    id: 'p1',
    videoId: 'v1',
    patternType: 'hook',
    content: { technique: 'question choc', opening_line: 'Est-ce que...?' },
    tone: 'viral',
    durationBucket: 'long',
    viralityScore: 10_000,
    createdAt: new Date(),
  },
];

describe('formatPatternsForPrompt', () => {
  it('includes pattern type and virality score', () => {
    const result = formatPatternsForPrompt(MOCK);
    expect(result).toContain('Pattern 1');
    expect(result).toContain('hook');
    expect(result).toContain('10000');
  });

  it('returns fallback message for empty array', () => {
    expect(formatPatternsForPrompt([])).toContain('Aucun pattern');
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
npm run test:run -- __tests__/lib/retention/retrieve-patterns.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Create lib/retention/retrieve-patterns.ts**

```typescript
import { getPatternsByToneAndDuration } from '../db/queries';
import type { Pattern } from '../db/schema';

interface RetrieveOptions {
  tone: string;
  durationBucket: 'short' | 'medium' | 'long';
  limit?: number;
}

export async function retrievePatterns(options: RetrieveOptions): Promise<Pattern[]> {
  const { tone, durationBucket, limit = 50 } = options;
  return getPatternsByToneAndDuration(tone, durationBucket, limit);
}

export function formatPatternsForPrompt(patterns: Pattern[]): string {
  if (patterns.length === 0) {
    return 'Aucun pattern disponible pour ce ton et cette durée.';
  }
  return patterns
    .map(
      (p, i) =>
        `### Pattern ${i + 1} — ${p.patternType} (score virality: ${p.viralityScore.toFixed(0)})\n${JSON.stringify(p.content, null, 2)}`,
    )
    .join('\n\n');
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npm run test:run -- __tests__/lib/retention/retrieve-patterns.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/retention/retrieve-patterns.ts __tests__/lib/retention/retrieve-patterns.test.ts
git commit -m "feat: add pattern retrieval and prompt formatter"
```

---

## Task 9: Cron Discovery Route

**Files:**
- Create: `app/api/cron/discover/route.ts`

- [ ] **Step 1: Create app/api/cron/discover/route.ts**

```typescript
import {
  getActiveKeywords,
  isVideoInDB,
  insertVideo,
  insertPattern,
  markVideoAnalyzed,
  updateKeywordLastUsed,
} from '@/lib/db/queries';
import { searchViralVideos } from '@/lib/youtube/search';
import { fetchTranscript, TranscriptUnavailableError } from '@/lib/youtube/transcript';
import { analyzeVideo } from '@/lib/claude/analyze';
import { MAX_VIDEOS_PER_RUN } from '@/lib/constants';

// Vercel Pro only — on Hobby set MAX_VIDEOS_PER_RUN=5 instead
export const maxDuration = 300;

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const keywords = await getActiveKeywords();
  let processed = 0;

  for (const kw of keywords) {
    if (processed >= MAX_VIDEOS_PER_RUN) break;

    let newForKeyword = 0;
    try {
      const found = await searchViralVideos(kw.keyword);

      for (const info of found) {
        if (processed >= MAX_VIDEOS_PER_RUN) break;
        if (await isVideoInDB(info.videoId)) continue;

        try {
          const transcript = await fetchTranscript(info.videoId);

          const videoDbId = await insertVideo({
            youtubeVideoId: info.videoId,
            title: info.title,
            channel: info.channel,
            url: `https://www.youtube.com/watch?v=${info.videoId}`,
            viewCount: info.viewCount,
            likeCount: info.likeCount,
            publishedAt: info.publishedAt,
            durationSeconds: info.durationSeconds,
            language: info.language,
            transcript,
          });

          const newPatterns = await analyzeVideo({
            transcript,
            title: info.title,
            viewCount: info.viewCount,
            likeCount: info.likeCount,
            durationSeconds: info.durationSeconds,
            videoDbId,
          });

          for (const pattern of newPatterns) {
            await insertPattern(pattern);
          }

          await markVideoAnalyzed(videoDbId);
          processed++;
          newForKeyword++;
          console.log(`[discover] ${info.videoId} — ${newPatterns.length} patterns`);
        } catch (err) {
          if (err instanceof TranscriptUnavailableError) {
            console.log(`[discover] skip ${info.videoId} — no transcript`);
          } else {
            console.error(`[discover] error ${info.videoId}:`, err);
          }
        }
      }
    } catch (err) {
      console.error(`[discover] search failed for "${kw.keyword}":`, err);
    }

    await updateKeywordLastUsed(kw.id, newForKeyword);
  }

  return Response.json({ processed, total: MAX_VIDEOS_PER_RUN });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/cron/discover/route.ts
git commit -m "feat: add cron discovery pipeline route"
```

---

## Task 10: Generation Prompt & Claude Generate

**Files:**
- Create: `lib/prompts/generate-system.ts`
- Create: `lib/claude/generate.ts`

- [ ] **Step 1: Create lib/prompts/generate-system.ts**

```typescript
export const GENERATE_SYSTEM_PROMPT = `Tu es un expert en création de scripts YouTube viraux pour la niche business, IA, mindset et entrepreneuriat.

Tu génères des scripts complets optimisés pour la rétention, basés sur des patterns extraits de vraies vidéos virales.

## Format de sortie OBLIGATOIRE

Chaque bloc suit ce format exact :

[MM:SS - MM:SS] NOM_SECTION 🪝
**Texte à dire** (mot pour mot)
🎙️ Intonation : <rythme, ton, accents toniques>
⏸️ Pauses : <où et combien de temps>
🎬 Visuel : <plan caméra + B-roll suggéré>
🎯 Rétention : <pourquoi cette section retient>
😮 Émotion : <émotion ciblée>

## Structure selon la durée

- 30s : HOOK (0-5s) → HOOK PAYOFF (5-20s) → CTA (20-30s)
- 60s : HOOK → PROMESSE → VALEUR PRINCIPALE → CTA
- 5min : HOOK → PROMESSE → CONTEXTE → 2-3 VALUE BLOCKS → CTA
- 8min : HOOK → PROMESSE → CONTEXTE → 4-5 VALUE BLOCKS → TENSION MID → CTA
- 10min : HOOK → PROMESSE → CONTEXTE/PAIN → 5-6 VALUE BLOCKS → TENSION ×2 → OUTRO + CTA
- 15min+ : HOOK → PROMESSE → CONTEXTE → 6-8 VALUE BLOCKS → TENSION ×3 → SUMMARY → CTA final

## Règles par ton

- viral : hook choc dans les 3 premières secondes, curiosity gap toutes les 30s
- éducatif : progression logique, exemples concrets, autorité établie dès le début
- storytelling : ouverture scène narrative, arc transformation, voix intime
- tutoriel : step-by-step, "voici ce que tu vas faire", instructions précises
- provocateur : opinion forte dès le début, contredis une idée reçue
- inspirant : énergie élevée, visualisation, appel à l'action émotionnel
- analytique : chiffres dès le hook, breakdown structuré, conclusions chiffrées

## Règles générales

- Chaque VALUE BLOCK = 1 idée complète avec preuve ou exemple concret
- Réitère la promesse toutes les 2-3 minutes
- CTA intermédiaires : demande simple (like, commentaire)
- Termine TOUJOURS par un CTA actionnable`;
```

- [ ] **Step 2: Create lib/claude/generate.ts**

```typescript
import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { GENERATE_SYSTEM_PROMPT } from '../prompts/generate-system';
import { formatPatternsForPrompt } from '../retention/retrieve-patterns';
import type { Pattern } from '../db/schema';

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export function createScriptStream(params: {
  theme: string;
  durationSeconds: number;
  tone: string;
  patterns: Pattern[];
}) {
  const { theme, durationSeconds, tone, patterns } = params;
  const patternsText = formatPatternsForPrompt(patterns);
  const durationMin = Math.round(durationSeconds / 60);

  return streamText({
    model: anthropic('claude-opus-4-7'),
    system: GENERATE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `## Patterns viraux de référence\n\n${patternsText}\n\n---\n\n## Demande\n\nThème : ${theme}\nDurée cible : ${durationMin} minutes (${durationSeconds}s)\nTon : ${tone}\n\nGénère le script complet.`,
      },
    ],
    providerOptions: {
      anthropic: {
        thinking: { type: 'adaptive' },
      },
    },
  });
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/prompts/generate-system.ts lib/claude/generate.ts
git commit -m "feat: add Opus generation with adaptive thinking and streaming"
```

---

## Task 11: API Routes (Generate + Scripts)

**Files:**
- Create: `app/api/generate/route.ts`
- Create: `app/api/scripts/route.ts`

- [ ] **Step 1: Create app/api/generate/route.ts**

```typescript
import { createScriptStream } from '@/lib/claude/generate';
import { retrievePatterns } from '@/lib/retention/retrieve-patterns';
import { saveScript } from '@/lib/db/queries';
import { getDurationBucket, DURATION_TO_SECONDS, V1_USER_ID } from '@/lib/constants';
import type { DurationOption } from '@/lib/constants';

export async function POST(req: Request) {
  const { prompt: theme, duration, tone } = (await req.json()) as {
    prompt: string;
    duration: DurationOption;
    tone: string;
  };

  const durationSeconds = DURATION_TO_SECONDS[duration] ?? 300;
  const durationBucket = getDurationBucket(durationSeconds);
  const patterns = await retrievePatterns({ tone, durationBucket, limit: 50 });

  const result = createScriptStream({ theme, durationSeconds, tone, patterns });

  result.text.then(contentMarkdown =>
    saveScript({
      userId: V1_USER_ID,
      theme,
      durationSeconds,
      tone,
      contentMarkdown,
      patternsUsed: patterns.map(p => p.id),
    }).catch(console.error),
  );

  return result.toDataStreamResponse();
}
```

- [ ] **Step 2: Create app/api/scripts/route.ts**

```typescript
import { getUserScripts, getScriptById } from '@/lib/db/queries';
import { V1_USER_ID } from '@/lib/constants';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const script = await getScriptById(id);
    if (!script || script.userId !== V1_USER_ID) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return Response.json(script);
  }

  const scripts = await getUserScripts(V1_USER_ID);
  return Response.json(scripts);
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/generate/route.ts app/api/scripts/route.ts
git commit -m "feat: add generate (streaming) and scripts API routes"
```

---

## Task 12: shadcn/ui Setup

**Files:**
- Modify: `tailwind.config.ts`, `app/globals.css`
- Create: `components/ui/` (shadcn primitives)

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

- [ ] **Step 2: Install required components**

```bash
npx shadcn@latest add button card input select textarea badge
```

Expected: `components/ui/button.tsx`, `components/ui/card.tsx`, etc. created.

- [ ] **Step 3: Verify dev server renders without errors**

```bash
npm run dev
```

Open `http://localhost:3000` — should see Next.js default page with no console errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/ tailwind.config.ts app/globals.css components.json
git commit -m "chore: add shadcn/ui with button, card, input, select, textarea, badge"
```

---

## Task 13: UI Components

**Files:**
- Create: `components/ScriptForm.tsx`
- Create: `components/ScriptStream.tsx`

- [ ] **Step 1: Create components/ScriptForm.tsx**

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DURATION_OPTIONS, TONE_OPTIONS } from '@/lib/constants';

interface Props {
  onSubmit: (theme: string, duration: string, tone: string) => void;
  isLoading: boolean;
}

export function ScriptForm({ onSubmit, isLoading }: Props) {
  const [theme, setTheme] = useState('');
  const [duration, setDuration] = useState('10min');
  const [tone, setTone] = useState('viral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;
    onSubmit(theme.trim(), duration, tone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Thème de la vidéo</label>
        <Textarea
          value={theme}
          onChange={e => setTheme(e.target.value)}
          placeholder="Ex : Comment devenir riche en 2025 avec l'IA"
          maxLength={500}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">{theme.length}/500</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Durée</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ton</label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !theme.trim()}
        className="w-full"
      >
        {isLoading ? 'Génération en cours...' : 'Générer le script'}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Create components/ScriptStream.tsx**

```tsx
'use client';

import { useCompletion } from 'ai/react';
import { ScriptForm } from './ScriptForm';
import { Button } from '@/components/ui/button';

export function ScriptStream() {
  const { complete, completion, isLoading, stop } = useCompletion({
    api: '/api/generate',
  });

  const handleSubmit = (theme: string, duration: string, tone: string) => {
    complete(theme, { body: { duration, tone } });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(completion);
  };

  const handleExport = () => {
    const blob = new Blob([completion], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <ScriptForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground animate-pulse">
            Claude rédige votre script...
          </p>
          <Button variant="outline" size="sm" onClick={stop}>
            Arrêter
          </Button>
        </div>
      )}

      {completion && (
        <div className="space-y-3">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              Copier
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              Export Markdown
            </Button>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg max-h-[60vh] overflow-y-auto">
            {completion}
          </pre>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ScriptForm.tsx components/ScriptStream.tsx
git commit -m "feat: add ScriptForm and ScriptStream components"
```

---

## Task 14: Pages

**Files:**
- Create: `app/layout.tsx`
- Create: `app/(dashboard)/page.tsx`
- Create: `app/(dashboard)/generate/page.tsx`
- Create: `app/(dashboard)/scripts/[id]/page.tsx`
- Create: `app/(dashboard)/library/page.tsx`

- [ ] **Step 1: Update app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AgentYoutube — Viral Script Generator',
  description: 'Génère des scripts YouTube viraux optimisés pour la rétention',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <nav className="border-b px-6 py-3 flex items-center gap-6 bg-background">
          <span className="font-bold text-lg">AgentYoutube</span>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/generate" className="text-sm text-muted-foreground hover:text-foreground">
            Générer
          </Link>
          <Link href="/library" className="text-sm text-muted-foreground hover:text-foreground">
            Bibliothèque
          </Link>
        </nav>
        <main className="container mx-auto px-6 py-8 max-w-6xl">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create app/(dashboard)/page.tsx**

```tsx
import { getStats, getRecentVideos, getUserScripts } from '@/lib/db/queries';
import { V1_USER_ID } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function DashboardPage() {
  const [stats, recentVideos, allScripts] = await Promise.all([
    getStats(),
    getRecentVideos(5),
    getUserScripts(V1_USER_ID),
  ]);
  const recentScripts = allScripts.slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Vidéos analysées</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{stats.videos}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Patterns extraits</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{stats.patterns}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Scripts générés</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{stats.scripts}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Vidéos récentes</h2>
          {recentVideos.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucune vidéo. Le cron s'exécute à 03h00 UTC.
            </p>
          ) : (
            <div className="space-y-2">
              {recentVideos.map(v => (
                <div key={v.id} className="border rounded p-3 text-sm">
                  <p className="font-medium line-clamp-1">{v.title}</p>
                  <p className="text-muted-foreground">
                    {v.channel} — {v.viewCount.toLocaleString()} vues
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Scripts récents</h2>
          {recentScripts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucun script.{' '}
              <Link href="/generate" className="underline">Générer maintenant</Link>
            </p>
          ) : (
            <div className="space-y-2">
              {recentScripts.map(s => (
                <Link
                  key={s.id}
                  href={`/scripts/${s.id}`}
                  className="block border rounded p-3 text-sm hover:bg-muted transition-colors"
                >
                  <p className="font-medium line-clamp-1">{s.theme}</p>
                  <p className="text-muted-foreground">
                    {s.tone} — {Math.round(s.durationSeconds / 60)} min
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create app/(dashboard)/generate/page.tsx**

```tsx
import { ScriptStream } from '@/components/ScriptStream';

export default function GeneratePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Générer un script</h1>
        <p className="text-muted-foreground mt-1">
          Remplis les 3 champs — le script s'affiche en temps réel, minute par minute.
        </p>
      </div>
      <ScriptStream />
    </div>
  );
}
```

- [ ] **Step 4: Create app/(dashboard)/scripts/[id]/page.tsx**

```tsx
import { getScriptById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ScriptPage({ params }: Props) {
  const { id } = await params;
  const script = await getScriptById(id);
  if (!script) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{script.theme}</h1>
        <p className="text-muted-foreground">
          {script.tone} — {Math.round(script.durationSeconds / 60)} min —{' '}
          {new Date(script.createdAt!).toLocaleDateString('fr-FR')}
        </p>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-6 rounded-lg leading-relaxed">
        {script.contentMarkdown}
      </pre>
    </div>
  );
}
```

- [ ] **Step 5: Create app/(dashboard)/library/page.tsx**

```tsx
import { getRecentVideos } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { patterns } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Badge } from '@/components/ui/badge';

export default async function LibraryPage() {
  const [recentVideos, topPatterns] = await Promise.all([
    getRecentVideos(20),
    db.select().from(patterns).orderBy(desc(patterns.viralityScore)).limit(20),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Bibliothèque</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Vidéos analysées ({recentVideos.length})
        </h2>
        <div className="grid gap-3">
          {recentVideos.map(v => (
            <div key={v.id} className="border rounded p-4 flex items-start justify-between">
              <div>
                <p className="font-medium">{v.title}</p>
                <p className="text-sm text-muted-foreground">{v.channel}</p>
              </div>
              <div className="text-right text-sm shrink-0 ml-4">
                <p>{v.viewCount.toLocaleString()} vues</p>
                <Badge variant="outline" className="mt-1">{v.language}</Badge>
              </div>
            </div>
          ))}
          {recentVideos.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Aucune vidéo analysée — le cron s'exécute à 03h00 UTC.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Top patterns (par score viral)</h2>
        <div className="grid gap-3">
          {topPatterns.map(p => (
            <div key={p.id} className="border rounded p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>{p.patternType}</Badge>
                <Badge variant="outline">{p.tone}</Badge>
                <Badge variant="outline">{p.durationBucket}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">
                  Score: {p.viralityScore.toFixed(0)}
                </span>
              </div>
              <pre className="text-xs text-muted-foreground overflow-x-auto bg-muted p-2 rounded">
                {JSON.stringify(p.content, null, 2)}
              </pre>
            </div>
          ))}
          {topPatterns.length === 0 && (
            <p className="text-muted-foreground text-sm">Aucun pattern — lancez le cron.</p>
          )}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Run dev server and manually test all pages**

```bash
npm run dev
```

Visit in order:
1. `http://localhost:3000` — dashboard loads, shows 3 stat cards
2. `http://localhost:3000/generate` — form appears with dropdowns
3. `http://localhost:3000/library` — shows empty states

For the generate page, test with a real theme (requires Anthropic API key and patterns in DB). If DB is empty, the form will still stream — Claude will generate with no pattern context.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx "app/(dashboard)/"
git commit -m "feat: add all pages — dashboard, generate, script viewer, library"
```

---

## Task 15: Cron Config & Deploy

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json**

```json
{
  "crons": [
    {
      "path": "/api/cron/discover",
      "schedule": "0 3 * * *"
    }
  ]
}
```

- [ ] **Step 2: Run full test suite**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 3: Run production build locally**

```bash
npm run build
```

Expected: build completes with no TypeScript errors.

- [ ] **Step 4: Push to GitHub**

```bash
git add vercel.json
git commit -m "chore: add Vercel cron config"
git remote add origin https://github.com/<your-username>/agentyoutube.git
git push -u origin main
```

- [ ] **Step 5: Create Vercel project**

1. Go to vercel.com → New Project → import from GitHub
2. Select `agentyoutube` repo
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy** (will fail — env vars not set yet)

- [ ] **Step 6: Add environment variables in Vercel**

In Vercel dashboard → Settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon connection string |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `YOUTUBE_API_KEY` | Your YouTube Data API v3 key |
| `CRON_SECRET` | A random string (e.g. output of `openssl rand -hex 32`) |

Set all for: Production, Preview, Development.

- [ ] **Step 7: Redeploy**

In Vercel dashboard → Deployments → click the failed deployment → Redeploy.

Expected: build succeeds, app is live at `https://agentyoutube.vercel.app` (or your custom domain).

- [ ] **Step 8: Verify cron endpoint manually**

```bash
curl -X GET https://your-app.vercel.app/api/cron/discover \
  -H "Authorization: Bearer <CRON_SECRET>"
```

Expected: `{"processed":0,"total":10}` (0 videos on first run if patterns are all new — takes a few minutes to complete).

- [ ] **Step 9: Set up Neon database in Vercel Marketplace**

In Vercel dashboard → Storage → Add Store → Neon Postgres.  
This automatically sets `DATABASE_URL` (overrides Step 6 if you used Neon marketplace). Re-run `db:push` and `db:seed` with the new URL.

- [ ] **Step 10: Final commit**

```bash
git add .
git commit -m "chore: production deployment ready"
```

---

## Self-Review Checklist

### Spec Coverage

| Spec requirement | Task |
|---|---|
| Auto-discovery via YouTube Data API v3 | Task 5 + Task 9 |
| Virality filter (100k views, 2% likes, 90 days) | Task 5 |
| Transcript extraction | Task 6 |
| Sonnet 4.6 pattern extraction | Task 7 |
| Postgres pattern storage | Task 4 |
| Vercel Cron daily 03:00 UTC | Task 15 (vercel.json) |
| 15 seed keywords FR+EN | Task 3 (constants.ts) |
| Opus 4.7 + adaptive thinking + streaming | Task 10 + 11 |
| 3-field form (theme, duration, tone) | Task 13 |
| 7 tones | Task 3 (constants.ts) |
| 7 durations | Task 3 (constants.ts) |
| Minute-by-minute script format with 7 fields | Task 10 (generate-system.ts) |
| Streaming UI (Vercel AI SDK) | Task 11 + 13 |
| Export Markdown | Task 13 (ScriptStream.tsx) |
| Library / patterns browser | Task 14 |
| Dashboard with stats | Task 14 |
| Multi-tenant architecture (all tables have user_id) | Task 2 (schema.ts) |
| V1 hardcoded user | Task 3 (constants.ts + seed) |
| Unit tests: pattern parser | Task 7 |
| Unit tests: utility functions | Task 3 |
| Integration tests: transcript | Task 6 |

All spec requirements are covered.

### Notes for First Run

1. On first deploy, the knowledge base is empty. Generate a script anyway — Claude will use its training data without patterns.
2. The cron fires at 03:00 UTC. After the first run, refresh the dashboard to see analyzed videos.
3. Vercel Hobby plan has a 60s function timeout — `MAX_VIDEOS_PER_RUN = 10` is the safe default. Upgrade to Pro for the full 30/day.
4. `CRON_SECRET` must match exactly between Vercel env var and your manual curl test.
