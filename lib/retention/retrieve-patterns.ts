import { getPatternsByToneAndDuration } from '../db/queries';
import type { Pattern } from '../db/schema';

interface RetrieveOptions {
  tone: string;
  durationBucket: 'short' | 'medium' | 'long';
  limit?: number;
}

export async function retrievePatterns(options: RetrieveOptions): Promise<Pattern[]> {
  const { tone, durationBucket, limit = 50 } = options;
  return getPatternsByToneAndDuration(tone, durationBucket, limit);
}

function renderContent(patternType: string, content: Record<string, unknown>): string {
  if (patternType === 'hook_analysis') {
    return [
      `  Type de hook : ${content.hook_type ?? '—'}`,
      `  Émotion déclenchée : ${content.emotion_triggered ?? '—'}`,
      `  Phrase d'ouverture : "${content.opening_phrase ?? '—'}"`,
      `  Promesse implicite : ${content.implicit_promise ?? '—'}`,
      `  Tension créée : ${content.tension_created ?? '—'}`,
    ].join('\n');
  }

  if (patternType === 'narrative_structure') {
    return [
      `  Acte 1 (0-20%) : ${content.act1 ?? '—'}`,
      `  Acte 2 (20-80%) : ${content.act2 ?? '—'}`,
      `  Acte 3 (80-100%) : ${content.act3 ?? '—'}`,
      `  Loop ouvert : ${content.open_loop ?? '—'}`,
      `  Re-hook : ${content.re_hook ?? '—'}`,
      `  Rythme : ${content.rhythm ?? '—'}`,
    ].join('\n');
  }

  if (patternType === 'global_formula') {
    const techniques = Array.isArray(content.key_techniques)
      ? (content.key_techniques as string[]).map(t => `    • ${t}`).join('\n')
      : '    —';
    const reusable = Array.isArray(content.reusable_elements)
      ? (content.reusable_elements as string[]).map(e => `    • ${e}`).join('\n')
      : '    —';
    return [
      `  Formule : ${content.formula ?? '—'}`,
      `  Structure de titre : ${content.title_pattern ?? '—'}`,
      `  Techniques clés :\n${techniques}`,
      `  Pourquoi viral : ${content.viral_reason ?? '—'}`,
      `  Éléments réutilisables :\n${reusable}`,
    ].join('\n');
  }

  // Fallback for legacy pattern types
  return JSON.stringify(content, null, 2)
    .split('\n')
    .map(l => `  ${l}`)
    .join('\n');
}

export function formatPatternsForPrompt(patterns: Pattern[]): string {
  if (patterns.length === 0) {
    return 'Aucun pattern disponible pour ce ton et cette durée.';
  }
  return patterns
    .map(
      (p, i) =>
        `### Pattern ${i + 1} — ${p.patternType} [score virality: ${p.viralityScore.toFixed(0)}]\n${renderContent(p.patternType, p.content as Record<string, unknown>)}`,
    )
    .join('\n\n');
}
