import { describe, it, expect } from 'vitest';
import { SensorAdapter } from './AdapterChallenge';

describe('Adapter Challenge', () => {
  it('should convert F to C', () => {
    const adapter = new SensorAdapter();
    // 100 F -> ~37.77 C
    const temp = adapter.getTemperatureInCelsius();
    expect(temp).toBeCloseTo(37.77, 1);
  });
});
