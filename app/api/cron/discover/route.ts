import {
  getActiveKeywords,
  isVideoInDB,
  insertVideo,
  insertPattern,
  markVideoAnalyzed,
  updateKeywordLastUsed,
} from '@/lib/db/queries';
import { searchViralVideos } from '@/lib/youtube/search';
import { fetchTranscript, TranscriptUnavailableError } from '@/lib/youtube/transcript';
import { analyzeVideo } from '@/lib/claude/analyze';
import { MAX_VIDEOS_PER_RUN } from '@/lib/constants';

// Vercel Pro only — on Hobby set MAX_VIDEOS_PER_RUN=5 instead
export const maxDuration = 300;

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) {
    return Response.json({ error: 'Server misconfiguration' }, { status: 500 });
  }
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const keywords = await getActiveKeywords();
  let processed = 0;

  for (const kw of keywords) {
    if (processed >= MAX_VIDEOS_PER_RUN) break;

    let newForKeyword = 0;
    try {
      const found = await searchViralVideos(kw.keyword);

      for (const info of found) {
        if (processed >= MAX_VIDEOS_PER_RUN) break;
        if (await isVideoInDB(info.videoId)) continue;

        try {
          const transcript = await fetchTranscript(info.videoId);

          const videoDbId = await insertVideo({
            youtubeVideoId: info.videoId,
            title: info.title,
            channel: info.channel,
            url: `https://www.youtube.com/watch?v=${info.videoId}`,
            viewCount: info.viewCount,
            likeCount: info.likeCount,
            publishedAt: info.publishedAt,
            durationSeconds: info.durationSeconds,
            language: info.language,
            transcript,
          });

          const newPatterns = await analyzeVideo({
            transcript,
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
          newForKeyword++;
          console.log(`[discover] ${info.videoId} — ${newPatterns.length} patterns`);
        } catch (err) {
          if (err instanceof TranscriptUnavailableError) {
            console.log(`[discover] skip ${info.videoId} — no transcript`);
          } else {
            console.error(`[discover] error ${info.videoId}:`, err);
          }
        }
      }
    } catch (err) {
      console.error(`[discover] search failed for "${kw.keyword}":`, err);
    }

    await updateKeywordLastUsed(kw.id, newForKeyword);
  }

  return Response.json({ processed, total: MAX_VIDEOS_PER_RUN });
}
