import { describe, expect, it } from 'vitest';
import {
  getReferenceDocumentation,
  getParsedReferenceSections,
  searchReferenceSections,
} from '../referenceDataLoader';

describe('referenceDataLoader', () => {
  describe('getReferenceDocumentation', () => {
    it('returns the raw reference markdown documentation as a non-empty string', () => {
      const doc = getReferenceDocumentation();
      expect(typeof doc).toBe('string');
      expect(doc.length).toBeGreaterThan(500);
      expect(doc).toContain('Perioperative Anesthesia Reference Parameters & Clinical Benchmarks');
    });

    it('contains core clinical benchmark sections', () => {
      const doc = getReferenceDocumentation();
      expect(doc).toContain('Biometric Scaling Rules & Obesity Adjustments');
      expect(doc).toContain('Perioperative Pharmacopeia & Dosing Parameters');
      expect(doc).toContain('Airway Sizing & Equipment Benchmarks');
      expect(doc).toContain('Mechanical Ventilation & Respiratory Mechanics Benchmarks');
    });
  });

  describe('getParsedReferenceSections', () => {
    it('parses markdown into structured major sections with subsections', () => {
      const sections = getParsedReferenceSections();
      expect(sections.length).toBeGreaterThanOrEqual(4);

      const titles = sections.map((s) => s.title);
      expect(titles.some((t) => t.includes('Biometric Scaling'))).toBe(true);
      expect(titles.some((t) => t.includes('Perioperative Pharmacopeia'))).toBe(true);
      expect(titles.some((t) => t.includes('Airway Sizing'))).toBe(true);
      expect(titles.some((t) => t.includes('Mechanical Ventilation'))).toBe(true);

      for (const section of sections) {
        expect(section.id).toBeDefined();
        expect(section.title.length).toBeGreaterThan(0);
        expect(section.content.length).toBeGreaterThan(0);
        expect(Array.isArray(section.subsections)).toBe(true);
      }

      const pharma = sections.find((s) => s.title.includes('Pharmacopeia'));
      expect(pharma).toBeDefined();
      expect(pharma?.subsections.length).toBeGreaterThanOrEqual(5);
      expect(pharma?.subsections.some((sub) => sub.title.includes('Premedication'))).toBe(true);
      expect(pharma?.subsections.some((sub) => sub.title.includes('Local Anesthetics'))).toBe(true);
    });
  });

  describe('searchReferenceSections', () => {
    it('returns all sections when query is empty or whitespace', () => {
      const all = getParsedReferenceSections();
      expect(searchReferenceSections('')).toHaveLength(all.length);
      expect(searchReferenceSections('   ')).toHaveLength(all.length);
    });

    it('finds sections containing specific clinical keywords', () => {
      const lidoResults = searchReferenceSections('Lidocaine');
      expect(lidoResults.length).toBeGreaterThan(0);
      expect(lidoResults.some((s) => s.title.includes('Pharmacopeia'))).toBe(true);

      const ettResults = searchReferenceSections('ETT');
      expect(ettResults.length).toBeGreaterThan(0);
      expect(ettResults.some((s) => s.title.includes('Airway'))).toBe(true);

      const peepResults = searchReferenceSections('PEEP');
      expect(peepResults.length).toBeGreaterThan(0);
      expect(peepResults.some((s) => s.title.includes('Ventilation'))).toBe(true);
    });

    it('returns empty array when query matches nothing', () => {
      const noResults = searchReferenceSections('xyznonexistentterm999');
      expect(noResults).toHaveLength(0);
    });
  });
});
