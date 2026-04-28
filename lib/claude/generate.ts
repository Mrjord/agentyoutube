import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { GENERATE_SYSTEM_PROMPT } from '../prompts/generate-system';
import { formatPatternsForPrompt } from '../retention/retrieve-patterns';
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
  const durationMin = Math.round(durationSeconds / 60);

  return streamText({
    model: anthropic('claude-opus-4-7'),
    system: GENERATE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `## Patterns viraux de référence\n\n${patternsText}\n\n---\n\n## Demande\n\nThème : ${theme}\nDurée cible : ${durationMin} minutes (${durationSeconds}s)\nTon : ${tone}\n\nGénère le script complet.`,
      },
    ],
    providerOptions: {
      anthropic: {
        thinking: { type: 'adaptive' },
      },
    },
  });
}
