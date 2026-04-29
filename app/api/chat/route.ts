import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';

export const maxDuration = 30;

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Tu es YUBOT Assistant, le chatbot d'aide de YUBOT, un SaaS qui génère des scripts YouTube viraux à partir de l'analyse de milliers de vidéos.

Ton rôle : aider les utilisateurs à comprendre YUBOT, à mieux écrire pour YouTube, et à exploiter au mieux la plateforme.

RÈGLES STRICTES :

1. Concis : 1-3 phrases par réponse, sauf si la question demande explicitement plus de détails.

2. Ton direct, pas servile : jamais "je suis ravi de vous aider", jamais "bien sûr", jamais "absolument".

3. Pas de markdown : pas de **gras**, pas de *italique*, pas de listes à puces. Texte brut uniquement.

4. Sujets autorisés : YUBOT, YouTube, scripts viraux, stratégie créateur, hooks, structure narrative.

5. Sujets interdits : tout le reste. Si on te demande autre chose → "Je m'occupe que de YUBOT et YouTube."

6. Ne mens jamais. Si tu ne sais pas → "Je sais pas. Demande à Ethan : hello@yubot.com"

7. N'invente pas de stats, prix ou fonctionnalités. Tiens-toi aux infos officielles.

8. Style humain : tutoiement, contractions naturelles (t'as, c'est, y'a), zéro jargon inutile.

9. Ne mentionne JAMAIS Claude, Anthropic, ChatGPT, OpenAI ou "modèle de langage".`;

type HistoryMessage = { role: string; content: string };

export async function POST(req: Request) {
  let body: { message?: unknown; history?: unknown; pageContext?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 500) : '';
  if (!message) return Response.json({ error: 'message required' }, { status: 400 });

  const rawHistory = Array.isArray(body.history) ? (body.history as HistoryMessage[]).slice(-10) : [];
  const pageContext = typeof body.pageContext === 'string' ? body.pageContext : 'dashboard';

  const history = rawHistory
    .filter(m => (m.role === 'user' || m.role === 'bot') && typeof m.content === 'string')
    .map(m => ({
      role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    }));

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: SYSTEM_PROMPT,
    messages: [
      ...history,
      { role: 'user', content: `[Page actuelle : ${pageContext}]\n${message}` },
    ],
    maxOutputTokens: 300,
  });

  return result.toTextStreamResponse();
}
