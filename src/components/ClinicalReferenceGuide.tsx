import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';
import {
  getParsedReferenceSections,
  getReferenceDocumentation,
  searchReferenceSections,
  type ReferenceSection,
  type ReferenceSubsection,
} from '../services/referenceDataLoader';

// Helper to render inline markdown: bold, code, math ($...$), and citations ([cite: ...])
const formatInline = (text: string): React.ReactNode => {
  // Regex to match **bold**, `code`, $math$, and [cite: ...]
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$.*?\$|\[cite:\s*[\d,\s]+\])/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-slate-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-xs text-cyan-300 border border-slate-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return (
        <span
          key={index}
          className="inline-block rounded bg-cyan-950/40 px-1 py-0.5 font-mono text-xs text-cyan-200 border border-cyan-800/50"
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith('[cite:') && part.endsWith(']')) {
      const citeContent = part.replace(/^\[cite:\s*/, '').replace(/\]$/, '');
      return (
        <span
          key={index}
          className="ml-1 inline-flex items-center rounded border border-slate-700/60 bg-slate-800/80 px-1 py-0.2 text-[10px] font-mono text-slate-400"
          title={`Clinical Reference Citation ${citeContent}`}
        >
          Ref {citeContent}
        </span>
      );
    }
    return part;
  });
};

// Formats a block of markdown lines (lists, tables, blockquotes, subheadings)
const FormattedBlock: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <div
          key={`quote-${i}`}
          className="my-2 rounded-r-lg border-l-4 border-cyan-500 bg-cyan-950/20 px-3 py-2 text-xs text-slate-300"
        >
          {formatInline(quoteText)}
        </div>,
      );
      i++;
      continue;
    }

    // Math block ($$...$$)
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
      const math = trimmed.slice(2, -2);
      elements.push(
        <div
          key={`math-${i}`}
          className="my-2 overflow-x-auto rounded-lg border border-cyan-900/60 bg-slate-950/80 p-2.5 font-mono text-xs text-cyan-200"
        >
          {math}
        </div>,
      );
      i++;
      continue;
    }

    // Table detection: line starts with |
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        // tableLines[1] is the delimiter row | :--- | :--- |
        const bodyRows = tableLines.slice(2).map((r) =>
          r
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim()),
        );

        elements.push(
          <div
            key={`table-${i}`}
            className="my-3 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950"
          >
            <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
              <thead className="bg-slate-900/90">
                <tr>
                  {headerRow.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-300"
                    >
                      {formatInline(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={rIdx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/40'}
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="whitespace-nowrap px-3 py-2 text-slate-300"
                      >
                        {formatInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        continue;
      }
    }

    // Sub-subheading (####)
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h5
          key={`h4-${i}`}
          className="mt-3 mb-1 text-xs font-bold uppercase tracking-wide text-cyan-400"
        >
          {trimmed.replace(/^####\s+/, '')}
        </h5>,
      );
      i++;
      continue;
    }

    // Bullet items (* or -)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const isIndented = line.startsWith('  ') || line.startsWith('\t');
      const text = trimmed.replace(/^[*|-]\s+/, '');
      elements.push(
        <div
          key={`bullet-${i}`}
          className={`flex items-start gap-2 py-1 text-xs text-slate-300 leading-relaxed ${
            isIndented ? 'ml-4' : 'ml-1'
          }`}
        >
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/80" />
          <div className="flex-1">{formatInline(text)}</div>
        </div>,
      );
      i++;
      continue;
    }

    // Standard paragraph line
    elements.push(
      <p key={`p-${i}`} className="py-1 text-xs text-slate-300 leading-relaxed">
        {formatInline(trimmed)}
      </p>,
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
};

// Single Subsection Card
const SubsectionCard: React.FC<{ subsection: ReferenceSubsection }> = ({ subsection }) => {
  const [copied, setCopied] = useState(false);

  const copySubsection = () => {
    navigator.clipboard.writeText(`### ${subsection.title}\n\n${subsection.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-slate-800/90 bg-slate-950/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2 border-b border-slate-800/60 pb-1.5">
        <h4 className="text-xs font-bold text-slate-200 tracking-wide">
          {subsection.title}
        </h4>
        <button
          type="button"
          onClick={copySubsection}
          aria-label={`Copy ${subsection.title}`}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-400 hover:text-cyan-300"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <FormattedBlock content={subsection.content} />
    </div>
  );
};

// Section Accordion Component
const SectionCard: React.FC<{
  section: ReferenceSection;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ section, isExpanded, onToggle }) => {
  const [copied, setCopied] = useState(false);

  const copySection = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`## ${section.title}\n\n${section.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm transition-colors">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={isExpanded}
        className="flex min-h-[52px] w-full items-center justify-between gap-2 p-3 text-left touch-manipulation cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-950 font-mono text-[11px] font-bold text-cyan-300 border border-cyan-800/50">
            {section.title.split('.')[0] || '#'}
          </span>
          <span className="truncate text-sm font-bold text-slate-100">
            {section.title}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={copySection}
            aria-label={`Copy section ${section.title}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-cyan-300"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-300">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-3 border-t border-slate-800 p-3 pt-2">
          {section.subsections && section.subsections.length > 0 ? (
            section.subsections.map((sub) => (
              <SubsectionCard key={sub.id} subsection={sub} />
            ))
          ) : (
            <FormattedBlock content={section.content} />
          )}
        </div>
      )}
    </div>
  );
};

export const ClinicalReferenceGuide: React.FC = () => {
  const allSections = useMemo(() => getParsedReferenceSections(), []);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    // Default: expand all sections for immediate readability
    const initial: Record<string, boolean> = {};
    for (const s of allSections) {
      initial[s.id] = true;
    }
    return initial;
  });
  const [copiedAll, setCopiedAll] = useState(false);

  const filteredSections = useMemo(() => {
    let result = allSections;
    if (selectedCategory !== 'all') {
      result = result.filter((s) => s.id.includes(selectedCategory));
    }
    if (query.trim()) {
      result = searchReferenceSections(query, result);
    }
    return result;
  }, [allSections, query, selectedCategory]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const updated: Record<string, boolean> = {};
    for (const s of allSections) {
      updated[s.id] = true;
    }
    setExpandedSections(updated);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const copyFullGuide = () => {
    navigator.clipboard.writeText(getReferenceDocumentation());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Benchmarks' },
    { id: 'biometric', label: '1. Biometrics & Obesity' },
    { id: 'pharmacopeia', label: '2. Pharmacopeia & Dosing' },
    { id: 'airway', label: '3. Airway Sizing' },
    { id: 'ventilation', label: '4. Mechanical Vent' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search drugs, formulas, ETT sizes, PEEP, Intralipid..."
          className="min-h-[44px] w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-9 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search query"
            className="absolute right-2.5 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Pills & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors touch-manipulation ${
                selectedCategory === cat.id
                  ? 'border border-cyan-500 bg-cyan-950/80 text-cyan-200'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <button
            type="button"
            onClick={expandAll}
            className="rounded px-1.5 py-0.5 hover:text-slate-200"
          >
            Expand
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded px-1.5 py-0.5 hover:text-slate-200"
          >
            Collapse
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={copyFullGuide}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:text-cyan-300"
          >
            {copiedAll ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sections List */}
      {filteredSections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
          <BookOpen className="mb-2 h-8 w-8 text-slate-600" />
          <p className="font-semibold text-slate-300">No clinical reference matches found</p>
          <p className="mt-1 text-slate-500">
            No sections match &quot;{query}&quot;. Try searching for an agent name or equipment type.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-cyan-300"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredSections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isExpanded={!!expandedSections[section.id]}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
