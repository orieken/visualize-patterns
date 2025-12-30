export class TreeType {
  constructor(public name: string, public color: string, public texture: string) {}
  
  draw(canvas: any, x: number, y: number) {
    return `Drawing ${this.name} at (${x},${y})`;
  }
}

export class TreeFactory {
  static types: Record<string, TreeType> = {};
  
  static getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}-${color}-${texture}`;
    if (!this.types[key]) {
      this.types[key] = new TreeType(name, color, texture);
    }
    return this.types[key];
  }
}

export class Tree {
  constructor(public x: number, public y: number, public type: TreeType) {}
  
  draw(canvas: any) {
    return this.type.draw(canvas, this.x, this.y);
  }
}
