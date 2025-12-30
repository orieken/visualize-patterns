export interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(percent: number): void;
}

export class Radio implements Device {
  private on = false;
  private volume = 30;

  isEnabled() { return this.on; }
  enable() { this.on = true; }
  disable() { this.on = false; }
  getVolume() { return this.volume; }
  setVolume(percent: number) { this.volume = percent; }
}

export class TV implements Device {
  private on = false;
  private volume = 50;

  isEnabled() { return this.on; }
  enable() { this.on = true; }
  disable() { this.on = false; }
  getVolume() { return this.volume; }
  setVolume(percent: number) { this.volume = percent; }
}

export class RemoteControl {
  protected device: Device;

  constructor(device: Device) {
    this.device = device;
  }

  togglePower() {
    if (this.device.isEnabled()) this.device.disable();
    else this.device.enable();
  }

  volumeUp() {
    const old = this.device.getVolume();
    this.device.setVolume(old + 10);
  }
}
