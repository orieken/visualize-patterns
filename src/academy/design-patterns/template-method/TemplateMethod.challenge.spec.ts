import { describe, it, expect } from 'vitest';
import { Tea, Coffee } from './TemplateMethodChallenge';

describe('Template Method Challenge', () => {
  it('should prepare beverages', () => {
    const tea = new Tea();
    const steps = tea.prepareRecipe();
    
    expect(steps).toContain('Boiling water');
    expect(steps).toContain('Steep tea bag'); // Expected impl
    expect(steps).toContain('Add lemon');
  });
});
