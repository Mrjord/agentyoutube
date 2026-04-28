import type { Pattern } from '../db/schema';

interface RetrieveOptions {
  tone: string;
  durationBucket: 'short' | 'medium' | 'long';
  limit?: number;
}

export async function retrievePatterns(options: RetrieveOptions): Promise<Pattern[]> {
  const { tone, durationBucket, limit = 50 } = options;
  const { getPatternsByToneAndDuration } = await import('../db/queries');
  return getPatternsByToneAndDuration(tone, durationBucket, limit);
}

export function formatPatternsForPrompt(patterns: Pattern[]): string {
  if (patterns.length === 0) {
    return 'Aucun pattern disponible pour ce ton et cette durée.';
  }
  return patterns
    .map(
      (p, i) =>
        `### Pattern ${i + 1} — ${p.patternType} (score virality: ${p.viralityScore.toFixed(0)})\n${JSON.stringify(p.content, null, 2)}`,
    )
    .join('\n\n');
}
