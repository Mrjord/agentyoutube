'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DURATION_OPTIONS, TONE_OPTIONS } from '@/lib/constants';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

interface Props {
  onSubmit: (theme: string, duration: string, tone: string) => void;
  isLoading: boolean;
  onReset?: () => void;
}

export function ScriptForm({ onSubmit, isLoading, onReset }: Props) {
  const { value: theme, set: setTheme, saved: themeSaved } = useLocalStorage('yubot_generate_theme', '');
  const { value: duration, set: setDuration } = useLocalStorage('yubot_generate_duration', '10min');
  const { value: tone, set: setTone } = useLocalStorage('yubot_generate_tone', 'viral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;
    onSubmit(theme.trim(), duration, tone);
  };

  const handleReset = () => {
    if (!confirm('Réinitialiser tous les champs ?')) return;
    setTheme('');
    setDuration('10min');
    setTone('viral');
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-[#F5F0E8]">Thème de la vidéo</label>
          {themeSaved && <span className="text-xs text-[#6B6560]">Sauvegardé</span>}
        </div>
        <textarea
          value={theme}
          onChange={e => setTheme(e.target.value)}
          placeholder="Ex : Comment devenir riche en 2025 avec l'IA"
          maxLength={500}
          rows={3}
          className="w-full p-3 text-sm border border-[#1E1E1E] rounded resize-none bg-[#111111] text-[#F5F0E8] placeholder-[#3A3A3A] focus:outline-none focus:border-[#c4302b]/40 focus:ring-1 focus:ring-[#c4302b]/20 transition-colors"
        />
        <p className="text-xs text-[#3A3A3A] mt-1">{theme.length}/500</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#F5F0E8]">Durée</label>
          <Select value={duration} onValueChange={v => { if (v !== null) setDuration(v); }}>
            <SelectTrigger className="w-full">
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
          <label className="block text-sm font-medium mb-1.5 text-[#F5F0E8]">Ton</label>
          <Select value={tone} onValueChange={v => { if (v !== null) setTone(v); }}>
            <SelectTrigger className="w-full">
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

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading || !theme.trim()}
          className="flex-1"
        >
          {isLoading ? 'Génération en cours...' : 'Générer le script'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleReset} className="shrink-0">
          Réinitialiser
        </Button>
      </div>
    </form>
  );
}
