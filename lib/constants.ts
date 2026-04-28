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
  // views × likeRate² rewards both volume and high engagement disproportionately
  const likeRate = likeCount / viewCount;
  return Math.round(viewCount * likeRate * likeRate * 10_000);
}

// YouTube free quota: 10,000 units/day. Each run uses ~102 units × 5 keywords/day = 510 units.
// Vercel Hobby: 60s function timeout, ~15-20s per video → max 3 per run.
export const MAX_VIDEOS_PER_RUN = 3;

// 7-day keyword rotation — 5 keywords per day, cycling by weekday
export const KEYWORDS_BY_DAY: Array<Array<{ keyword: string; language: string }>> = [
  // Day 0 — Sunday
  [
    { keyword: 'mindset millionnaire', language: 'fr' },
    { keyword: 'liberté financière 2025', language: 'fr' },
    { keyword: 'mindset for success', language: 'en' },
    { keyword: 'how to think like a millionaire', language: 'en' },
    { keyword: 'développement personnel 2025', language: 'fr' },
  ],
  // Day 1 — Monday
  [
    { keyword: 'intelligence artificielle business', language: 'fr' },
    { keyword: 'AI business ideas 2025', language: 'en' },
    { keyword: 'IA pour entrepreneurs', language: 'fr' },
    { keyword: 'make money with AI 2025', language: 'en' },
    { keyword: 'automatiser son business avec IA', language: 'fr' },
  ],
  // Day 2 — Tuesday
  [
    { keyword: 'entrepreneuriat débutant', language: 'fr' },
    { keyword: 'entrepreneurship tips', language: 'en' },
    { keyword: 'créer son entreprise', language: 'fr' },
    { keyword: 'build a business from scratch', language: 'en' },
    { keyword: 'comment lancer son business', language: 'fr' },
  ],
  // Day 3 — Wednesday
  [
    { keyword: 'devenir riche 2025', language: 'fr' },
    { keyword: 'how to make money online', language: 'en' },
    { keyword: 'revenus en ligne', language: 'fr' },
    { keyword: 'online income streams 2025', language: 'en' },
    { keyword: 'gagner de l argent sur internet', language: 'fr' },
  ],
  // Day 4 — Thursday
  [
    { keyword: 'investir son argent', language: 'fr' },
    { keyword: 'passive income streams', language: 'en' },
    { keyword: 'investissement débutant', language: 'fr' },
    { keyword: 'passive income ideas 2025', language: 'en' },
    { keyword: 'investir en bourse pour débutant', language: 'fr' },
  ],
  // Day 5 — Friday
  [
    { keyword: 'self improvement productivity', language: 'en' },
    { keyword: 'productivité entrepreneur', language: 'fr' },
    { keyword: 'discipline et succès', language: 'fr' },
    { keyword: 'morning routine millionaire', language: 'en' },
    { keyword: 'habitudes des entrepreneurs à succès', language: 'fr' },
  ],
  // Day 6 — Saturday
  [
    { keyword: 'personal branding 2025', language: 'en' },
    { keyword: 'créer du contenu qui cartonne', language: 'fr' },
    { keyword: 'YouTube growth strategy 2025', language: 'en' },
    { keyword: 'personal branding réseaux sociaux', language: 'fr' },
    { keyword: 'storytelling business', language: 'fr' },
  ],
];

export function getDailyKeywords(): Array<{ keyword: string; language: string }> {
  return KEYWORDS_BY_DAY[new Date().getDay()];
}
