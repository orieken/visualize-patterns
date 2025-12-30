export interface Prototype {
  clone(): Prototype;
}

export class Sheep implements Prototype {
  constructor(public name: string, public category: string) {}

  clone(): Sheep {
    // TODO: Implement clone
    // return new Sheep(this.name, this.category);
    // Be careful about shallow vs deep copies if you add complex props!
    return this; // <-- FIX THIS (Returning 'this' is NOT a clone!)
  }
}
