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
