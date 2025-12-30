import { describe, it, expect } from 'vitest';
import { Level1Support, Level2Support, ManagerSupport } from './ChainOfResponsibilityChallenge';

describe('Chain of Responsibility Challenge', () => {
  it('should escalate tickets correctly', () => {
    const l1 = new Level1Support();
    const l2 = new Level2Support();
    const manager = new ManagerSupport();
    
    l1.setNext(l2).setNext(manager);
    
    expect(l1.handleRequest('basic')).toBe('Level 1 handled');
    expect(l1.handleRequest('advanced')).toBe('Level 2 handled');
    expect(l1.handleRequest('critical')).toBe('Manager handled');
  });
});
