'use client';

import { useState } from 'react';
import { ScriptStream } from '@/components/ScriptStream';
import { AdaptStream } from '@/components/AdaptStream';

type Tab = 'generate' | 'adapt';

export default function GeneratePage() {
  const [tab, setTab] = useState<Tab>('generate');

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-mono text-[#FFE600] tracking-widest uppercase mb-2">Création</p>
        <h1 className="font-heading text-3xl font-bold">Scripts</h1>
        <p className="text-[#6B6560] mt-1 text-sm">
          Génère un nouveau script ou restructure ton propre texte en format viral.
        </p>
      </div>

      <div className="flex border-b border-[#1E1E1E]">
        {(['generate', 'adapt'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-[#FFE600] text-[#FFE600]'
                : 'border-transparent text-[#6B6560] hover:text-[#F5F0E8]'
            }`}
          >
            {t === 'generate' ? 'Générer un script' : 'Adapter mon texte'}
          </button>
        ))}
      </div>

      {tab === 'generate' ? <ScriptStream /> : <AdaptStream />}
    </div>
  );
}
