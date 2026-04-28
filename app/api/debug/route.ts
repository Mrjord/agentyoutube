import { searchViralVideos } from '@/lib/youtube/search';
import { fetchTranscript } from '@/lib/youtube/transcript';
import { getDailyKeywords } from '@/lib/constants';

export const maxDuration = 60;

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) return Response.json({ error: 'misconfigured' }, { status: 500 });
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const keywords = getDailyKeywords();
  const results: Record<string, unknown>[] = [];

  for (const kw of keywords.slice(0, 2)) {
    try {
      const found = await searchViralVideos(kw.keyword, kw.language);
      const sample = found.slice(0, 2).map(v => ({
        videoId: v.videoId, title: v.title.slice(0, 50),
        views: v.viewCount, likeRate: (v.likeCount / v.viewCount).toFixed(3),
        secs: v.durationSeconds, subs: v.subscriberCount,
        ratio: v.subscriberCount > 0 ? (v.viewCount / v.subscriberCount).toFixed(2) : 'N/A',
      }));
      let transcriptOk = false;
      if (found.length > 0) {
        try { await fetchTranscript(found[0].videoId); transcriptOk = true; } catch {}
      }
      results.push({ keyword: kw.keyword, lang: kw.language, viralCount: found.length, sample, transcriptOk });
    } catch (err) {
      results.push({ keyword: kw.keyword, error: String(err) });
    }
  }

  return Response.json(results);
}
