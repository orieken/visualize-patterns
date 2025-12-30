import { describe, it, expect } from 'vitest';
import { ProxyInternet } from './ProxyChallenge';

describe('Proxy Challenge', () => {
  it('should block banned sites', () => {
    const internet = new ProxyInternet();
    
    expect(internet.connectTo('google.com')).toBe('Connecting to google.com');
    expect(internet.connectTo('banned.com')).toBe('Access Denied');
  });
});
