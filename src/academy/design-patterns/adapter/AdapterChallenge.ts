export interface TempSensor {
  getTemperatureInCelsius(): number;
}

export class FahrenheitSensor {
  getTempF(): number { return 100; }
}

/**
 * CHALLENGE: Implement an Adapter to convert Fahrenheit to Celsius.
 * Formula: (F - 32) * 5/9
 */
export class SensorAdapter implements TempSensor {
  // TODO: Add Adaptee
  
  constructor() {
    // TODO
  }

  getTemperatureInCelsius(): number {
    // TODO: Convert
    return -273; // <-- FIX THIS
  }
}
