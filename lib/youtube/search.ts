import { google } from 'googleapis';

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  channel: string;
  viewCount: number;
  likeCount: number;
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

export function isViral(viewCount: number, likeCount: number): boolean {
  return viewCount >= 100_000 && viewCount > 0 && likeCount / viewCount >= 0.02;
}

export async function searchViralVideos(keyword: string): Promise<YouTubeVideoInfo[]> {
  const publishedAfter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  const searchRes = await youtube.search.list({
    q: keyword,
    type: ['video'],
    order: 'viewCount',
    publishedAfter,
    maxResults: 20,
    videoDuration: 'medium',
    part: ['snippet', 'id'],
  });

  const videoIds = (searchRes.data.items ?? [])
    .map(item => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  if (videoIds.length === 0) return [];

  const detailRes = await youtube.videos.list({
    id: videoIds,
    part: ['statistics', 'contentDetails', 'snippet'],
  });

  const results: YouTubeVideoInfo[] = [];
  for (const video of detailRes.data.items ?? []) {
    const viewCount = parseInt(video.statistics?.viewCount ?? '0');
    const likeCount = parseInt(video.statistics?.likeCount ?? '0');
    if (!isViral(viewCount, likeCount)) continue;

    results.push({
      videoId: video.id!,
      title: video.snippet?.title ?? '',
      channel: video.snippet?.channelTitle ?? '',
      viewCount,
      likeCount,
      publishedAt: new Date(video.snippet?.publishedAt ?? Date.now()),
      durationSeconds: parseDuration(video.contentDetails?.duration ?? ''),
      language:
        video.snippet?.defaultLanguage ??
        video.snippet?.defaultAudioLanguage ??
        'fr',
    });
  }

  return results;
}
