import { describe, it, expect } from 'vitest';
import {
  allItems,
  dsaAlgorithms,
  designPatterns,
  mlAlgorithms,
  pendingVisualizations,
  visualizedItems
} from '../../src/assets/data/catalog';
import type { CatalogItem } from '../../src/types/catalog';

const hasIdea = (item: CatalogItem): boolean => Boolean(item.idea || item.intent);

describe('catalog datasets', () => {
  it('lists at least ten DS&A entries with complexity annotations', () => {
    expect(dsaAlgorithms.length).toBeGreaterThanOrEqual(10);
    expect(dsaAlgorithms.every(item => item.complexity && hasIdea(item))).toBe(true);
  });

  it('covers the full Gang of Four set', () => {
    const expectedCount = 23;
    expect(designPatterns).toHaveLength(expectedCount);
    expect(designPatterns.every(item => item.name && item.intent)).toBe(true);
  });

  it('includes core ML/AI exemplars with type and intuition', () => {
    expect(mlAlgorithms.length).toBeGreaterThanOrEqual(10);
    expect(mlAlgorithms.every(item => item.type && hasIdea(item))).toBe(true);
  });

  it('adds slugs and domains for routing every card', () => {
    const slugs = new Set(allItems.map(item => item.slug));
    expect(slugs.size).toBe(allItems.length);
    expect(allItems.every(item => item.domain)).toBe(true);
  });

  it('tracks visualization coverage for the checklist', () => {
    expect(visualizedItems.length).toBeGreaterThan(0);
    expect(visualizedItems.length + pendingVisualizations.length).toBe(allItems.length);
  });
});
