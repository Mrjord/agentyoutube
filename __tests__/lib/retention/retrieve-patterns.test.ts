import { vi, describe, it, expect } from 'vitest';

vi.mock('@/lib/db/queries', () => ({
  getPatternsByToneAndDurationWithVideo: vi.fn(),
}));

import { formatPatternsForPrompt } from '@/lib/retention/retrieve-patterns';
import type { PatternWithVideo } from '@/lib/retention/retrieve-patterns';

const MOCK: PatternWithVideo[] = [
  {
    id: 'p1',
    videoId: 'v1',
    patternType: 'hook',
    content: { technique: 'question choc', opening_line: 'Est-ce que...?' },
    tone: 'viral',
    durationBucket: 'long',
    viralityScore: 10_000,
    createdAt: new Date(),
    videoTitle: 'Comment faire 100K€',
    videoChannel: 'PierreTech',
    videoViewCount: 14_700_000,
    videoSubscriberCount: 1_800_000,
    videoUrl: 'https://youtube.com/watch?v=test',
    videoAnalyzedAt: new Date(),
  },
];

describe('formatPatternsForPrompt', () => {
  it('includes pattern type and virality score', () => {
    const result = formatPatternsForPrompt(MOCK);
    expect(result).toContain('Pattern 1');
    expect(result).toContain('hook');
    expect(result).toContain('10000');
  });

  it('includes video source info', () => {
    const result = formatPatternsForPrompt(MOCK);
    expect(result).toContain('Comment faire 100K€');
    expect(result).toContain('PierreTech');
    expect(result).toContain('14.7M');
  });

  it('returns fallback message for empty array', () => {
    expect(formatPatternsForPrompt([])).toContain('Aucun pattern');
  });

  it('handles patterns without video source gracefully', () => {
    const noSource: PatternWithVideo[] = [{
      ...MOCK[0],
      videoTitle: null,
      videoChannel: null,
      videoViewCount: null,
      videoSubscriberCount: null,
      videoUrl: null,
      videoAnalyzedAt: null,
    }];
    const result = formatPatternsForPrompt(noSource);
    expect(result).toContain('Pattern 1');
    expect(result).not.toContain('Source :');
  });
});
