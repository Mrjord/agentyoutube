import { createScriptStream } from '@/lib/claude/generate';
import { retrievePatterns } from '@/lib/retention/retrieve-patterns';
import { saveScript } from '@/lib/db/queries';
import { getDurationBucket, DURATION_TO_SECONDS, V1_USER_ID } from '@/lib/constants';
import type { DurationOption } from '@/lib/constants';

export async function POST(req: Request) {
  let body: { prompt?: unknown; duration?: unknown; tone?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }

  const theme = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 500) : '';
  if (!theme) {
    return Response.json({ error: 'prompt required' }, { status: 400 });
  }

  const duration = (body.duration as DurationOption) ?? '10min';
  const tone = typeof body.tone === 'string' ? body.tone : 'viral';

  const durationSeconds = DURATION_TO_SECONDS[duration] ?? 300;
  const durationBucket = getDurationBucket(durationSeconds);
  const patterns = await retrievePatterns({ tone, durationBucket, limit: 50 });

  if (patterns.length < 3) {
    const msg = "Je n'ai pas encore assez de vidéos virales analysées sur ce format et ce ton pour générer un script de qualité. Reviens dans quelques heures — notre agent analyse de nouvelles vidéos en permanence.";
    return new Response(msg, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const result = createScriptStream({ theme, durationSeconds, tone, patterns });

  result.text.then(contentMarkdown =>
    saveScript({
      userId: V1_USER_ID,
      theme,
      durationSeconds,
      tone,
      contentMarkdown,
      patternsUsed: patterns.map(p => p.id),
    }).catch(console.error),
  );

  return result.toTextStreamResponse();
}
