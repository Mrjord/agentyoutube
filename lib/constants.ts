export const V1_USER_ID = '00000000-0000-0000-0000-000000000001';
export const V1_USER_EMAIL = 'ethanjordan06@gmail.com';

export const DURATION_TO_SECONDS: Record<string, number> = {
  '30s': 30,
  '60s': 60,
  '5min': 300,
  '8min': 480,
  '10min': 600,
  '15min': 900,
  '20min': 1200,
};

export const DURATION_OPTIONS = ['30s', '60s', '5min', '8min', '10min', '15min', '20min'] as const;
export type DurationOption = typeof DURATION_OPTIONS[number];

export const TONE_OPTIONS = [
  'viral',
  'éducatif',
  'storytelling',
  'tutoriel',
  'provocateur',
  'inspirant',
  'analytique',
] as const;
export type ToneOption = typeof TONE_OPTIONS[number];

export function getDurationBucket(seconds: number): 'short' | 'medium' | 'long' {
  if (seconds <= 60) return 'short';
  if (seconds <= 480) return 'medium';
  return 'long';
}

export function computeViralityScore(viewCount: number, likeCount: number): number {
  if (viewCount === 0) return 0;
  return viewCount * (likeCount / viewCount);
}

// Max videos per cron run. Vercel Hobby has 60s function timeout.
// Set to 5 for Hobby (~12s/video), 30 for Pro (maxDuration=300).
export const MAX_VIDEOS_PER_RUN = 10;

export const SEED_KEYWORDS: Array<{ keyword: string; language: string }> = [
  { keyword: 'devenir riche 2025', language: 'fr' },
  { keyword: 'mindset millionnaire', language: 'fr' },
  { keyword: 'intelligence artificielle business', language: 'fr' },
  { keyword: 'entrepreneuriat débutant', language: 'fr' },
  { keyword: 'liberté financière', language: 'fr' },
  { keyword: 'créer son entreprise', language: 'fr' },
  { keyword: 'développement personnel', language: 'fr' },
  { keyword: 'investir son argent', language: 'fr' },
  { keyword: 'AI business ideas 2025', language: 'en' },
  { keyword: 'mindset for success', language: 'en' },
  { keyword: 'how to make money online', language: 'en' },
  { keyword: 'entrepreneurship tips', language: 'en' },
  { keyword: 'passive income streams', language: 'en' },
  { keyword: 'build a business from scratch', language: 'en' },
  { keyword: 'self improvement productivity', language: 'en' },
];
