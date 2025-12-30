export interface RouteStrategy {
  calculateRoute(a: string, b: string): string;
}

export class RoadStrategy implements RouteStrategy {
  calculateRoute(a: string, b: string) { return `Road from ${a} to ${b}`; }
}

export class WalkingStrategy implements RouteStrategy {
  calculateRoute(a: string, b: string) { return `Walk from ${a} to ${b}`; }
}

export class PublicTransportStrategy implements RouteStrategy {
  calculateRoute(a: string, b: string) { return `Bus from ${a} to ${b}`; }
}

export class Navigator {
  constructor(private strategy: RouteStrategy) {}

  setStrategy(s: RouteStrategy) { this.strategy = s; }

  buildRoute(a: string, b: string) {
    return this.strategy.calculateRoute(a, b);
  }
}
