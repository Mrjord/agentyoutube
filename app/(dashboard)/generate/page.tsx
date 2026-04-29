'use client';

import { ScriptStream } from '@/components/ScriptStream';
import { AdaptStream } from '@/components/AdaptStream';
import { AnalyzeScriptStream } from '@/components/AnalyzeScriptStream';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

type Tab = 'generate' | 'adapt' | 'analyze';

const TABS: { id: Tab; label: string }[] = [
  { id: 'generate', label: 'Générer un script' },
  { id: 'adapt', label: 'Adapter mon texte' },
  { id: 'analyze', label: 'Analyser mon texte' },
];

export default function GeneratePage() {
  const { value: tab, set: setTab } = useLocalStorage<Tab>('yubot_active_tab', 'generate');

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-mono text-[#FFE600] tracking-widest uppercase mb-2">Création</p>
        <h1 className="font-heading text-3xl font-bold">Scripts</h1>
        <p className="text-[#6B6560] mt-1 text-sm">
          Génère, adapte ou analyse tes scripts avec les patterns des vidéos virales.
        </p>
      </div>

      <div className="flex border-b border-[#1E1E1E] overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              tab === id
                ? 'border-[#FFE600] text-[#FFE600]'
                : 'border-transparent text-[#6B6560] hover:text-[#F5F0E8]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'generate' && <ScriptStream />}
      {tab === 'adapt' && <AdaptStream />}
      {tab === 'analyze' && <AnalyzeScriptStream />}
    </div>
  );
}
