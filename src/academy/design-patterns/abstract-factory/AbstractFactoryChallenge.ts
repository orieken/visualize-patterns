export interface Button {
  render(): string;
}
export interface Checkbox {
  render(): string;
}

// Families: Mac and Win
export class WinButton implements Button { render() { return "WinButton"; } }
export class WinCheckbox implements Checkbox { render() { return "WinCheckbox"; } }

export class MacButton implements Button { render() { return "MacButton"; } }
export class MacCheckbox implements Checkbox { render() { return "MacCheckbox"; } }

// TODO: Define Abstract Factory Interface
// interface GUIFactory { ... }

// TODO: Implement Concrete Factories
// class WinFactory ...
// class MacFactory ...

export class Application {
  private factory: any; // Fix type
  private button: Button | null = null;
  
  constructor(factory: any) { // Fix type
    this.factory = factory;
  }

  createUI() {
    // this.button = this.factory.createButton();
  }

  paint() {
    return this.button ? this.button.render() : "Nothing";
  }
}
