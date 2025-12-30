import { describe, it, expect } from 'vitest';
import { ConcreteBuilder1, Director } from './Builder';

describe('Builder Pattern (Reference)', () => {
  it('should build a minimal product', () => {
    const builder = new ConcreteBuilder1();
    const director = new Director(builder);
    
    director.buildMinimalViableProduct();
    const product = builder.getProduct();
    
    expect(product.listParts()).toBe('Product parts: PartA1');
  });

  it('should build a full product', () => {
    const builder = new ConcreteBuilder1();
    const director = new Director(builder);
    
    director.buildFullFeaturedProduct();
    const product = builder.getProduct();
    
    expect(product.listParts()).toBe('Product parts: PartA1, PartB1, PartC1');
  });
});
