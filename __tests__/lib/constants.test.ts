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
  it('gives higher score to high engagement (views × likeRate²)', () => {
    // 500K views, 5% like rate → 500K × 0.05² × 10K = 12,500,000
    expect(computeViralityScore(500_000, 25_000)).toBe(12_500_000);
    // 500K views, 2% like rate → 500K × 0.02² × 10K = 2,000,000 (lower)
    expect(computeViralityScore(500_000, 10_000)).toBe(2_000_000);
  });
  it('returns 0 for zero views', () => {
    expect(computeViralityScore(0, 100)).toBe(0);
  });
});
