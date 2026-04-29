'use client';

import { useMemo, useState } from 'react';

/* ── parser ─────────────────────────────────────────────────── */
export interface AnalysisReport {
  score: number | null;
  verdict: string;
  hookScore: number | null;
  hook: string;
  structureScore: number | null;
  structure: string;
  styleScore: number | null;
  style: string;
  densiteScore: number | null;
  densite: string;
  tensionScore: number | null;
  tension: string;
  retention: string;
  payoffScore: number | null;
  payoff: string;
}

const TAGS: (keyof AnalysisReport)[] = [
  'score', 'verdict',
  'hookScore', 'hook',
  'structureScore', 'structure',
  'styleScore', 'style',
  'densiteScore', 'densite',
  'tensionScore', 'tension',
  'retention',
  'payoffScore', 'payoff',
];

const TAG_MAP: Record<string, keyof AnalysisReport> = {
  '##SCORE##': 'score',
  '##VERDICT##': 'verdict',
  '##HOOK_SCORE##': 'hookScore',
  '##HOOK##': 'hook',
  '##STRUCTURE_SCORE##': 'structureScore',
  '##STRUCTURE##': 'structure',
  '##STYLE_SCORE##': 'styleScore',
  '##STYLE##': 'style',
  '##DENSITE_SCORE##': 'densiteScore',
  '##DENSITE##': 'densite',
  '##TENSION_SCORE##': 'tensionScore',
  '##TENSION##': 'tension',
  '##RETENTION##': 'retention',
  '##PAYOFF_SCORE##': 'payoffScore',
  '##PAYOFF##': 'payoff',
};

export function parseReport(raw: string): AnalysisReport {
  const result: AnalysisReport = {
    score: null, verdict: '',
    hookScore: null, hook: '',
    structureScore: null, structure: '',
    styleScore: null, style: '',
    densiteScore: null, densite: '',
    tensionScore: null, tension: '',
    retention: '',
    payoffScore: null, payoff: '',
  };

  const tagPattern = /##[A-Z_]+##/g;
  const tagMatches = [...raw.matchAll(tagPattern)];

  for (let i = 0; i < tagMatches.length; i++) {
    const match = tagMatches[i];
    const tag = match[0];
    const key = TAG_MAP[tag];
    if (!key) continue;

    const start = (match.index ?? 0) + tag.length;
    const end = tagMatches[i + 1]?.index ?? raw.length;
    const value = raw.slice(start, end).trim();

    if (key === 'score' || key.endsWith('Score')) {
      const n = parseInt(value, 10);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[key] = isNaN(n) ? null : n;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[key] = value;
    }
  }

  return result;
}

/* ── helpers ────────────────────────────────────────────────── */
function scoreColor(s: number | null): string {
  if (s === null) return '#3A3A3A';
  if (s >= 8) return '#4ADE80';
  if (s >= 6) return '#c4302b';
  if (s >= 4) return '#FB923C';
  return '#F87171';
}

function globalScoreColor(s: number | null): string {
  if (s === null) return '#3A3A3A';
  if (s >= 80) return '#4ADE80';
  if (s >= 60) return '#c4302b';
  if (s >= 40) return '#FB923C';
  return '#F87171';
}

function scoreLabel(s: number | null): string {
  if (s === null) return '';
  if (s >= 80) return 'Excellent';
  if (s >= 60) return 'Bon';
  if (s >= 40) return 'Moyen';
  return 'Faible';
}

function renderText(text: string) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="text-[#F5F0E8] font-semibold mt-3 mb-1">{line.slice(2, -2)}</p>;
    }
    if (line.match(/^\*\*(.+?)\*\*/)) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-sm text-[#C4BFB7] leading-relaxed">
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} className="text-[#F5F0E8]">{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    }
    if (line.startsWith('•') || line.startsWith('-')) {
      return (
        <div key={i} className="flex items-start gap-2 text-sm text-[#C4BFB7] leading-relaxed">
          <span className="text-[#c4302b] shrink-0 mt-0.5">›</span>
          <span>{line.replace(/^[•\-]\s*/, '')}</span>
        </div>
      );
    }
    return <p key={i} className="text-sm text-[#C4BFB7] leading-relaxed">{line}</p>;
  });
}

/* ── section card ───────────────────────────────────────────── */
function Section({
  title, score, content, defaultOpen = false,
  accentColor,
}: {
  title: string;
  score: number | null;
  content: string;
  defaultOpen?: boolean;
  accentColor: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (!content.trim()) return null;
  const sColor = scoreColor(score);

  return (
    <div
      className="border rounded-lg overflow-hidden transition-colors"
      style={{ borderColor: open ? accentColor : '#1E1E1E', backgroundColor: open ? `${accentColor}08` : '#0D0D0D' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          {score !== null && (
            <span className="font-heading text-lg font-bold" style={{ color: sColor }}>
              {score}/10
            </span>
          )}
          <span className="font-heading font-semibold text-sm text-[#F5F0E8]">{title}</span>
          {score !== null && (
            <div className="w-24 h-1 rounded-full bg-[#1E1E1E] overflow-hidden hidden sm:block">
              <div className="h-full rounded-full transition-all" style={{ width: `${score * 10}%`, backgroundColor: sColor }} />
            </div>
          )}
        </div>
        <span className="text-[#3A3A3A] text-xs ml-4">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t space-y-1.5" style={{ borderColor: `${accentColor}20` }}>
          <div className="pt-3 space-y-1">
            {renderText(content)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── main report ────────────────────────────────────────────── */
interface Props {
  raw: string;
  isStreaming: boolean;
  onRewrite: () => void;
  onExport: () => void;
}

export function AnalyzeReport({ raw, isStreaming, onRewrite, onExport }: Props) {
  const report = useMemo(() => parseReport(raw), [raw]);

  const SECTIONS = [
    { key: 'hook' as const, scoreKey: 'hookScore' as const, title: 'Hook', color: '#DC2626', defaultOpen: true },
    { key: 'structure' as const, scoreKey: 'structureScore' as const, title: 'Structure narrative', color: '#2563EB' },
    { key: 'style' as const, scoreKey: 'styleScore' as const, title: "Style d'écriture", color: '#7C3AED' },
    { key: 'densite' as const, scoreKey: 'densiteScore' as const, title: "Densité d'information", color: '#16A34A' },
    { key: 'tension' as const, scoreKey: 'tensionScore' as const, title: 'Tension & engagement', color: '#EA580C' },
    { key: 'retention' as const, scoreKey: null as null, title: 'Rétention estimée', color: '#0891B2' },
    { key: 'payoff' as const, scoreKey: 'payoffScore' as const, title: 'Promesse / Payoff', color: '#4338CA' },
  ];

  const scoreNum = report.score;
  const scoreCol = globalScoreColor(scoreNum);

  const completedSections = SECTIONS.filter(s => report[s.key]?.trim()).length;

  return (
    <div className="space-y-6">
      {/* global score */}
      {(scoreNum !== null || report.verdict) && (
        <div className="border border-[#1E1E1E] rounded-lg p-6 bg-[#0D0D0D] space-y-4">
          {scoreNum !== null && (
            <div className="flex items-end gap-4">
              <div>
                <p className="text-xs font-mono text-[#3A3A3A] uppercase tracking-widest mb-1">Score viral estimé</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-5xl font-bold" style={{ color: scoreCol }}>{scoreNum}</span>
                  <span className="text-[#6B6560] text-lg">/100</span>
                  <span className="text-sm font-medium ml-1" style={{ color: scoreCol }}>{scoreLabel(scoreNum)}</span>
                </div>
              </div>
              <div className="flex-1 mb-2">
                <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${scoreNum}%`, backgroundColor: scoreCol }}
                  />
                </div>
              </div>
            </div>
          )}

          {report.verdict && (
            <div className="border-l-2 pl-4 py-1" style={{ borderColor: `${scoreCol}60` }}>
              <p className="text-[10px] font-mono text-[#3A3A3A] uppercase tracking-widest mb-1.5">Verdict</p>
              <p className="text-sm text-[#C4BFB7] leading-relaxed">{report.verdict}</p>
            </div>
          )}

          {isStreaming && completedSections < SECTIONS.length && (
            <p className="text-xs text-[#6B6560] animate-pulse font-mono">
              Analyse en cours — {completedSections}/{SECTIONS.length} sections...
            </p>
          )}
        </div>
      )}

      {/* section cards */}
      <div className="space-y-3">
        {SECTIONS.map(({ key, scoreKey, title, color, defaultOpen }) => (
          <Section
            key={key}
            title={title}
            score={scoreKey ? report[scoreKey] : null}
            content={report[key]}
            defaultOpen={defaultOpen}
            accentColor={color}
          />
        ))}
      </div>

      {/* actions */}
      {!isStreaming && scoreNum !== null && (
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={onRewrite}
            className="px-4 py-2 bg-[#c4302b] text-[#0A0A0A] text-sm font-semibold rounded hover:bg-[#c4302b]/90 transition-colors"
          >
            Appliquer les suggestions automatiquement
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 border border-[#1E1E1E] text-[#F5F0E8] text-sm font-medium rounded hover:border-[#2E2E2E] transition-colors"
          >
            Télécharger le rapport en Word
          </button>
        </div>
      )}
    </div>
  );
}
