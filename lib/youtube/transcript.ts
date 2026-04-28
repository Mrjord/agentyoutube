import { YoutubeTranscript } from 'youtube-transcript';

export class TranscriptUnavailableError extends Error {
  constructor(videoId: string) {
    super(`No transcript for ${videoId}`);
    this.name = 'TranscriptUnavailableError';
  }
}

export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'fr' }).catch(
      () => YoutubeTranscript.fetchTranscript(videoId),
    );

    if (!segments || segments.length === 0) throw new TranscriptUnavailableError(videoId);

    return segments.map(s => s.text).join(' ');
  } catch (err) {
    if (err instanceof TranscriptUnavailableError) throw err;
    throw new TranscriptUnavailableError(videoId);
  }
}
