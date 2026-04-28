'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DURATION_OPTIONS, TONE_OPTIONS } from '@/lib/constants';

interface Props {
  onSubmit: (theme: string, duration: string, tone: string) => void;
  isLoading: boolean;
}

export function ScriptForm({ onSubmit, isLoading }: Props) {
  const [theme, setTheme] = useState('');
  const [duration, setDuration] = useState('10min');
  const [tone, setTone] = useState('viral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;
    onSubmit(theme.trim(), duration, tone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Thème de la vidéo</label>
        <Textarea
          value={theme}
          onChange={e => setTheme(e.target.value)}
          placeholder="Ex : Comment devenir riche en 2025 avec l'IA"
          maxLength={500}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">{theme.length}/500</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Durée</label>
          <Select value={duration} onValueChange={v => { if (v !== null) setDuration(v); }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ton</label>
          <Select value={tone} onValueChange={v => { if (v !== null) setTone(v); }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !theme.trim()}
        className="w-full"
      >
        {isLoading ? 'Génération en cours...' : 'Générer le script'}
      </Button>
    </form>
  );
}
