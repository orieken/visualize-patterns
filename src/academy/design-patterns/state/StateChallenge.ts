export interface LightState {
  next(light: TrafficLight): void;
  getColor(): string;
}

/**
 * CHALLENGE: Implement Red, Green, Yellow states.
 * Cycle: Red -> Green -> Yellow -> Red
 */
export class TrafficLight {
  private state: LightState; // = new RedState();

  constructor() {
    // TODO: Init state
    this.state = null as any; // <-- FIX THIS
  }

  setState(s: LightState) {
    this.state = s;
  }

  change() {
    this.state.next(this);
  }

  getColor() {
    return this.state.getColor();
  }
}
