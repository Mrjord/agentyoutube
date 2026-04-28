import { google } from 'googleapis';
import { isViral } from '@/lib/youtube/search';
import { fetchTranscript } from '@/lib/youtube/transcript';

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

export const maxDuration = 60;

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) return Response.json({ error: 'misconfigured' }, { status: 500 });
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const publishedAfter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const keyword = 'build a business from scratch';

  const searchRes = await youtube.search.list({
    q: keyword, type: ['video'], order: 'viewCount', publishedAfter,
    maxResults: 50, relevanceLanguage: 'en', part: ['snippet', 'id'],
  });
  const videoIds = (searchRes.data.items ?? [])
    .map(i => i.id?.videoId)
    .filter((id): id is string => Boolean(id));

  const detailRes = await youtube.videos.list({ id: videoIds, part: ['statistics', 'contentDetails', 'snippet'] });
  const videos = detailRes.data.items ?? [];
  const channelIds = [
    ...new Set(videos.map(v => v.snippet?.channelId).filter((id): id is string => Boolean(id))),
  ];
  const channelRes = await youtube.channels.list({ id: channelIds, part: ['statistics'] });
  const subMap = new Map<string, number>();
  for (const ch of channelRes.data.items ?? []) subMap.set(ch.id!, parseInt(ch.statistics?.subscriberCount ?? '0'));

  const rows = videos.map(v => {
    const views = parseInt(v.statistics?.viewCount ?? '0');
    const likes = parseInt(v.statistics?.likeCount ?? '0');
    const comments = parseInt(v.statistics?.commentCount ?? '0');
    const subs = subMap.get(v.snippet?.channelId ?? '') ?? 0;
    const dur = v.contentDetails?.duration ?? '';
    const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const secs = m ? parseInt(m[1] ?? '0') * 3600 + parseInt(m[2] ?? '0') * 60 + parseInt(m[3] ?? '0') : 0;
    const viral = isViral(views, likes, subs, comments, secs);
    return { viral, id: v.id, title: v.snippet?.title?.slice(0, 50), views, lr: (likes / views).toFixed(3), secs, subs, ratio: subs > 0 ? (views / subs).toFixed(2) : 'N/A' };
  });

  const passing = rows.filter(r => r.viral);
  let transcriptTest = null;
  if (passing.length > 0) {
    try { await fetchTranscript(passing[0].id!); transcriptTest = 'ok'; } catch (e) { transcriptTest = String(e); }
  }

  return Response.json({ keyword, totalFromSearch: videoIds.length, viralCount: passing.length, viral: passing, transcriptTest, allRows: rows.slice(0, 5) });
}
