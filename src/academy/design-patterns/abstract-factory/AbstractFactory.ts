export interface Chair {
  hasLegs(): boolean;
  sitOn(): string;
}

export interface Sofa {
  hasLegs(): boolean;
  lieOn(): string;
}

// Concrete Products: Modern
export class ModernChair implements Chair {
  hasLegs() { return false; }
  sitOn() { return "Sitting on a Modern Chair"; }
}
export class ModernSofa implements Sofa {
  hasLegs() { return false; }
  lieOn() { return "Lying on a Modern Sofa"; }
}

// Concrete Products: Victorian
export class VictorianChair implements Chair {
  hasLegs() { return true; }
  sitOn() { return "Sitting on a Victorian Chair"; }
}
export class VictorianSofa implements Sofa {
  hasLegs() { return true; }
  lieOn() { return "Lying on a Victorian Sofa"; }
}

// Abstract Factory
export interface FurnitureFactory {
  createChair(): Chair;
  createSofa(): Sofa;
}

// Concrete Factories
export class ModernFactory implements FurnitureFactory {
  createChair(): Chair { return new ModernChair(); }
  createSofa(): Sofa { return new ModernSofa(); }
}

export class VictorianFactory implements FurnitureFactory {
  createChair(): Chair { return new VictorianChair(); }
  createSofa(): Sofa { return new VictorianSofa(); }
}
