export interface WeatherObserver {
  update(temp: number): void;
}

/**
 * CHALLENGE: Implement WeatherStation.
 * It should allow observers to subscribe/unsubscribe and notify them.
 */
export class WeatherStation {
  private observers: WeatherObserver[] = [];
  private temperature = 0;

  addObserver(o: WeatherObserver) {
    // TODO
  }

  setTemperature(temp: number) {
    this.temperature = temp;
    // TODO: Notify observers
  }
}
