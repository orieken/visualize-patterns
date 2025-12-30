import { describe, it, expect } from 'vitest';
import { ComputerFacade } from './Facade';

describe('Facade Pattern (Reference)', () => {
  it('should simplify subsystem interaction', () => {
    const computer = new ComputerFacade();
    const result = computer.startComputer();
    
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('Loading RAM...');
    expect(result[1]).toBe('Reading Disk...');
  });
});
