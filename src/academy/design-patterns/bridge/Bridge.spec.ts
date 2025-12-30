import { describe, it, expect } from 'vitest';
import { RemoteControl, TV, Radio } from './Bridge';

describe('Bridge Pattern (Reference)', () => {
  it('should work with different implementations', () => {
    const tv = new TV();
    const remote = new RemoteControl(tv);
    
    remote.togglePower();
    expect(tv.isEnabled()).toBe(true);
    
    remote.volumeUp();
    expect(tv.getVolume()).toBe(60);
  });
});
