'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { ScriptPreview } from './ScriptPreview';
import { Button } from '@/components/ui/button';
import { generateDocxBlob } from '@/lib/export/generateDocx';
import { DURATION_OPTIONS, DURATION_TO_SECONDS, WORDS_PER_MINUTE } from '@/lib/constants';
import type { DurationOption } from '@/lib/constants';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { useSaveGuard } from '@/components/SaveGuardProvider';

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function AdaptStream() {
  const { value: text, set: setText, saved: textSaved } = useLocalStorage('yubot_adapt_text', '');
  const { value: duration, set: setDuration } = useLocalStorage<DurationOption>('yubot_adapt_duration', '10min');
  const { value: allowCompletion, set: setAllowCompletion } = useLocalStorage('yubot_adapt_complete', false);
  const { value: savedCompletion, set: setSavedCompletion, clear: clearSavedCompletion } = useLocalStorage('yubot_adapt_result', '');
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratedThisSession, setIsGeneratedThisSession] = useState(false);
  const [hasBeenCopied, setHasBeenCopied] = useState(false);
  const [hasBeenDownloaded, setHasBeenDownloaded] = useState(false);
  const [savedBannerVisible, setSavedBannerVisible] = useState(false);
  const savedBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasLoadingRef = useRef(false);

  const { register, clear } = useSaveGuard();

  const { complete, completion, isLoading, stop } = useCompletion({
    api: '/api/adapt',
    streamProtocol: 'text',
  });

  // Save result when streaming finishes
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading && completion) {
      setSavedCompletion(completion);
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading, completion, setSavedCompletion]);

  const shownCompletion = completion || savedCompletion;
  const hasBeenSaved = hasBeenCopied || hasBeenDownloaded;

  // Ref for guard callbacks
  const completionRef = useRef('');
  completionRef.current = shownCompletion;

  // Green saved banner auto-dismisses after 3s
  useEffect(() => {
    if (!hasBeenSaved) return;
    setSavedBannerVisible(true);
    if (savedBannerTimerRef.current) clearTimeout(savedBannerTimerRef.current);
    savedBannerTimerRef.current = setTimeout(() => setSavedBannerVisible(false), 3000);
    return () => { if (savedBannerTimerRef.current) clearTimeout(savedBannerTimerRef.current); };
  }, [hasBeenSaved]);

  // Block browser navigation
  useEffect(() => {
    if (!isGeneratedThisSession || hasBeenSaved) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isGeneratedThisSession, hasBeenSaved]);

  // Register/clear internal navigation guard
  useEffect(() => {
    if (!isGeneratedThisSession || hasBeenSaved || isLoading) {
      if (!isLoading) clear();
      return;
    }
    register({
      copy: () => {
        navigator.clipboard.writeText(completionRef.current);
        setHasBeenCopied(true);
      },
      download: async () => {
        setIsExporting(true);
        try {
          const blob = await generateDocxBlob(completionRef.current, 'adaptation');
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `yubot_script_${new Date().toISOString().split('T')[0]}_adaptation.docx`;
          a.click();
          URL.revokeObjectURL(url);
        } finally {
          setIsExporting(false);
        }
        setHasBeenDownloaded(true);
      },
    });
    return () => clear();
  }, [isGeneratedThisSession, hasBeenSaved, isLoading, register, clear]);

  const wordCount = useMemo(() => countWords(text), [text]);
  const originalMinutes = +(wordCount / WORDS_PER_MINUTE).toFixed(1);
  const targetSeconds = DURATION_TO_SECONDS[duration] ?? 600;
  const targetMinutes = Math.round(targetSeconds / 60);
  const targetWords = targetMinutes * WORDS_PER_MINUTE;
  const gap = targetWords - wordCount;

  const handleSubmit = () => {
    if (!text.trim()) return;
    clearSavedCompletion();
    setIsGeneratedThisSession(true);
    setHasBeenCopied(false);
    setHasBeenDownloaded(false);
    complete('', { body: { text, duration, allowCompletion } });
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      const blob = await generateDocxBlob(shownCompletion, 'adaptation');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yubot_script_${new Date().toISOString().split('T')[0]}_adaptation.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
    setHasBeenDownloaded(true);
  };

  const handleReset = () => {
    if (!confirm('Réinitialiser tous les champs ?')) return;
    setText('');
    setDuration('10min');
    setAllowCompletion(false);
    clearSavedCompletion();
    setIsGeneratedThisSession(false);
    setHasBeenCopied(false);
    setHasBeenDownloaded(false);
    clear();
  };

  const tooShort = wordCount > 0 && gap > 50 && !allowCompletion;
  const tooLong = wordCount > 0 && gap < -50;

  return (
    <div className="space-y-6">
      {/* Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#F5F0E8]">Colle ton texte ici</label>
          {textSaved && <span className="text-xs text-[#6B6560]">Sauvegardé</span>}
        </div>
        <textarea
          className="w-full h-48 p-3 text-sm border border-[#1E1E1E] rounded resize-y font-mono bg-[#111111] text-[#F5F0E8] placeholder-[#3A3A3A] focus:outline-none focus:border-[#FFE600]/40 focus:ring-1 focus:ring-[#FFE600]/20 transition-colors"
          placeholder="Colle ton texte brut ici..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {wordCount > 0 && (
          <p className="text-xs text-[#6B6560]">
            Ton texte : <strong className="text-[#F5F0E8]">{wordCount} mots</strong> (~{originalMinutes} min de vidéo)
          </p>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#F5F0E8]">Durée cible de la vidéo</label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.filter(d => d !== '30s' && d !== '60s').map(d => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                duration === d
                  ? 'bg-[#FFE600]/10 text-[#FFE600] border-[#FFE600]/30'
                  : 'border-[#1E1E1E] text-[#6B6560] hover:text-[#F5F0E8] hover:border-[#2E2E2E]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        {wordCount > 0 && (
          <p className="text-xs text-[#6B6560]">
            Durée cible : <strong className="text-[#F5F0E8]">{targetMinutes} min</strong> (~{targetWords} mots) —{' '}
            <span className={gap > 50 ? 'text-amber-400' : gap < -50 ? 'text-orange-400' : 'text-green-400'}>
              {gap > 0 ? `+${gap} mots à ajouter` : gap < 0 ? `${Math.abs(gap)} mots à condenser` : 'longueur idéale'}
            </span>
          </p>
        )}
      </div>

      {/* Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={allowCompletion}
          onChange={e => setAllowCompletion(e.target.checked)}
          className="mt-0.5 accent-[#FFE600]"
        />
        <span className="text-sm text-[#6B6560] leading-snug">
          Autoriser l&apos;agent à compléter le texte si le contenu est insuffisant pour atteindre la durée sélectionnée
          <span className="block text-xs mt-0.5 opacity-70">
            Le contenu ajouté respecte le sujet et le style du texte original. Aucun fait inventé.
          </span>
        </span>
      </label>

      {/* Warnings */}
      {tooShort && (
        <div className="text-sm border border-amber-400/20 rounded p-3 text-amber-400 bg-amber-400/5">
          Ton texte (~{originalMinutes} min) est plus court que la durée cible ({targetMinutes} min).
          Coche &ldquo;Autoriser à compléter&rdquo; pour que l&apos;agent ajoute du contenu cohérent.
        </div>
      )}
      {tooLong && (
        <div className="text-sm border border-orange-400/20 rounded p-3 text-orange-400 bg-orange-400/5">
          Ton texte (~{originalMinutes} min) dépasse la durée cible ({targetMinutes} min).
          L&apos;agent va condenser sans supprimer d&apos;idées importantes.
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={!text.trim() || isLoading} className="flex-1">
          {isLoading ? 'Adaptation en cours...' : 'Adapter en script viral'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset} className="shrink-0">
          Réinitialiser
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B6560] animate-pulse">YUBOT adapte ton texte...</p>
          <Button variant="outline" size="sm" onClick={stop}>Arrêter</Button>
        </div>
      )}

      {shownCompletion && (
        <div className="space-y-4">
          {isGeneratedThisSession && (
            !hasBeenSaved ? (
              <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#FFE600] text-[#0A0A0A] text-sm shadow-md">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span className="flex-1 text-xs font-medium">Pense à copier ou télécharger ton script avant de quitter cette page.</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(shownCompletion); setHasBeenCopied(true); }}
                  className="text-xs font-bold underline underline-offset-2 shrink-0 hover:opacity-70"
                >
                  Copier
                </button>
              </div>
            ) : savedBannerVisible ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00C853] text-white text-xs font-medium shadow-md">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Script sauvegardé. Tu peux quitter sans risque.
              </div>
            ) : null
          )}

          {/* Legend */}
          <div className="flex gap-4 text-xs flex-wrap text-[#6B6560]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#0D2235', border: '1px solid #1E4060' }} />
              Ajouté par l&apos;agent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#2A1500', border: '1px solid #4A2800' }} />
              Condensé
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block bg-[#111111] border border-[#1E1E1E]" />
              Texte original
            </span>
          </div>

          <div className="flex gap-2 justify-end flex-wrap">
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(shownCompletion); setHasBeenCopied(true); }}>
              Copier le texte
            </Button>
            <Button variant="outline" size="sm" onClick={handleSubmit} disabled={isLoading}>
              Régénérer
            </Button>
            <Button size="sm" onClick={handleExportWord} disabled={isExporting || isLoading}>
              {isExporting ? 'Génération...' : 'Télécharger en Word'}
            </Button>
          </div>

          <ScriptPreview text={shownCompletion} />
        </div>
      )}
    </div>
  );
}
