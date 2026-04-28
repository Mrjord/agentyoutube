import { describe, it, expect, vi } from 'vitest';
import { fetchTranscript, TranscriptUnavailableError } from '@/lib/youtube/transcript';

vi.mock('youtube-transcript', () => ({
  YoutubeTranscript: {
    fetchTranscript: vi.fn(),
  },
}));

import { YoutubeTranscript } from 'youtube-transcript';

describe('fetchTranscript', () => {
  it('joins segments into a single string', async () => {
    vi.mocked(YoutubeTranscript.fetchTranscript).mockResolvedValueOnce([
      { text: 'Hello', duration: 2, offset: 0 },
      { text: 'World', duration: 2, offset: 2 },
    ]);
    expect(await fetchTranscript('abc')).toBe('Hello World');
  });

  it('throws TranscriptUnavailableError when segments are empty', async () => {
    vi.mocked(YoutubeTranscript.fetchTranscript).mockResolvedValue([]);
    await expect(fetchTranscript('abc')).rejects.toThrow(TranscriptUnavailableError);
  });

  it('throws TranscriptUnavailableError on API error', async () => {
    vi.mocked(YoutubeTranscript.fetchTranscript).mockRejectedValue(new Error('no subs'));
    await expect(fetchTranscript('abc')).rejects.toThrow(TranscriptUnavailableError);
  });
});
