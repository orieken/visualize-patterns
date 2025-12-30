import { describe, it, expect } from 'vitest';
import { Light, TurnOnCommand, Remote } from './Command';

describe('Command Pattern (Reference)', () => {
  it('should execute commands', () => {
    const light = new Light();
    const cmd = new TurnOnCommand(light);
    const remote = new Remote();
    
    remote.setCommand(cmd);
    remote.pressButton();
    
    expect(light.isOn()).toBe(true);
  });
});
