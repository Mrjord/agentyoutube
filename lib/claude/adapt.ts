import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ADAPT_SYSTEM_PROMPT } from '../prompts/adapt-system';
import { durationToWords, WORDS_PER_MINUTE } from '../constants';

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function wordsToMinutes(words: number): number {
  return Math.round((words / WORDS_PER_MINUTE) * 10) / 10;
}

export function createAdaptStream(params: {
  text: string;
  durationSeconds: number;
  allowCompletion: boolean;
}) {
  const { text, durationSeconds, allowCompletion } = params;
  const durationLabel = durationSeconds < 60 ? `${durationSeconds} secondes` : `${Math.round(durationSeconds / 60)} minutes`;
  const targetWords = durationToWords(durationSeconds);
  const originalWords = countWords(text);
  const originalMinutes = wordsToMinutes(originalWords);
  const gap = targetWords - originalWords;

  const gapNote = gap > 0 ? `il manque ~${gap} mots` : 'le texte est déjà assez long';
  const completionInstruction = allowCompletion
    ? `La case "Autoriser à compléter" est COCHÉE.\nTu PEUX ajouter du contenu si le texte est trop court (${gapNote}).\nContenu ajouté UNIQUEMENT si ça approfondit ce qui est déjà dit. Même style que l'original.\nEntoure chaque passage ajouté avec <ajout>...</ajout>.\nTu n'inventes JAMAIS de faits, chiffres ou anecdotes.`
    : `La case "Autoriser à compléter" est NON COCHÉE.\nN'ajoute AUCUN contenu. Si le texte est trop court, adapte sans allonger.`;

  const userMessage = `Texte original (${originalWords} mots, ~${originalMinutes} min de vidéo) :
Durée cible : ${durationLabel} (~${targetWords} mots)
Écart : ${gap > 0 ? `+${gap} mots à ajouter` : `${Math.abs(gap)} mots à condenser`}

${completionInstruction}

---

${text}

---

Adapte ce texte en script YouTube viral en appliquant la structure et les techniques de hook.`;

  return streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: ADAPT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });
}
