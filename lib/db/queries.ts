import { eq, and, desc, count, isNotNull } from 'drizzle-orm';
import { db } from './index';
import { users, searchKeywords, videos, patterns, scripts } from './schema';
import type { NewVideo, NewPattern, NewScript, Pattern, Script } from './schema';

export type PatternWithVideo = Pattern & {
  videoTitle: string | null;
  videoChannel: string | null;
  videoViewCount: number | null;
  videoSubscriberCount: number | null;
  videoUrl: string | null;
  videoAnalyzedAt: Date | null;
};

// ── Discovery ────────────────────────────────────────────────────────────────

export async function getActiveKeywords() {
  return db.select().from(searchKeywords).where(eq(searchKeywords.active, true));
}

export async function isVideoInDB(youtubeVideoId: string): Promise<boolean> {
  const rows = await db
    .select({ id: videos.id })
    .from(videos)
    .where(and(eq(videos.youtubeVideoId, youtubeVideoId), isNotNull(videos.analyzedAt)))
    .limit(1);
  return rows.length > 0;
}

export async function insertVideo(data: NewVideo): Promise<string> {
  const [row] = await db
    .insert(videos)
    .values(data)
    .onConflictDoNothing()
    .returning({ id: videos.id });
  if (row) return row.id;
  // Already exists (partial insert from a previous failed run) — get its ID
  const [existing] = await db
    .select({ id: videos.id })
    .from(videos)
    .where(eq(videos.youtubeVideoId, data.youtubeVideoId))
    .limit(1);
  return existing.id;
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

export async function getPatternsByToneAndDurationWithVideo(
  tone: string,
  durationBucket: string,
  limit = 150,
): Promise<PatternWithVideo[]> {
  return db
    .select({
      id: patterns.id,
      videoId: patterns.videoId,
      patternType: patterns.patternType,
      content: patterns.content,
      tone: patterns.tone,
      durationBucket: patterns.durationBucket,
      viralityScore: patterns.viralityScore,
      createdAt: patterns.createdAt,
      videoTitle: videos.title,
      videoChannel: videos.channel,
      videoViewCount: videos.viewCount,
      videoSubscriberCount: videos.subscriberCount,
      videoUrl: videos.url,
      videoAnalyzedAt: videos.analyzedAt,
    })
    .from(patterns)
    .leftJoin(videos, eq(patterns.videoId, videos.id))
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

export async function getTopPatterns(limit = 200) {
  return db
    .select({
      id: patterns.id,
      patternType: patterns.patternType,
      content: patterns.content,
      tone: patterns.tone,
      durationBucket: patterns.durationBucket,
      viralityScore: patterns.viralityScore,
      createdAt: patterns.createdAt,
      videoTitle: videos.title,
      videoChannel: videos.channel,
      videoUrl: videos.url,
      videoViewCount: videos.viewCount,
    })
    .from(patterns)
    .leftJoin(videos, eq(patterns.videoId, videos.id))
    .orderBy(desc(patterns.viralityScore))
    .limit(limit);
}

export async function getRecentScripts(userId: string, limit = 5): Promise<Script[]> {
  return db
    .select()
    .from(scripts)
    .where(eq(scripts.userId, userId))
    .orderBy(desc(scripts.createdAt))
    .limit(limit);
}
