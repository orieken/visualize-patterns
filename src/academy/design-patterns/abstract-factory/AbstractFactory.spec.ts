import { describe, it, expect } from 'vitest';
import { ModernFactory, VictorianFactory, ModernChair, VictorianSofa } from './AbstractFactory';

describe('Abstract Factory (Reference)', () => {
  it('Modern Factory should create modern furniture', () => {
    const factory = new ModernFactory();
    const chair = factory.createChair();
    const sofa = factory.createSofa();

    expect(chair).toBeInstanceOf(ModernChair);
    expect(chair.hasLegs()).toBe(false);
    expect(sofa.lieOn()).toContain('Modern');
  });

  it('Victorian Factory should create victorian furniture', () => {
    const factory = new VictorianFactory();
    const chair = factory.createChair();
    const sofa = factory.createSofa();

    expect(sofa).toBeInstanceOf(VictorianSofa);
    expect(chair.hasLegs()).toBe(true);
  });
});
