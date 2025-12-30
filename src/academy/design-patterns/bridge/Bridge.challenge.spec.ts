import { describe, it, expect } from 'vitest';
import { Circle, VectorRenderer } from './BridgeChallenge';

describe('Bridge Challenge', () => {
  it('should draw', () => {
    const renderer = new VectorRenderer();
    const circle = new Circle(renderer, 5);
    
    expect(circle.draw()).toContain('Drawing a circle of radius 5 lines');
    circle.resize(2);
    expect(circle.draw()).toContain('Drawing a circle of radius 10 lines');
  });
});
