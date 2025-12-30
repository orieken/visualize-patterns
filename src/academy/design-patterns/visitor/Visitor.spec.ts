import { describe, it, expect } from 'vitest';
import { Dot, Circle, XMLExportVisitor } from './Visitor';

describe('Visitor Pattern (Reference)', () => {
  it('should export shapes', () => {
    const dot = new Dot();
    const circle = new Circle();
    const exporter = new XMLExportVisitor();
    
    expect(dot.accept(exporter)).toBe('<dot>');
    expect(circle.accept(exporter)).toBe('<circle>');
  });
});
