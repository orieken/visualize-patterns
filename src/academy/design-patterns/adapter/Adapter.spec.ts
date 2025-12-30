import { describe, it, expect } from 'vitest';
import { Adapter, Adaptee } from './Adapter';

describe('Adapter Pattern (Reference)', () => {
  it('should adapt the specific interface', () => {
    const adaptee = new Adaptee();
    const adapter = new Adapter(adaptee);
    expect(adapter.request()).toContain('Special behavior of the Adaptee');
  });
});
