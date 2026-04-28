import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Footer,
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
  NOTES: '9CA3AF',
};

function getSectionColor(label: string): string {
  const upper = label.toUpperCase();
  if (upper.startsWith('NOTES') || upper.startsWith('SCORE')) return SECTION_COLORS.NOTES;
  for (const [key, color] of Object.entries(SECTION_COLORS)) {
    if (upper.startsWith(key)) return color;
  }
  return '374151';
}

function stripMarkers(text: string): string {
  return text
    .replace(/<ajout>([\s\S]*?)<\/ajout>/gi, '$1')
    .replace(/<condensé>([\s\S]*?)<\/condensé>/gi, '$1');
}

export async function generateDocxBlob(text: string, theme: string): Promise<Blob> {
  const sections = parseSections(text);
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const children: Paragraph[] = [
    new Paragraph({
      text: theme,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
  ];

  let notesStarted = false;

  for (const section of sections) {
    const color = getSectionColor(section.label);
    const isNotes = section.label.toUpperCase().startsWith('NOTES') || section.label.toUpperCase().startsWith('SCORE');

    if (isNotes && !notesStarted) {
      notesStarted = true;
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '─'.repeat(60), color: 'D1D5DB', size: 16 })],
          spacing: { before: 600, after: 200 },
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: 'NOTES POUR LE CRÉATEUR', bold: true, color: '9CA3AF', size: 18 })],
          spacing: { after: 200 },
          alignment: AlignmentType.CENTER,
        }),
      );
    }

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `[ ${section.label.toUpperCase()} ]`,
            bold: true,
            color,
            size: isNotes ? 18 : 20,
          }),
        ],
        spacing: { before: 300, after: 100 },
        border: {
          left: { style: BorderStyle.THICK, size: 6, color, space: 8 },
        },
      }),
    );

    const lines = stripMarkers(section.content.trim()).split('\n');
    for (const line of lines) {
      if (line.trim() === '') {
        children.push(new Paragraph({ text: '', spacing: { after: 60 } }));
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: isNotes ? 18 : 22,
                font: 'Georgia',
                color: isNotes ? '6B7280' : '1F2937',
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
    sections: [
      {
        children,
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Script généré par YUBOT — ${date}`,
                    size: 16,
                    color: '9CA3AF',
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
      },
    ],
  });

  return Packer.toBlob(doc);
}
