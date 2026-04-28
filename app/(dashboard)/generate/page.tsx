'use client';

import { useState } from 'react';
import { ScriptStream } from '@/components/ScriptStream';
import { AdaptStream } from '@/components/AdaptStream';

type Tab = 'generate' | 'adapt';

export default function GeneratePage() {
  const [tab, setTab] = useState<Tab>('generate');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scripts</h1>
        <p className="text-muted-foreground mt-1">
          Génère un nouveau script ou adapte ton propre texte en format viral.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setTab('generate')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            tab === 'generate'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Générer un script
        </button>
        <button
          onClick={() => setTab('adapt')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            tab === 'adapt'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Adapter mon texte
        </button>
      </div>

      {tab === 'generate' ? <ScriptStream /> : <AdaptStream />}
    </div>
  );
}
