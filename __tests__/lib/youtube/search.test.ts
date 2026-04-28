import { describe, it, expect } from 'vitest';
import { isViral } from '@/lib/youtube/search';

describe('isViral', () => {
  it('returns true for viral small channel: 500K views, 5% likes, 10K subs (50× ratio)', () => {
    expect(isViral(500_000, 25_000, 10_000)).toBe(true);
  });

  it('returns false for big channel underperforming: 500K views, 3% likes, 1M subs (0.5× ratio)', () => {
    expect(isViral(500_000, 15_000, 1_000_000)).toBe(false);
  });

  it('returns false below 3% like rate', () => {
    expect(isViral(500_000, 10_000, 5_000)).toBe(false); // 2% like rate
  });

  it('returns false below 10K views floor', () => {
    expect(isViral(5_000, 500, 100)).toBe(false);
  });

  it('returns true when no subscriber data and views ≥ 10K with 3%+ likes', () => {
    expect(isViral(100_000, 5_000, 0)).toBe(true);
  });
});
