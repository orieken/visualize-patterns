import { describe, it, expect } from 'vitest';
import { dsaAlgorithms, designPatterns, mlAlgorithms } from '../../src/assets/data/catalog';

const hasIdea = item => Boolean(item.idea || item.intent);

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
});
