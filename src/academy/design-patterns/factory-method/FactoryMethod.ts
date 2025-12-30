export interface Transport {
  deliver(): string;
}

export class Truck implements Transport {
  deliver(): string {
    return "Delivering by land in a box";
  }
}

export class Ship implements Transport {
  deliver(): string {
    return "Delivering by sea in a container";
  }
}

export abstract class Logistics {
  // The Factory Method
  abstract createTransport(): Transport;

  public planDelivery(): string {
    const transport = this.createTransport();
    return `Logistics: ${transport.deliver()}`;
  }
}

export class RoadLogistics extends Logistics {
  createTransport(): Transport {
    return new Truck();
  }
}

export class SeaLogistics extends Logistics {
  createTransport(): Transport {
    return new Ship();
  }
}
