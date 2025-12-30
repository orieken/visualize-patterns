import { describe, it, expect } from 'vitest';
import { Navigator, RoadStrategy, WalkingStrategy } from './Strategy';

describe('Strategy Pattern (Reference)', () => {
  it('should swap strategies', () => {
    const nav = new Navigator(new RoadStrategy());
    expect(nav.buildRoute('A', 'B')).toContain('Road');
    
    nav.setStrategy(new WalkingStrategy());
    expect(nav.buildRoute('A', 'B')).toContain('Walk');
  });
});
