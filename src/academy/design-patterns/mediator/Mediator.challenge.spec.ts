import { describe, it, expect } from 'vitest';
import { AirportTower, Airplane } from './MediatorChallenge';

describe('Mediator Challenge', () => {
  it('should control runway access', () => {
    const tower = new AirportTower();
    const p1 = new Airplane('747', tower);
    const p2 = new Airplane('A320', tower);
    
    expect(p1.requestToLand()).toBe(true);
    // If p1 is landing/landed and runway not cleared, p2 should fail
    expect(p2.requestToLand()).toBe(false); 
  });
});
