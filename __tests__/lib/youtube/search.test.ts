import { describe, it, expect } from 'vitest';
import { isViral } from '@/lib/youtube/search';

describe('isViral', () => {
  it('returns true for high-reach video with strong like rate', () => {
    expect(isViral(1_000_000, 40_000, 500_000, 5_000, 900)).toBe(true); // 4% lr, 15 min
  });

  it('returns false below 50K views floor', () => {
    expect(isViral(40_000, 2_000, 5_000, 200, 600)).toBe(false);
  });

  it('returns false below 2% like rate', () => {
    expect(isViral(500_000, 8_000, 10_000, 500, 600)).toBe(false); // 1.6% lr
  });

  it('returns false below 5 minutes duration', () => {
    expect(isViral(500_000, 25_000, 10_000, 5_000, 250)).toBe(false); // 4 min 10s
  });

  it('returns true regardless of subscriber count or comment count', () => {
    expect(isViral(100_000, 3_000, 5_000_000, 0, 600)).toBe(true); // massive channel, no comments
  });

  it('returns true for long-form content (> 30 min)', () => {
    expect(isViral(1_500_000, 48_000, 400_000, 5_000, 15_000)).toBe(true); // 4-hour course
  });
});
