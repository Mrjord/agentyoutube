'use client';

import { useState, useMemo } from 'react';

/* ── types ──────────────────────────────────────────────────── */
interface PatternRow {
  id: string;
  patternType: string;
  content: unknown;
  tone: string;
  durationBucket: string;
  viralityScore: number;
  createdAt: Date | null;
  videoTitle: string | null;
  videoChannel: string | null;
  videoUrl: string | null;
  videoViewCount: number | null;
}

/* ── helpers ────────────────────────────────────────────────── */
function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const TYPE_LABELS: Record<string, string> = {
  hook_analysis: 'Hook',
  narrative_structure: 'Structure narrative',
  global_formula: 'Formule globale',
};

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  hook_analysis:      { bg: '#1A0E05', text: '#FB923C', border: '#EA580C' },
  narrative_structure:{ bg: '#0A0F1F', text: '#60A5FA', border: '#2563EB' },
  global_formula:     { bg: '#0A1A0F', text: '#4ADE80', border: '#16A34A' },
};

const TONE_COLORS: Record<string, string> = {
  viral:       '#FFE600',
  éducatif:    '#4ADE80',
  storytelling:'#A78BFA',
  tutoriel:    '#60A5FA',
  provocateur: '#F87171',
  inspirant:   '#FB923C',
  analytique:  '#94A3B8',
};

/* ── tag chip ────────────────────────────────────────────────── */
function Tag({ label, color }: { label: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={color
        ? { backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }
        : { backgroundColor: '#1E1E1E', color: '#6B6560', border: '1px solid #2A2A2A' }
      }
    >
      {label}
    </span>
  );
}

/* ── section block ───────────────────────────────────────────── */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-mono text-[#3A3A3A] uppercase tracking-widest">{label}</p>
      <div className="text-sm text-[#C4BFB7] leading-relaxed">{children}</div>
    </div>
  );
}

function Bullet({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-[#C4BFB7] leading-relaxed">
          <span className="text-[#FFE600] mt-0.5 shrink-0">›</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── pattern renderers ───────────────────────────────────────── */
function HookCard({ c }: { c: Record<string, string> }) {
  const hookTypeColors: Record<string, string> = {
    'question choc': '#F87171',
    'stat surprenante': '#60A5FA',
    contradiction: '#FB923C',
    'promesse directe': '#4ADE80',
    histoire: '#A78BFA',
    défi: '#FFE600',
  };
  const hColor = hookTypeColors[c.hook_type?.toLowerCase()] ?? '#6B6560';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Section label="Type de hook">
          <span className="inline-flex items-center px-2.5 py-1 rounded font-semibold text-sm"
            style={{ backgroundColor: `${hColor}18`, color: hColor, border: `1px solid ${hColor}30` }}>
            {c.hook_type}
          </span>
        </Section>
        <Section label="Émotion déclenchée">
          <span className="text-[#F5F0E8] font-medium">{c.emotion_triggered}</span>
        </Section>
      </div>

      {c.opening_phrase && (
        <div className="border-l-2 border-[#FFE600]/50 pl-4 py-1">
          <p className="text-[10px] font-mono text-[#3A3A3A] uppercase tracking-widest mb-1.5">Phrase d'ouverture</p>
          <p className="text-sm text-[#F5F0E8] italic leading-relaxed">&ldquo;{c.opening_phrase}&rdquo;</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {c.implicit_promise && (
          <Section label="Promesse implicite">{c.implicit_promise}</Section>
        )}
        {c.tension_created && (
          <Section label="Tension créée">{c.tension_created}</Section>
        )}
      </div>
    </div>
  );
}

function NarrativeCard({ c }: { c: Record<string, string> }) {
  const acts = [
    { key: 'act1', label: 'Acte 1 — Mise en place', pct: '0–20%' },
    { key: 'act2', label: 'Acte 2 — Développement', pct: '20–80%' },
    { key: 'act3', label: 'Acte 3 — Résolution', pct: '80–100%' },
  ];

  const rhythmIcons: Record<string, string> = {
    rapide: '⚡',
    lent: '◎',
    alterné: '⇄',
    crescendo: '↗',
  };

  return (
    <div className="space-y-4">
      {/* acts timeline */}
      <div className="space-y-3">
        {acts.map(({ key, label, pct }) => c[key] && (
          <div key={key} className="flex gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#FFE600] mt-1.5" />
              <div className="w-px flex-1 bg-[#1E1E1E] mt-1" />
            </div>
            <div className="pb-4 space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-[#F5F0E8]">{label}</p>
                <span className="text-[10px] font-mono text-[#3A3A3A]">{pct}</span>
              </div>
              <p className="text-sm text-[#C4BFB7] leading-relaxed">{c[key]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {c.rhythm && (
          <Section label="Rythme narratif">
            <span className="text-[#F5F0E8] font-medium">
              {rhythmIcons[c.rhythm?.toLowerCase()] ?? '→'} {c.rhythm}
            </span>
          </Section>
        )}
        {c.re_hook && (
          <div className="md:col-span-2">
            <Section label="Re-hook mi-vidéo">{c.re_hook}</Section>
          </div>
        )}
      </div>

      {c.open_loop && (
        <div className="border border-[#FFE600]/20 rounded-lg p-3 bg-[#FFE600]/5">
          <p className="text-[10px] font-mono text-[#FFE600]/60 uppercase tracking-widest mb-1.5">Loop ouvert</p>
          <p className="text-sm text-[#C4BFB7] leading-relaxed">{c.open_loop}</p>
        </div>
      )}
    </div>
  );
}

function GlobalFormulaCard({ c }: { c: Record<string, unknown> }) {
  const steps = typeof c.formula === 'string'
    ? c.formula.split(/\s*[→>]\s*/).filter(Boolean)
    : [];

  return (
    <div className="space-y-4">
      {/* formula steps */}
      {steps.length > 0 && (
        <div>
          <p className="text-[10px] font-mono text-[#3A3A3A] uppercase tracking-widest mb-3">Formule</p>
          <div className="flex flex-wrap items-center gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded border border-[#1E1E1E] bg-[#111111] text-sm text-[#F5F0E8] font-medium">
                  {step.trim()}
                </span>
                {i < steps.length - 1 && (
                  <span className="text-[#FFE600] font-bold text-lg">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {typeof c.title_pattern === 'string' && c.title_pattern && (
        <Section label="Structure du titre">
          <span className="text-[#F5F0E8]">{c.title_pattern}</span>
        </Section>
      )}

      {typeof c.viral_reason === 'string' && c.viral_reason && (
        <div className="border-l-2 border-[#4ADE80]/50 pl-4 py-1">
          <p className="text-[10px] font-mono text-[#3A3A3A] uppercase tracking-widest mb-1.5">Pourquoi ça a explosé</p>
          <p className="text-sm text-[#C4BFB7] leading-relaxed">{c.viral_reason}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.isArray(c.key_techniques) && c.key_techniques.length > 0 && (
          <Section label="Techniques clés">
            <Bullet items={c.key_techniques as string[]} />
          </Section>
        )}
        {Array.isArray(c.reusable_elements) && c.reusable_elements.length > 0 && (
          <Section label="Éléments réutilisables">
            <Bullet items={c.reusable_elements as string[]} />
          </Section>
        )}
      </div>
    </div>
  );
}

/* ── single pattern card ─────────────────────────────────────── */
function PatternCard({ p }: { p: PatternRow }) {
  const [open, setOpen] = useState(false);
  const colors = TYPE_COLORS[p.patternType] ?? TYPE_COLORS.global_formula;
  const toneColor = TONE_COLORS[p.tone] ?? '#6B6560';
  const content = (p.content ?? {}) as Record<string, unknown>;

  const summary = useMemo(() => {
    if (p.patternType === 'hook_analysis') {
      const c = content as Record<string, string>;
      return c.opening_phrase ? `"${c.opening_phrase.slice(0, 90)}${c.opening_phrase.length > 90 ? '…' : ''}"` : c.hook_type;
    }
    if (p.patternType === 'narrative_structure') {
      const c = content as Record<string, string>;
      return c.act1?.slice(0, 100) + (c.act1?.length > 100 ? '…' : '');
    }
    if (p.patternType === 'global_formula') {
      const c = content as Record<string, string>;
      return c.formula;
    }
    return '';
  }, [p.patternType, content]);

  return (
    <div
      className="border rounded-lg overflow-hidden transition-all"
      style={{ borderColor: open ? colors.border : '#1E1E1E', backgroundColor: open ? colors.bg : '#0D0D0D' }}
    >
      {/* header — always visible */}
      <button
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ backgroundColor: `${colors.border}20`, color: colors.text, border: `1px solid ${colors.border}40` }}
            >
              {TYPE_LABELS[p.patternType] ?? p.patternType}
            </span>
            <Tag label={p.tone} color={toneColor} />
            <Tag label={p.durationBucket} />
          </div>

          {summary && (
            <p className="text-sm text-[#6B6560] leading-relaxed line-clamp-2 pr-4">{summary}</p>
          )}

          {p.videoChannel && (
            <p className="text-xs text-[#3A3A3A]">{p.videoChannel}{p.videoTitle ? ` · ${p.videoTitle.slice(0, 60)}${p.videoTitle.length > 60 ? '…' : ''}` : ''}</p>
          )}
        </div>

        {/* score */}
        <div className="shrink-0 text-right space-y-1">
          <p className="font-heading text-xl font-bold" style={{ color: colors.text }}>
            {p.viralityScore >= 1000
              ? fmt(Math.round(p.viralityScore))
              : p.viralityScore.toFixed(1)}
          </p>
          {p.videoViewCount && (
            <p className="text-[10px] text-[#3A3A3A] font-mono">{fmt(p.videoViewCount)} vues</p>
          )}
          <p className="text-[#3A3A3A] text-xs">{open ? '▲' : '▼'}</p>
        </div>
      </button>

      {/* expanded content */}
      {open && (
        <div className="px-5 pb-5 space-y-5 border-t" style={{ borderColor: `${colors.border}30` }}>
          <div className="pt-4">
            {p.patternType === 'hook_analysis' && (
              <HookCard c={content as Record<string, string>} />
            )}
            {p.patternType === 'narrative_structure' && (
              <NarrativeCard c={content as Record<string, string>} />
            )}
            {p.patternType === 'global_formula' && (
              <GlobalFormulaCard c={content as Record<string, unknown>} />
            )}
          </div>

          {/* actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#1E1E1E]">
            {p.videoUrl && (
              <a
                href={p.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#6B6560] hover:text-[#F5F0E8] transition-colors flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M6.5 3.5h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3M9 2h5v5M9 7l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Voir la vidéo source
              </a>
            )}
            <button
              className="text-xs text-[#6B6560] hover:text-[#F5F0E8] transition-colors flex items-center gap-1.5"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(content, null, 2))}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 10V3a1 1 0 0 1 1-1h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Copier le pattern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── main library component ──────────────────────────────────── */
const FILTER_TYPES = ['Tous', 'Hook', 'Structure narrative', 'Formule globale'];
const TYPE_MAP: Record<string, string> = {
  'Hook': 'hook_analysis',
  'Structure narrative': 'narrative_structure',
  'Formule globale': 'global_formula',
};

export function PatternLibrary({ patterns }: { patterns: PatternRow[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [toneFilter, setToneFilter] = useState('Tous');

  const tones = useMemo(() => {
    const all = ['Tous', ...Array.from(new Set(patterns.map(p => p.tone))).sort()];
    return all;
  }, [patterns]);

  const filtered = useMemo(() => {
    return patterns.filter(p => {
      if (typeFilter !== 'Tous' && p.patternType !== TYPE_MAP[typeFilter]) return false;
      if (toneFilter !== 'Tous' && p.tone !== toneFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const text = JSON.stringify(p.content).toLowerCase() + (p.videoTitle ?? '').toLowerCase() + (p.videoChannel ?? '').toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [patterns, typeFilter, toneFilter, search]);

  return (
    <div className="space-y-6">
      {/* search + filters */}
      <div className="space-y-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher dans les patterns…"
          className="w-full px-4 py-2.5 text-sm border border-[#1E1E1E] rounded bg-[#111111] text-[#F5F0E8] placeholder-[#3A3A3A] focus:outline-none focus:border-[#FFE600]/40 focus:ring-1 focus:ring-[#FFE600]/10"
        />
        <div className="flex flex-wrap gap-2">
          {FILTER_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                typeFilter === t
                  ? 'bg-[#FFE600]/10 text-[#FFE600] border-[#FFE600]/30'
                  : 'border-[#1E1E1E] text-[#6B6560] hover:border-[#2E2E2E] hover:text-[#F5F0E8]'
              }`}
            >
              {t}
            </button>
          ))}
          <div className="w-px bg-[#1E1E1E] mx-1" />
          {tones.map(t => (
            <button
              key={t}
              onClick={() => setToneFilter(t)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                toneFilter === t
                  ? 'bg-[#FFE600]/10 text-[#FFE600] border-[#FFE600]/30'
                  : 'border-[#1E1E1E] text-[#6B6560] hover:border-[#2E2E2E] hover:text-[#F5F0E8]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* count */}
      <p className="text-xs text-[#3A3A3A] font-mono">
        {filtered.length} pattern{filtered.length !== 1 ? 's' : ''}{patterns.length !== filtered.length ? ` sur ${patterns.length}` : ''}
      </p>

      {/* cards */}
      <div className="space-y-3">
        {filtered.map(p => <PatternCard key={p.id} p={p} />)}
        {filtered.length === 0 && (
          <p className="text-sm text-[#6B6560] py-6 text-center">Aucun pattern ne correspond à ce filtre.</p>
        )}
      </div>
    </div>
  );
}
