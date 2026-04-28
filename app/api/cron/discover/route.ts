import {
  isVideoInDB,
  insertVideo,
  insertPattern,
  markVideoAnalyzed,
} from '@/lib/db/queries';
import { searchViralVideos } from '@/lib/youtube/search';
import { fetchTranscript } from '@/lib/youtube/transcript';
import { analyzeVideo } from '@/lib/claude/analyze';
import { getDailyKeywords, MAX_VIDEOS_PER_RUN } from '@/lib/constants';

export const maxDuration = 60;

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) {
    return Response.json({ error: 'Server misconfiguration' }, { status: 500 });
  }
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const keywords = getDailyKeywords();
  let processed = 0;
  const errors: string[] = [];

  for (const kw of keywords) {
    if (processed >= MAX_VIDEOS_PER_RUN) break;

    try {
      const found = await searchViralVideos(kw.keyword, kw.language);

      for (const info of found) {
        if (processed >= MAX_VIDEOS_PER_RUN) break;
        if (await isVideoInDB(info.videoId)) continue;

        try {
          // Try transcript first; fall back to video description if blocked (cloud IP)
          let content: string;
          try {
            content = await fetchTranscript(info.videoId);
          } catch {
            if (!info.description) continue;
            content = info.description;
          }

          const videoDbId = await insertVideo({
            youtubeVideoId: info.videoId,
            title: info.title,
            channel: info.channel,
            url: `https://www.youtube.com/watch?v=${info.videoId}`,
            viewCount: info.viewCount,
            likeCount: info.likeCount,
            subscriberCount: info.subscriberCount,
            commentCount: info.commentCount,
            publishedAt: info.publishedAt,
            durationSeconds: info.durationSeconds,
            language: info.language,
            transcript: content,
          });

          const newPatterns = await analyzeVideo({
            transcript: content,
            title: info.title,
            viewCount: info.viewCount,
            likeCount: info.likeCount,
            durationSeconds: info.durationSeconds,
            videoDbId,
          });

          for (const pattern of newPatterns) {
            await insertPattern(pattern);
          }

          await markVideoAnalyzed(videoDbId);
          processed++;
          console.log(`[discover] ${info.videoId} — ${newPatterns.length} patterns`);
        } catch (err) {
          const msg = `${info.videoId}: ${String(err).slice(0, 120)}`;
          errors.push(msg);
          console.error(`[discover] error ${info.videoId}:`, err);
        }
      }
    } catch (err) {
      errors.push(`search "${kw.keyword}": ${String(err).slice(0, 120)}`);
      console.error(`[discover] search failed for "${kw.keyword}":`, err);
    }
  }

  return Response.json({ processed, keywords: keywords.map(k => k.keyword), errors: errors.slice(0, 5) });
}
