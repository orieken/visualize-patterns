export interface Button {
  render(): string;
  onClick(): string;
}

export class WindowsButton implements Button {
  render() { return "Rendering Windows Button"; }
  onClick() { return "Click! Windows Event"; }
}

export class HTMLButton implements Button {
  render() { return "Rendering HTML Button"; }
  onClick() { return "Click! DOM Event"; }
}

export abstract class Dialog {
  // TODO: Define the abstract factory method
  // abstract createButton(): Button;

  public renderWindow(): string {
    // TODO: Use the factory method to get a button
    // const button = this.createButton();
    // return `Dialog: ${button.render()}`;
    return "Dialog: No Button"; // Placeholder
  }
}

export class WindowsDialog extends Dialog {
  // TODO: Implement createButton returning WindowsButton
}

export class WebDialog extends Dialog {
  // TODO: Implement createButton returning HTMLButton
}
