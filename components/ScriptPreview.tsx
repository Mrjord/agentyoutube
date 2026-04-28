'use client';

interface Section {
  label: string;
  content: string;
}

const SECTION_HEX: Record<string, { border: string; bg: string; label: string }> = {
  TITRE:      { border: '#4B5563', bg: '#111111', label: '#9CA3AF' },
  MINIATURE:  { border: '#7C3AED', bg: '#1A0D2E', label: '#A78BFA' },
  HOOK:       { border: '#DC2626', bg: '#1F0A0A', label: '#F87171' },
  INTRO:      { border: '#2563EB', bg: '#0A0F1F', label: '#60A5FA' },
  CORPS:      { border: '#16A34A', bg: '#0A1A0F', label: '#4ADE80' },
  'RE-HOOK':  { border: '#EA580C', bg: '#1A0E05', label: '#FB923C' },
  CONCLUSION: { border: '#4338CA', bg: '#0D0B1F', label: '#818CF8' },
  NOTES:      { border: '#374151', bg: '#0F0F0F', label: '#6B7280' },
};

function getSectionKey(label: string): string {
  const upper = label.toUpperCase();
  if (upper.startsWith('NOTES') || upper.startsWith('SCORE')) return 'NOTES';
  for (const key of Object.keys(SECTION_HEX)) {
    if (upper.startsWith(key)) return key;
  }
  return 'TITRE';
}

function parseSections(text: string): Section[] {
  const lines = text.split('\n');
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    const match = line.match(/^\[(.+?)\]/);
    if (match) {
      if (current) sections.push(current);
      current = { label: match[1], content: '' };
    } else if (current) {
      current.content += line + '\n';
    }
  }
  if (current) sections.push(current);
  return sections;
}

interface Segment {
  type: 'text' | 'ajout' | 'condense';
  value: string;
}

function parseSegments(content: string): Segment[] {
  const pattern = /<(ajout|condensé)>([\s\S]*?)<\/\1>/gi;
  const matches = [...content.matchAll(pattern)];

  if (matches.length === 0) return [{ type: 'text', value: content }];

  const segments: Segment[] = [];
  let last = 0;
  for (const m of matches) {
    if (m.index! > last) segments.push({ type: 'text', value: content.slice(last, m.index) });
    segments.push({ type: m[1].toLowerCase() === 'ajout' ? 'ajout' : 'condense', value: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < content.length) segments.push({ type: 'text', value: content.slice(last) });
  return segments;
}

function renderSegments(content: string) {
  const segments = parseSegments(content.trim());
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'ajout') {
          return (
            <span key={i} className="rounded px-0.5" style={{ backgroundColor: '#0D2235', color: '#93C5FD' }} title="Ajouté par l'agent">
              {seg.value}
              <span className="text-[10px] ml-1 align-super" style={{ color: '#60A5FA' }}>[+]</span>
            </span>
          );
        }
        if (seg.type === 'condense') {
          return (
            <span key={i} className="rounded px-0.5" style={{ backgroundColor: '#2A1500', color: '#FCD34D' }} title="Condensé">
              {seg.value}
              <span className="text-[10px] ml-1 align-super" style={{ color: '#F97316' }}>[~]</span>
            </span>
          );
        }
        return <span key={i} className="whitespace-pre-wrap">{seg.value}</span>;
      })}
    </>
  );
}

interface Props {
  text: string;
}

export function ScriptPreview({ text }: Props) {
  const sections = parseSections(text);

  if (sections.length === 0) {
    return (
      <p className="text-sm text-[#6B6560] bg-[#111111] px-4 py-3 rounded border border-[#1E1E1E]">
        {text.trim()}
      </p>
    );
  }

  return (
    <div className="space-y-3" style={{ fontFamily: 'Georgia, serif' }}>
      {sections.map((section, i) => {
        const key = getSectionKey(section.label);
        const colors = SECTION_HEX[key];
        const isNotes = key === 'NOTES';
        return (
          <div key={i}>
            {isNotes && (
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t border-dashed border-[#2A2A2A]" />
                <span className="text-xs text-[#3A3A3A] uppercase tracking-widest font-sans">Notes créateur</span>
                <div className="flex-1 border-t border-dashed border-[#2A2A2A]" />
              </div>
            )}
            <div
              className={`rounded-r border-l-[3px] p-4 ${isNotes ? 'opacity-70' : ''}`}
              style={{ borderLeftColor: colors.border, backgroundColor: colors.bg }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2 font-sans" style={{ color: colors.label }}>
                {section.label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: isNotes ? '#6B7280' : '#C4BFB7' }}>
                {renderSegments(section.content)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
