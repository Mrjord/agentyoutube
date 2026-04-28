export const dynamic = 'force-dynamic';

import { getScriptById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ScriptPage({ params }: Props) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const script = await getScriptById(id);
  if (!script) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{script.theme}</h1>
        <p className="text-muted-foreground">
          {script.tone} — {Math.round(script.durationSeconds / 60)} min —{' '}
          {script.createdAt
            ? new Date(script.createdAt).toLocaleDateString('fr-FR')
            : '—'}
        </p>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-6 rounded-lg leading-relaxed">
        {script.contentMarkdown}
      </pre>
    </div>
  );
}
