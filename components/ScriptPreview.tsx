'use client';

interface Section {
  label: string;
  content: string;
}

const SECTION_COLORS: Record<string, string> = {
  TITRE: 'border-gray-400 bg-gray-50',
  MINIATURE: 'border-purple-400 bg-purple-50',
  HOOK: 'border-red-500 bg-red-50',
  INTRO: 'border-blue-500 bg-blue-50',
  CORPS: 'border-green-500 bg-green-50',
  'RE-HOOK': 'border-orange-500 bg-orange-50',
  CONCLUSION: 'border-indigo-500 bg-indigo-50',
  SCORE: 'border-amber-500 bg-amber-50',
  NOTES: 'border-gray-300 bg-gray-50',
};

const LABEL_COLORS: Record<string, string> = {
  TITRE: 'text-gray-700',
  MINIATURE: 'text-purple-700',
  HOOK: 'text-red-700',
  INTRO: 'text-blue-700',
  CORPS: 'text-green-700',
  'RE-HOOK': 'text-orange-700',
  CONCLUSION: 'text-indigo-700',
  SCORE: 'text-amber-700',
  NOTES: 'text-gray-500',
};

function getSectionKey(label: string): string {
  const upper = label.toUpperCase();
  if (upper.startsWith('NOTES')) return 'NOTES';
  if (upper.startsWith('SCORE')) return 'NOTES';
  for (const key of Object.keys(SECTION_COLORS)) {
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
  const segments: Segment[] = [];
  const pattern = /<(ajout|condensé)>([\s\S]*?)<\/\1>/gi;
  const matches = [...content.matchAll(pattern)];

  if (matches.length === 0) {
    return [{ type: 'text', value: content }];
  }

  let last = 0;
  for (const m of matches) {
    if (m.index! > last) {
      segments.push({ type: 'text', value: content.slice(last, m.index) });
    }
    const tag = m[1].toLowerCase();
    segments.push({ type: tag === 'ajout' ? 'ajout' : 'condense', value: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < content.length) {
    segments.push({ type: 'text', value: content.slice(last) });
  }

  return segments;
}

function renderSegments(content: string) {
  const trimmed = content.trim();
  const segments = parseSegments(trimmed);

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'ajout') {
          return (
            <span key={i} className="bg-[#E8F4FD] rounded px-0.5" title="Ajouté par l'agent">
              {seg.value}
              <span className="text-[10px] text-blue-500 ml-1 align-super">[+ajout]</span>
            </span>
          );
        }
        if (seg.type === 'condense') {
          return (
            <span key={i} className="bg-[#FFF3E0] rounded px-0.5" title="Condensé">
              {seg.value}
              <span className="text-[10px] text-orange-500 ml-1 align-super">[~condensé]</span>
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
      <p className="text-sm text-muted-foreground bg-muted px-4 py-3 rounded-lg">
        {text.trim()}
      </p>
    );
  }

  return (
    <div className="space-y-4 font-[Georgia,serif]">
      {sections.map((section, i) => {
        const key = getSectionKey(section.label);
        const borderBg = SECTION_COLORS[key];
        const labelColor = LABEL_COLORS[key];
        const isNotes = key === 'NOTES';
        return (
          <div key={i}>
            {isNotes && (
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t border-dashed border-gray-300" />
                <span className="text-xs text-gray-400 uppercase tracking-widest">Notes créateur</span>
                <div className="flex-1 border-t border-dashed border-gray-300" />
              </div>
            )}
            <div className={`border-l-4 rounded-r-lg p-4 ${borderBg} ${isNotes ? 'opacity-75' : ''}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${labelColor}`}>
                {section.label}
              </p>
              <p className={`text-sm leading-relaxed ${isNotes ? 'text-gray-500' : 'text-gray-800'}`}>
                {renderSegments(section.content)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
