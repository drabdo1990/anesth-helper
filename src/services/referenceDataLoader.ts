import referenceMarkdown from '../constants/anesthesia_reference_data.md?raw';

export interface ReferenceSubsection {
  id: string;
  title: string;
  content: string;
}

export interface ReferenceSection {
  id: string;
  title: string;
  level: number;
  content: string;
  subsections: ReferenceSubsection[];
}

/**
 * Returns the raw markdown string of the anesthesia clinical reference guide.
 */
export function getReferenceDocumentation(): string {
  return referenceMarkdown;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseSubsections(sectionContent: string): ReferenceSubsection[] {
  const subsections: ReferenceSubsection[] = [];
  const lines = sectionContent.split('\n');

  let currentSubTitle = '';
  let currentSubLines: string[] = [];

  const flushSub = () => {
    if (currentSubTitle) {
      const cleanTitle = currentSubTitle.replace(/^###\s+/, '').trim();
      subsections.push({
        id: slugify(cleanTitle),
        title: cleanTitle,
        content: currentSubLines.join('\n').trim(),
      });
    }
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      flushSub();
      currentSubTitle = line;
      currentSubLines = [];
    } else if (currentSubTitle) {
      currentSubLines.push(line);
    }
  }

  flushSub();
  return subsections;
}

let cachedSections: ReferenceSection[] | null = null;

/**
 * Parses the reference markdown into structured major sections based on H2 headers (`## `).
 */
export function getParsedReferenceSections(): ReferenceSection[] {
  if (cachedSections) {
    return cachedSections;
  }

  const sections: ReferenceSection[] = [];
  const lines = referenceMarkdown.split('\n');

  let currentTitle = '';
  let currentContentLines: string[] = [];

  const flushCurrent = () => {
    if (currentTitle) {
      const cleanTitle = currentTitle.replace(/^##\s+/, '').trim();
      const content = currentContentLines.join('\n').trim();
      const subsections = parseSubsections(content);

      sections.push({
        id: slugify(cleanTitle),
        title: cleanTitle,
        level: 2,
        content,
        subsections,
      });
    }
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushCurrent();
      currentTitle = line;
      currentContentLines = [];
    } else {
      currentContentLines.push(line);
    }
  }

  flushCurrent();
  cachedSections = sections;
  return sections;
}

/**
 * Filters parsed reference sections by keyword (case-insensitive) against title or content.
 */
export function searchReferenceSections(
  query: string,
  sections: ReferenceSection[] = getParsedReferenceSections(),
): ReferenceSection[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return sections;
  }

  return sections.filter((section) => {
    return (
      section.title.toLowerCase().includes(q) ||
      section.content.toLowerCase().includes(q)
    );
  });
}
