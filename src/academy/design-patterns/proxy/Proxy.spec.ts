import { describe, it, expect } from 'vitest';
import { RealSubject, ProxySubject } from './Proxy';

describe('Proxy Pattern (Reference)', () => {
  it('should control access', () => {
    const real = new RealSubject();
    const proxy = new ProxySubject(real);
    
    expect(proxy.request()).toContain('Proxy: RealSubject: Handling request.');
  });
});
