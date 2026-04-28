'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState } from 'react';
import { ScriptForm } from './ScriptForm';
import { ScriptPreview } from './ScriptPreview';
import { Button } from '@/components/ui/button';
import { generateDocxBlob } from '@/lib/export/generateDocx';

export function ScriptStream() {
  const [lastParams, setLastParams] = useState<{ theme: string; duration: string; tone: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { complete, completion, isLoading, stop } = useCompletion({
    api: '/api/generate',
    streamProtocol: 'text',
  });

  const handleSubmit = (theme: string, duration: string, tone: string) => {
    setLastParams({ theme, duration, tone });
    complete(theme, { body: { duration, tone } });
  };

  const handleRegenerate = () => {
    if (lastParams) {
      complete(lastParams.theme, { body: { duration: lastParams.duration, tone: lastParams.tone } });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(completion);
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      const blob = await generateDocxBlob(completion, lastParams?.theme ?? 'script');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().split('T')[0];
      const slug = (lastParams?.theme ?? 'script').toLowerCase().replace(/\s+/g, '-').slice(0, 40);
      a.download = `yubot_script_${date}_${slug}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ScriptForm onSubmit={handleSubmit} isLoading={isLoading} />

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

      {completion && (
        <div className="space-y-4">
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
          <ScriptPreview text={completion} />
        </div>
      )}
    </div>
  );
}
