export interface ControlTower {
  requestLanding(airplane: Airplane): boolean;
}

export class Airplane {
  constructor(public id: string, private tower: ControlTower) {}

  requestToLand(): boolean {
    return this.tower.requestLanding(this);
  }
}

/**
 * CHALLENGE: Implement AirportTower.
 * - Only allow one plane to land at a time.
 * - If a plane is landing, reject others.
 */
export class AirportTower implements ControlTower {
  private runwayBusy = false;

  requestLanding(airplane: Airplane): boolean {
    // TODO: logic
    return true; // <-- FIX THIS (Always returning true is dangerous!)
  }
  
  // Maybe add method to clear runway?
}
