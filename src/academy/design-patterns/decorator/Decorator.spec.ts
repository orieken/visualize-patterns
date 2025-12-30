import { describe, it, expect } from 'vitest';
import { ConcreteComponent, ConcreteDecoratorA, ConcreteDecoratorB } from './Decorator';

describe('Decorator Pattern (Reference)', () => {
  it('should wrap components correctly', () => {
    const simple = new ConcreteComponent();
    const decoratedA = new ConcreteDecoratorA(simple);
    const decoratedB = new ConcreteDecoratorB(decoratedA);
    
    // B wraps A wraps Simple
    expect(decoratedB.operation()).toBe('ConcreteDecoratorB(ConcreteDecoratorA(ConcreteComponent))');
  });
});
