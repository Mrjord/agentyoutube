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
