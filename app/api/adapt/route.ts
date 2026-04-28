import { createAdaptStream } from '@/lib/claude/adapt';
import { DURATION_TO_SECONDS } from '@/lib/constants';
import type { DurationOption } from '@/lib/constants';

export const maxDuration = 60;

export async function POST(req: Request) {
  let body: { text?: unknown; duration?: unknown; allowCompletion?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim().slice(0, 20_000) : '';
  if (!text) return Response.json({ error: 'text required' }, { status: 400 });

  const duration = (body.duration as DurationOption) ?? '10min';
  const durationSeconds = DURATION_TO_SECONDS[duration] ?? 600;
  const allowCompletion = body.allowCompletion === true;

  const result = createAdaptStream({ text, durationSeconds, allowCompletion });
  return result.toTextStreamResponse();
}
