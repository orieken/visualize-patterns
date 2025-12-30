export class Car {
  public seats: number = 0;
  public engine: string = '';
  public gps: boolean = false;
  
  describe(): string {
    return `Car with ${this.seats} seats, ${this.engine}, GPS: ${this.gps}`;
  }
}

export interface CarBuilder {
  setSeats(number: number): this;
  setEngine(engine: string): this;
  setGPS(hasGPS: boolean): this;
  getResult(): Car;
}

/**
 * CHALLENGE: Implement the CarBuilderImpl class.
 */
export class CarBuilderImpl implements CarBuilder {
  private car: Car;
  
  constructor() {
    this.car = new Car();
  }
  
  reset() {
    this.car = new Car();
  }

  setSeats(number: number): this {
    // TODO: set seats
    return this;
  }

  setEngine(engine: string): this {
    // TODO: set engine
    return this;
  }

  setGPS(hasGPS: boolean): this {
    // TODO: set gps
    return this;
  }

  getResult(): Car {
    const result = this.car;
    this.reset();
    return result;
  }
}
