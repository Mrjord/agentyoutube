'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import { ScriptForm } from './ScriptForm';
import { ScriptPreview } from './ScriptPreview';
import { Button } from '@/components/ui/button';
import { generateDocxBlob } from '@/lib/export/generateDocx';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { useSaveGuard } from '@/components/SaveGuardProvider';

type LastParams = { theme: string; duration: string; tone: string };

export function ScriptStream() {
  const [lastParams, setLastParams] = useState<LastParams | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratedThisSession, setIsGeneratedThisSession] = useState(false);
  const [hasBeenCopied, setHasBeenCopied] = useState(false);
  const [hasBeenDownloaded, setHasBeenDownloaded] = useState(false);
  const [savedBannerVisible, setSavedBannerVisible] = useState(false);
  const savedBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasLoadingRef = useRef(false);

  const { value: savedCompletion, set: setSavedCompletion, clear: clearSavedCompletion } = useLocalStorage('yubot_generate_result', '');
  const { value: savedLastParams, set: setSavedLastParams, clear: clearSavedLastParams } = useLocalStorage<LastParams | null>('yubot_generate_result_meta', null);
  const { register, clear } = useSaveGuard();

  const { complete, completion, isLoading, stop } = useCompletion({
    api: '/api/generate',
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
  const effectiveLastParams = lastParams || savedLastParams;
  const hasBeenSaved = hasBeenCopied || hasBeenDownloaded;

  // Refs for guard callbacks — always hold latest values without deps churn
  const completionRef = useRef('');
  completionRef.current = shownCompletion;
  const lastParamsRef = useRef<LastParams | null>(null);
  lastParamsRef.current = effectiveLastParams;

  // Green saved banner auto-dismisses after 3s
  useEffect(() => {
    if (!hasBeenSaved) return;
    setSavedBannerVisible(true);
    if (savedBannerTimerRef.current) clearTimeout(savedBannerTimerRef.current);
    savedBannerTimerRef.current = setTimeout(() => setSavedBannerVisible(false), 3000);
    return () => { if (savedBannerTimerRef.current) clearTimeout(savedBannerTimerRef.current); };
  }, [hasBeenSaved]);

  // Block browser navigation (refresh / close tab)
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
          const blob = await generateDocxBlob(completionRef.current, lastParamsRef.current?.theme ?? 'script');
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const date = new Date().toISOString().split('T')[0];
          const slug = (lastParamsRef.current?.theme ?? 'script').toLowerCase().replace(/\s+/g, '-').slice(0, 40);
          a.download = `yubot_script_${date}_${slug}.docx`;
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

  const handleSubmit = (theme: string, duration: string, tone: string) => {
    const params = { theme, duration, tone };
    setLastParams(params);
    setSavedLastParams(params);
    clearSavedCompletion();
    setIsGeneratedThisSession(true);
    setHasBeenCopied(false);
    setHasBeenDownloaded(false);
    complete(theme, { body: { duration, tone } });
  };

  const handleRegenerate = () => {
    if (!effectiveLastParams) return;
    clearSavedCompletion();
    setHasBeenCopied(false);
    setHasBeenDownloaded(false);
    complete(effectiveLastParams.theme, { body: { duration: effectiveLastParams.duration, tone: effectiveLastParams.tone } });
  };

  const handleFormReset = () => {
    clearSavedCompletion();
    clearSavedLastParams();
    setLastParams(null);
    setIsGeneratedThisSession(false);
    setHasBeenCopied(false);
    setHasBeenDownloaded(false);
    clear();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shownCompletion);
    setHasBeenCopied(true);
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      const blob = await generateDocxBlob(shownCompletion, effectiveLastParams?.theme ?? 'script');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().split('T')[0];
      const slug = (effectiveLastParams?.theme ?? 'script').toLowerCase().replace(/\s+/g, '-').slice(0, 40);
      a.download = `yubot_script_${date}_${slug}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
    setHasBeenDownloaded(true);
  };

  return (
    <div className="space-y-6">
      <ScriptForm onSubmit={handleSubmit} isLoading={isLoading} onReset={handleFormReset} />

      {isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground animate-pulse">
            YUBOT rédige votre script...
          </p>
          <Button variant="outline" size="sm" onClick={stop}>
            Arrêter
          </Button>
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
                <button onClick={handleCopy} className="text-xs font-bold underline underline-offset-2 shrink-0 hover:opacity-70">
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

          <div className="flex gap-2 justify-end flex-wrap">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              Copier le texte
            </Button>
            <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isLoading}>
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
