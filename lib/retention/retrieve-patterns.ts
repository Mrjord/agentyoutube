import { getPatternsByToneAndDurationWithVideo } from '../db/queries';
import type { PatternWithVideo } from '../db/queries';

export type { PatternWithVideo };

interface RetrieveOptions {
  tone: string;
  durationBucket: 'short' | 'medium' | 'long';
  limit?: number;
}

function freshnessMultiplier(analyzedAt: Date | null, now: number): number {
  if (!analyzedAt) return 0.5;
  const days = (now - analyzedAt.getTime()) / 86_400_000;
  if (days < 7) return 1.3;
  if (days < 30) return 1.0;
  if (days < 90) return 0.8;
  return 0.5;
}

export async function retrievePatterns(options: RetrieveOptions): Promise<PatternWithVideo[]> {
  const { tone, durationBucket, limit = 50 } = options;
  const raw = await getPatternsByToneAndDurationWithVideo(tone, durationBucket, Math.min(limit * 3, 150));
  const now = Date.now();
  const scored = raw.map(p => ({ p, score: p.viralityScore * freshnessMultiplier(p.videoAnalyzedAt, now) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => x.p);
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
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

  return JSON.stringify(content, null, 2)
    .split('\n')
    .map(l => `  ${l}`)
    .join('\n');
}

export function formatPatternsForPrompt(patterns: PatternWithVideo[]): string {
  if (patterns.length === 0) {
    return 'Aucun pattern disponible pour ce ton et cette durée.';
  }
  return patterns
    .map((p, i) => {
      const lines: string[] = [
        `### Pattern ${i + 1} — ${p.patternType} [score virality: ${p.viralityScore.toFixed(0)}]`,
      ];

      if (p.videoTitle && p.videoChannel) {
        const views = p.videoViewCount ? ` — ${formatViews(p.videoViewCount)} vues` : '';
        const ratio =
          p.videoViewCount && p.videoSubscriberCount && p.videoSubscriberCount > 0
            ? `, ratio viral ${(p.videoViewCount / p.videoSubscriberCount).toFixed(1)}x`
            : '';
        const date = p.videoAnalyzedAt
          ? `, analysée le ${p.videoAnalyzedAt.toISOString().split('T')[0]}`
          : '';
        lines.push(`Source : "${p.videoTitle}" par ${p.videoChannel}${views}${ratio}${date}`);
      }

      lines.push(renderContent(p.patternType, p.content as Record<string, unknown>));
      return lines.join('\n');
    })
    .join('\n\n');
}
