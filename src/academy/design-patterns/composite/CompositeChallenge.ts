export abstract class Graphic {
  abstract draw(): string;
  add(g: Graphic): void {}
}

export class Dot extends Graphic {
  draw() { return 'Dot'; }
}

/**
 * CHALLENGE: Implement CompoundGraphic container.
 */
export class CompoundGraphic extends Graphic {
  private children: Graphic[] = [];

  add(g: Graphic) {
    // TODO: Add to children
  }

  draw(): string {
    // TODO: Combine children output
    return ""; // <-- FIX THIS
  }
}
