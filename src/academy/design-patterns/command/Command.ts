export interface Command {
  execute(): void;
}

export class Light {
  private on = false;
  
  turnOn() { this.on = true; }
  turnOff() { this.on = false; }
  isOn() { return this.on; }
}

export class TurnOnCommand implements Command {
  constructor(private light: Light) {}
  execute() { this.light.turnOn(); }
}

export class TurnOffCommand implements Command {
  constructor(private light: Light) {}
  execute() { this.light.turnOff(); }
}

export class Remote {
  private command: Command | null = null;
  
  setCommand(c: Command) { this.command = c; }
  pressButton() { this.command?.execute(); }
}
