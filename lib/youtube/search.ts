import { google } from 'googleapis';

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  channel: string;
  channelId: string;
  subscriberCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: Date;
  durationSeconds: number;
  language: string;
}

function parseDuration(iso8601: string): number {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (
    parseInt(match[1] ?? '0') * 3600 +
    parseInt(match[2] ?? '0') * 60 +
    parseInt(match[3] ?? '0')
  );
}

// A video has strong viral signals when it has high views + meaningful engagement.
// Criteria (all must pass):
//   1. Minimum 50K views (meaningful reach)
//   2. Like rate ≥ 2% (audience endorsement)
//   3. Minimum 5 minutes duration (enough content to extract patterns from)
export function isViral(
  viewCount: number,
  likeCount: number,
  subscriberCount: number,
  commentCount: number,
  durationSeconds: number,
): boolean {
  if (viewCount < 50_000) return false;
  if (durationSeconds < 300) return false;

  const likeRate = likeCount / viewCount;
  if (likeRate < 0.02) return false;

  return true;
}

export async function searchViralVideos(keyword: string, language = 'fr'): Promise<YouTubeVideoInfo[]> {
  // 90-day window — stronger pattern signal than 30 days
  const publishedAfter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  // 100 quota units — fetch max 50 results per keyword
  const searchRes = await youtube.search.list({
    q: keyword,
    type: ['video'],
    order: 'viewCount',
    publishedAfter,
    maxResults: 50,
    relevanceLanguage: language,
    part: ['snippet', 'id'],
  });

  const items = searchRes.data.items ?? [];
  const videoIds = items
    .map(item => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  if (videoIds.length === 0) return [];

  // 1 quota unit — batch fetch all video stats
  const detailRes = await youtube.videos.list({
    id: videoIds,
    part: ['statistics', 'contentDetails', 'snippet'],
  });

  const videos = detailRes.data.items ?? [];

  // Collect unique channel IDs
  const channelIds = [
    ...new Set(videos.map(v => v.snippet?.channelId).filter((id): id is string => Boolean(id))),
  ];

  // 1 quota unit — batch fetch all channel subscriber counts
  const subscriberMap = new Map<string, number>();
  if (channelIds.length > 0) {
    const channelRes = await youtube.channels.list({
      id: channelIds,
      part: ['statistics'],
    });
    for (const ch of channelRes.data.items ?? []) {
      subscriberMap.set(ch.id!, parseInt(ch.statistics?.subscriberCount ?? '0'));
    }
  }

  const results: YouTubeVideoInfo[] = [];
  for (const video of videos) {
    const viewCount = parseInt(video.statistics?.viewCount ?? '0');
    const likeCount = parseInt(video.statistics?.likeCount ?? '0');
    const commentCount = parseInt(video.statistics?.commentCount ?? '0');
    const channelId = video.snippet?.channelId ?? '';
    const subscriberCount = subscriberMap.get(channelId) ?? 0;
    const durationSeconds = parseDuration(video.contentDetails?.duration ?? '');

    if (!isViral(viewCount, likeCount, subscriberCount, commentCount, durationSeconds)) continue;

    results.push({
      videoId: video.id!,
      title: video.snippet?.title ?? '',
      channel: video.snippet?.channelTitle ?? '',
      channelId,
      subscriberCount,
      viewCount,
      likeCount,
      commentCount,
      publishedAt: new Date(video.snippet?.publishedAt ?? Date.now()),
      durationSeconds,
      language:
        video.snippet?.defaultLanguage ??
        video.snippet?.defaultAudioLanguage ??
        'fr',
    });
  }

  return results;
}
