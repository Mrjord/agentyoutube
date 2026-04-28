import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';

interface Section {
  label: string;
  content: string;
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

const SECTION_COLORS: Record<string, string> = {
  TITRE: '6B7280',
  MINIATURE: '7C3AED',
  HOOK: 'DC2626',
  INTRO: '2563EB',
  CORPS: '16A34A',
  'RE-HOOK': 'EA580C',
  CONCLUSION: '4338CA',
  SCORE: 'D97706',
};

function getSectionColor(label: string): string {
  const upper = label.toUpperCase();
  for (const [key, color] of Object.entries(SECTION_COLORS)) {
    if (upper.startsWith(key)) return color;
  }
  return '374151';
}

export async function generateDocxBlob(text: string, theme: string): Promise<Blob> {
  const sections = parseSections(text);

  const children: Paragraph[] = [
    new Paragraph({
      text: theme,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
  ];

  for (const section of sections) {
    const color = getSectionColor(section.label);

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `[ ${section.label.toUpperCase()} ]`,
            bold: true,
            color,
            size: 20,
          }),
        ],
        spacing: { before: 300, after: 100 },
        border: {
          left: { style: BorderStyle.THICK, size: 6, color, space: 8 },
        },
      }),
    );

    const lines = section.content.trim().split('\n');
    for (const line of lines) {
      if (line.trim() === '') {
        children.push(new Paragraph({ text: '', spacing: { after: 60 } }));
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 22,
                font: 'Georgia',
              }),
            ],
            spacing: { after: 80 },
            indent: { left: 200 },
          }),
        );
      }
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return Packer.toBlob(doc);
}
