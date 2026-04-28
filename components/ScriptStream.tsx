'use client';

import { useCompletion } from '@ai-sdk/react';
import { ScriptForm } from './ScriptForm';
import { Button } from '@/components/ui/button';

export function ScriptStream() {
  const { complete, completion, isLoading, stop } = useCompletion({
    api: '/api/generate',
    streamProtocol: 'text',
  });

  const handleSubmit = (theme: string, duration: string, tone: string) => {
    complete(theme, { body: { duration, tone } });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(completion);
  };

  const handleExport = () => {
    const blob = new Blob([completion], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <ScriptForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground animate-pulse">
            Claude rédige votre script...
          </p>
          <Button variant="outline" size="sm" onClick={stop}>
            Arrêter
          </Button>
        </div>
      )}

      {completion && (
        <div className="space-y-3">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              Copier
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              Export Markdown
            </Button>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg max-h-[60vh] overflow-y-auto">
            {completion}
          </pre>
        </div>
      )}
    </div>
  );
}
