import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { getTopPatterns } from '@/lib/db/queries';
import { buildAnalyzeScriptSystemPrompt } from '@/lib/prompts/analyze-script-system';

export const maxDuration = 60;

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  let body: { text?: unknown; videoType?: unknown; niche?: unknown; depth?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim().slice(0, 15_000) : '';
  if (!text || text.length < 50) {
    return Response.json({ error: 'Texte trop court' }, { status: 400 });
  }

  const videoType = typeof body.videoType === 'string' ? body.videoType : 'long';
  const niche = typeof body.niche === 'string' ? body.niche : 'business';
  const depth = typeof body.depth === 'string' ? body.depth : 'standard';

  const patterns = await getTopPatterns(35);

  if (patterns.length < 3) {
    return Response.json({ error: 'Base de patterns insuffisante' }, { status: 503 });
  }

  const systemPrompt = buildAnalyzeScriptSystemPrompt(patterns);

  const maxTokens = depth === 'express' ? 800 : depth === 'approfondie' ? 3000 : 1800;

  const userMessage = `Analyse ce script YouTube.

Type de vidéo cible : ${videoType}
Niche : ${niche}
Profondeur demandée : ${depth}

Script à analyser (${text.split(/\s+/).filter(Boolean).length} mots) :

---
${text}
---

Produis le rapport complet en respectant EXACTEMENT le format ##TAG## défini.`;

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
    maxOutputTokens: maxTokens,
  });

  return result.toTextStreamResponse();
}
