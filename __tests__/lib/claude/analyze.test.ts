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
