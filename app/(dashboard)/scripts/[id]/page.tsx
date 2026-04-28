export const dynamic = 'force-dynamic';

import { getScriptById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import { ScriptPreview } from '@/components/ScriptPreview';
import Link from 'next/link';

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
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/generate" className="text-xs text-[#6B6560] hover:text-[#F5F0E8] transition-colors mb-4 inline-flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </Link>
        <h1 className="font-heading text-2xl font-bold mt-2">{script.theme}</h1>
        <p className="text-sm text-[#6B6560] mt-1">
          {script.tone} — {Math.round(script.durationSeconds / 60)} min —{' '}
          {script.createdAt ? new Date(script.createdAt).toLocaleDateString('fr-FR') : '—'}
        </p>
      </div>
      <ScriptPreview text={script.contentMarkdown} />
    </div>
  );
}
