import { describe, it, expect } from 'vitest';
import { isViral } from '@/lib/youtube/search';

describe('isViral', () => {
  it('returns true for viral small channel: 500K views, 5% likes, 1% comments, 10K subs (50× ratio), 10min', () => {
    expect(isViral(500_000, 25_000, 10_000, 5_000, 600)).toBe(true);
  });

  it('returns false for big channel underperforming: 500K views, 3% likes, 1M subs (0.5× ratio)', () => {
    expect(isViral(500_000, 15_000, 1_000_000, 5_000, 600)).toBe(false);
  });

  it('returns false below 3% like rate', () => {
    expect(isViral(500_000, 10_000, 5_000, 5_000, 600)).toBe(false); // 2% like rate
  });

  it('returns false below 10K views floor', () => {
    expect(isViral(5_000, 500, 100, 50, 600)).toBe(false);
  });

  it('returns true when no subscriber data and views ≥ 10K with 3%+ likes and 0.1%+ comments', () => {
    expect(isViral(100_000, 5_000, 0, 200, 600)).toBe(true);
  });

  it('returns false when duration is under 5 minutes', () => {
    expect(isViral(500_000, 25_000, 10_000, 5_000, 250)).toBe(false);
  });

  it('returns false when duration exceeds 30 minutes', () => {
    expect(isViral(500_000, 25_000, 10_000, 5_000, 1900)).toBe(false);
  });

  it('returns false below 0.1% comment rate', () => {
    expect(isViral(500_000, 25_000, 10_000, 400, 600)).toBe(false); // 0.08% comment rate
  });
});
