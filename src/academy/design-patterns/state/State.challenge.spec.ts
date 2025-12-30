import { describe, it, expect } from 'vitest';
import { TrafficLight } from './StateChallenge';

describe('State Challenge', () => {
  it('should cycle Red -> Green -> Yellow', () => {
    const light = new TrafficLight(); // Initial: Red
    expect(light.getColor()).toBe('Red');
    
    light.change();
    expect(light.getColor()).toBe('Green');
    
    light.change();
    expect(light.getColor()).toBe('Yellow');
    
    light.change();
    expect(light.getColor()).toBe('Red');
  });
});
