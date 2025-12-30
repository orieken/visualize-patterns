export class MemorySubsystem {
  load() { return "Loading RAM..."; }
}

export class DiskSubsystem {
  read() { return "Reading Disk..."; }
}

export class CPUSubsystem {
  execute() { return "Executing Instructions..."; }
}

export class ComputerFacade {
  private mem: MemorySubsystem;
  private disk: DiskSubsystem;
  private cpu: CPUSubsystem;

  constructor() {
    this.mem = new MemorySubsystem();
    this.disk = new DiskSubsystem();
    this.cpu = new CPUSubsystem();
  }

  public startComputer(): string[] {
    return [
      this.mem.load(),
      this.disk.read(),
      this.cpu.execute()
    ];
  }
}
