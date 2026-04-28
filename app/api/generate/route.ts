import { createScriptStream } from '@/lib/claude/generate';
import { retrievePatterns } from '@/lib/retention/retrieve-patterns';
import { saveScript } from '@/lib/db/queries';
import { getDurationBucket, DURATION_TO_SECONDS, V1_USER_ID } from '@/lib/constants';
import type { DurationOption } from '@/lib/constants';

export async function POST(req: Request) {
  const { prompt: theme, duration, tone } = (await req.json()) as {
    prompt: string;
    duration: DurationOption;
    tone: string;
  };

  const durationSeconds = DURATION_TO_SECONDS[duration] ?? 300;
  const durationBucket = getDurationBucket(durationSeconds);
  const patterns = await retrievePatterns({ tone, durationBucket, limit: 50 });

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
