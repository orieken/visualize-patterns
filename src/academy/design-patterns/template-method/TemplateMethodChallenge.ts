/**
 * CHALLENGE: Implement BeverageMaker template.
 * Steps: boilWater, brew, pourInCup, addCondiments.
 * brew and addCondiments are abstract.
 */
export abstract class BeverageMaker {
  prepareRecipe(): string[] {
    const steps = [];
    steps.push(this.boilWater());
    steps.push(this.brew());
    steps.push(this.pourInCup());
    steps.push(this.addCondiments());
    return steps;
  }

  boilWater() { return "Boiling water"; }
  pourInCup() { return "Pouring into cup"; }
  
  abstract brew(): string;
  abstract addCondiments(): string;
}

export class Tea extends BeverageMaker {
  brew() {
    // TODO: Steep tea bag
    return ""; // <-- FIX THIS
  }
  addCondiments() {
    // TODO: Add lemon
    return ""; // <-- FIX THIS
  }
}

export class Coffee extends BeverageMaker {
  brew() {
    return ""; // <-- FIX THIS
  }
  addCondiments() {
    return ""; // <-- FIX THIS
  }
}
