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
