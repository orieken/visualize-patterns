import { describe, it, expect } from 'vitest';
import { CarBuilderImpl } from './BuilderChallenge';

describe('Builder Challenge', () => {
  it('should build a sports car', () => {
    const builder = new CarBuilderImpl();
    const car = builder
      .setSeats(2)
      .setEngine('V8')
      .setGPS(true)
      .getResult();
      
    // Expected: Car with 2 seats, V8, GPS: true
    expect(car.seats).toBe(2);
    expect(car.engine).toBe('V8');
    expect(car.gps).toBe(true);
  });
});
