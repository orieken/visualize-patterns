import { describe, it, expect, vi } from 'vitest';
import { WeatherStation, WeatherObserver } from './ObserverChallenge';

describe('Observer Challenge', () => {
  it('should broadcast temperature updates', () => {
    const station = new WeatherStation();
    
    // Mock observer
    const display: WeatherObserver = {
      update: vi.fn()
    };
    
    station.addObserver(display);
    station.setTemperature(25);
    
    expect(display.update).toHaveBeenCalledWith(25);
  });
});
