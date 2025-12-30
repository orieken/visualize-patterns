export interface Prototype {
  clone(): Prototype;
}

export class Robot implements Prototype {
  public model: string;
  public batteryLevel: number;
  public knownDirectives: string[];

  constructor(model: string, battery: number, directives: string[]) {
    this.model = model;
    this.batteryLevel = battery;
    this.knownDirectives = directives;
  }

  public clone(): Robot {
    // Deep copy directives to ensure independence
    const clonedDirectives = [...this.knownDirectives];
    return new Robot(this.model, this.batteryLevel, clonedDirectives);
  }
  
  public addDirective(d: string) {
    this.knownDirectives.push(d);
  }
}
