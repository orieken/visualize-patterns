import { describe, it, expect } from 'vitest';
import { Document } from './State';

describe('State Pattern (Reference)', () => {
  it('should change behavior on state change', () => {
    const doc = new Document();
    expect(doc.render()).toBe('Draft Mode');
    
    doc.publish();
    expect(doc.render()).toBe('Published Mode');
  });
});
