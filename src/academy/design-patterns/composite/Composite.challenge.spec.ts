import { describe, it, expect } from 'vitest';
import { CompoundGraphic, Dot } from './CompositeChallenge';

describe('Composite Challenge', () => {
  it('should draw composite graphics', () => {
    const group = new CompoundGraphic();
    group.add(new Dot());
    group.add(new Dot());
    
    // Expect implementation to join children, e.g. "Dot, Dot" or just string concat
    // We'll accept simple concatenation for simplicity unless specified
    const result = group.draw();
    expect(result).toContain('Dot');
    expect(result.length).toBeGreaterThan(3);
  });
});
