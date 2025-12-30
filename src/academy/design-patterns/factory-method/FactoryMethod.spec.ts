import { describe, it, expect } from 'vitest';
import { RoadLogistics, SeaLogistics, Truck, Ship } from './FactoryMethod';

describe('Factory Method (Reference)', () => {
  it('should create separate products based on the concrete creator', () => {
    const road = new RoadLogistics();
    const sea = new SeaLogistics();

    const t1 = road.createTransport();
    const t2 = sea.createTransport();

    expect(t1).toBeInstanceOf(Truck);
    expect(t2).toBeInstanceOf(Ship);
  });

  it('should allow the base class to use the product widely', () => {
    const road = new RoadLogistics();
    expect(road.planDelivery()).toContain('Delivering by land');
  });
});
