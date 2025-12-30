export interface Renderer {
  renderCircle(radius: number): string;
}

export class VectorRenderer implements Renderer {
  renderCircle(radius: number): string {
    return `Drawing a circle of radius ${radius} lines`;
  }
}

export class RasterRenderer implements Renderer {
  renderCircle(radius: number): string {
    return `Drawing pixels for circle of radius ${radius}`;
  }
}

/**
 * CHALLENGE: Implement the Shape abstraction connecting to Renderer.
 */
export abstract class Shape {
  protected renderer: Renderer;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  abstract draw(): string;
  abstract resize(factor: number): void;
}

export class Circle extends Shape {
  // TODO: Add radius property
  
  constructor(renderer: Renderer, radius: number) {
    super(renderer);
    // TODO: set radius
  }

  draw(): string {
    // TODO: Delegate to renderer
    return ""; // <-- FIX THIS
  }

  resize(factor: number): void {
    // TODO: Update radius
  }
}
