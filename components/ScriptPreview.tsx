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
};

function getSectionKey(label: string): string {
  const upper = label.toUpperCase();
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

interface Props {
  text: string;
}

export function ScriptPreview({ text }: Props) {
  const sections = parseSections(text);

  if (sections.length === 0) {
    return (
      <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">
        {text}
      </pre>
    );
  }

  return (
    <div className="space-y-4 font-[Georgia,serif]">
      {sections.map((section, i) => {
        const key = getSectionKey(section.label);
        const borderBg = SECTION_COLORS[key];
        const labelColor = LABEL_COLORS[key];
        return (
          <div key={i} className={`border-l-4 rounded-r-lg p-4 ${borderBg}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${labelColor}`}>
              {section.label}
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
              {section.content.trim()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
