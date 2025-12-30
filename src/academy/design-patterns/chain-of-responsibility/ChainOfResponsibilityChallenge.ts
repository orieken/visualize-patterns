export abstract class SupportHandler {
  protected next: SupportHandler | null = null;
  
  setNext(h: SupportHandler): SupportHandler {
    this.next = h;
    return h;
  }
  
  abstract handleRequest(level: string): string;
}

/**
 * CHALLENGE: Implement handlers for Level 1, Level 2, and Manager.
 * Level 1 handles "basic".
 * Level 2 handles "advanced".
 * Manager handles "critical".
 */
export class Level1Support extends SupportHandler {
  handleRequest(level: string): string {
    // TODO: if level is 'basic', return 'Level 1 handled'. Else pass to next.
    return 'unhandled'; // <-- FIX THIS
  }
}

export class Level2Support extends SupportHandler {
  handleRequest(level: string): string {
    // TODO: if level is 'advanced', return 'Level 2 handled'. Else pass to next.
    return 'unhandled'; // <-- FIX THIS
  }
}

export class ManagerSupport extends SupportHandler {
  handleRequest(level: string): string {
    // TODO: if level is 'critical', return 'Manager handled'. Else 'unhandled'.
    return 'unhandled'; // <-- FIX THIS
  }
}
