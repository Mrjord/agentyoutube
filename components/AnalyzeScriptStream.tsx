'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState } from 'react';
import { AnalyzeReport } from './AnalyzeReport';
import { generateDocxBlob } from '@/lib/export/generateDocx';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

const VIDEO_TYPES = [
  { value: 'long', label: 'YouTube long format (5–30 min)' },
  { value: 'short', label: 'YouTube Short (< 60 sec)' },
  { value: 'reels', label: 'Instagram / TikTok (< 90 sec)' },
];

const NICHES = [
  { value: 'business', label: 'Business / Entrepreneuriat' },
  { value: 'developpement-perso', label: 'Développement personnel' },
  { value: 'finance', label: 'Finance / Investissement' },
  { value: 'marketing', label: 'Marketing / Personal branding' },
  { value: 'ia', label: 'IA / Tech' },
  { value: 'autre', label: 'Autre' },
];

const DEPTHS = [
  { value: 'express', label: 'Express (~10 sec)', desc: 'Score global + 3 points clés' },
  { value: 'standard', label: 'Standard (~30 sec)', desc: 'Analyse complète section par section' },
  { value: 'approfondie', label: 'Approfondie (~1 min)', desc: 'Analyse + suggestions de réécriture détaillées' },
];

const WORDS_PER_MINUTE = 130;

export function AnalyzeScriptStream() {
  const { value: text, set: setText, saved: textSaved } = useLocalStorage('yubot_analyze_text', '');
  const { value: videoType, set: setVideoType } = useLocalStorage('yubot_analyze_videoType', 'long');
  const { value: niche, set: setNiche } = useLocalStorage('yubot_analyze_niche', 'business');
  const { value: depth, set: setDepth } = useLocalStorage('yubot_analyze_depth', 'standard');
  const [isExporting, setIsExporting] = useState(false);

  const { complete, completion, isLoading, stop } = useCompletion({
    api: '/api/analyze-script',
    streamProtocol: 'text',
  });

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = wordCount > 0 ? +(wordCount / WORDS_PER_MINUTE).toFixed(1) : 0;

  const handleSubmit = () => {
    if (!text.trim() || wordCount < 20) return;
    complete('', { body: { text, videoType, niche, depth } });
  };

  const handleExport = async () => {
    if (!completion) return;
    setIsExporting(true);
    try {
      const blob = await generateDocxBlob(completion, 'analyse');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yubot_analyse_${new Date().toISOString().split('T')[0]}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRewrite = () => {
    if (!text.trim()) return;
    complete('', { body: { text, videoType, niche, depth: 'approfondie' } });
  };

  const handleReset = () => {
    if (!confirm('Réinitialiser tous les champs ?')) return;
    setText('');
    setVideoType('long');
    setNiche('business');
    setDepth('standard');
  };

  return (
    <div className="space-y-6">
      {!completion && (
        <>
          {/* textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#F5F0E8]">Colle ton script complet ici</label>
              {textSaved && <span className="text-xs text-[#6B6560]">Sauvegardé</span>}
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Colle ton script, tes notes, ton brouillon..."
              rows={10}
              className="w-full p-3 text-sm border border-[#1E1E1E] rounded resize-y bg-[#111111] text-[#F5F0E8] placeholder-[#3A3A3A] focus:outline-none focus:border-[#FFE600]/40 focus:ring-1 focus:ring-[#FFE600]/20 transition-colors font-mono"
            />
            {wordCount > 0 && (
              <p className="text-xs text-[#6B6560]">
                <strong className="text-[#F5F0E8]">{wordCount} mots</strong> · ~{minutes} min de vidéo
              </p>
            )}
          </div>

          {/* options */}
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-mono text-[#6B6560] uppercase tracking-widest">Type de vidéo cible</p>
              <div className="space-y-1.5">
                {VIDEO_TYPES.map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="videoType"
                      value={value}
                      checked={videoType === value}
                      onChange={() => setVideoType(value)}
                      className="accent-[#FFE600]"
                    />
                    <span className={`text-sm transition-colors ${videoType === value ? 'text-[#F5F0E8]' : 'text-[#6B6560] group-hover:text-[#F5F0E8]'}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-[#6B6560] uppercase tracking-widest">Niche du contenu</p>
              <div className="grid grid-cols-2 gap-1.5">
                {NICHES.map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="niche"
                      value={value}
                      checked={niche === value}
                      onChange={() => setNiche(value)}
                      className="accent-[#FFE600]"
                    />
                    <span className={`text-sm transition-colors ${niche === value ? 'text-[#F5F0E8]' : 'text-[#6B6560] group-hover:text-[#F5F0E8]'}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-[#6B6560] uppercase tracking-widest">Profondeur d&apos;analyse</p>
              <div className="space-y-2">
                {DEPTHS.map(({ value, label, desc }) => (
                  <label
                    key={value}
                    className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${depth === value ? 'border-[#FFE600]/30 bg-[#FFE600]/5' : 'border-[#1E1E1E] hover:border-[#2E2E2E]'}`}
                    onClick={() => setDepth(value)}
                  >
                    <input
                      type="radio"
                      name="depth"
                      value={value}
                      checked={depth === value}
                      onChange={() => setDepth(value)}
                      className="accent-[#FFE600] mt-0.5"
                    />
                    <div>
                      <p className={`text-sm font-medium ${depth === value ? 'text-[#FFE600]' : 'text-[#F5F0E8]'}`}>{label}</p>
                      <p className="text-xs text-[#6B6560] mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading || wordCount < 20}
              className="flex-1 py-3 bg-[#FFE600] text-[#0A0A0A] font-semibold text-sm rounded hover:bg-[#FFE600]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyse en cours...' : 'Analyser mon texte'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 border border-[#1E1E1E] text-[#6B6560] text-sm rounded hover:border-[#2E2E2E] hover:text-[#F5F0E8] transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </>
      )}

      {isLoading && !completion && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B6560] animate-pulse">YUBOT analyse ton script...</p>
          <button onClick={stop} className="text-xs text-[#6B6560] hover:text-[#F5F0E8] border border-[#1E1E1E] px-3 py-1.5 rounded transition-colors">
            Arrêter
          </button>
        </div>
      )}

      {completion && (
        <div className="space-y-4">
          {/* back + regen */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { stop(); window.location.reload(); }}
              className="text-xs text-[#6B6560] hover:text-[#F5F0E8] transition-colors flex items-center gap-1.5"
            >
              ← Nouvelle analyse
            </button>
            {!isLoading && (
              <button
                onClick={handleSubmit}
                className="text-xs text-[#6B6560] hover:text-[#F5F0E8] border border-[#1E1E1E] px-3 py-1.5 rounded transition-colors"
              >
                Relancer
              </button>
            )}
          </div>

          <AnalyzeReport
            raw={completion}
            isStreaming={isLoading}
            onRewrite={handleRewrite}
            onExport={handleExport}
          />

          {isExporting && <p className="text-xs text-[#6B6560] animate-pulse">Génération du Word...</p>}
        </div>
      )}
    </div>
  );
}
