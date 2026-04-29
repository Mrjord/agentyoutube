import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { GENERATE_SYSTEM_PROMPT } from '../prompts/generate-system';
import { formatPatternsForPrompt } from '../retention/retrieve-patterns';
import { durationToWords } from '../constants';
import type { Pattern } from '../db/schema';

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export function createScriptStream(params: {
  theme: string;
  durationSeconds: number;
  tone: string;
  patterns: Pattern[];
}) {
  const { theme, durationSeconds, tone, patterns } = params;
  const patternsText = formatPatternsForPrompt(patterns);
  const durationLabel = durationSeconds < 60 ? `${durationSeconds} secondes` : `${Math.round(durationSeconds / 60)} minutes`;
  const targetWords = durationToWords(durationSeconds);
  const tolerance = Math.round(targetWords * 0.05);

  return streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: GENERATE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `## Patterns viraux de référence\n\n${patternsText}\n\n---\n\n## Demande\n\nThème : ${theme}\nDurée cible : ${durationLabel}\nNombre de mots cible : ${targetWords} mots (tolérance ±5% → ${targetWords - tolerance}–${targetWords + tolerance} mots)\nTon : ${tone}\n\nGénère le script complet.`,
      },
    ],
  });
}
