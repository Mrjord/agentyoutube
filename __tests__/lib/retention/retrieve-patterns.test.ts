import { vi, describe, it, expect } from 'vitest';

vi.mock('@/lib/db/queries', () => ({
  getPatternsByToneAndDuration: vi.fn(),
}));

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
