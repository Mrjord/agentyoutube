import Anthropic from '@anthropic-ai/sdk';
import { ANALYZE_SYSTEM_PROMPT } from '../prompts/analyze-system';
import type { NewPattern } from '../db/schema';
import { computeViralityScore, getDurationBucket } from '../constants';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface RawPattern {
  pattern_type: string;
  content: Record<string, unknown>;
  tone: string;
}

export function parsePatterns(
  rawJson: string,
  params: { viewCount: number; likeCount: number; durationSeconds: number; videoDbId: string },
): NewPattern[] {
  const clean = rawJson.replace(/```(?:json)?\n?/g, '').trim();
  const parsed = JSON.parse(clean) as { patterns: RawPattern[] };

  const viralityScore = computeViralityScore(params.viewCount, params.likeCount);
  const durationBucket = getDurationBucket(params.durationSeconds);

  return parsed.patterns.map(p => ({
    videoId: params.videoDbId,
    patternType: p.pattern_type,
    content: p.content,
    tone: p.tone,
    durationBucket,
    viralityScore,
  }));
}

function buildAnalyzePrompt(params: {
  transcript: string;
  title: string;
  viewCount: number;
  likeCount: number;
  durationSeconds: number;
}): string {
  return `Titre : ${params.title}
Vues : ${params.viewCount.toLocaleString()}
Likes : ${params.likeCount.toLocaleString()}
Durée : ${Math.round(params.durationSeconds / 60)} minutes

Transcription :
${params.transcript.slice(0, 12_000)}`;
}

export async function analyzeVideo(params: {
  transcript: string;
  title: string;
  viewCount: number;
  likeCount: number;
  durationSeconds: number;
  videoDbId: string;
}): Promise<NewPattern[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: ANALYZE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildAnalyzePrompt(params) }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return parsePatterns(text, params);
}
