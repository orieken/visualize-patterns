export interface Subject {
  request(): string;
}

export class RealSubject implements Subject {
  request(): string {
    return 'RealSubject: Handling request.';
  }
}

export class ProxySubject implements Subject {
  private realSubject: RealSubject;

  constructor(realSubject: RealSubject) {
    this.realSubject = realSubject;
  }

  public request(): string {
    if (this.checkAccess()) {
      const result = this.realSubject.request();
      this.logAccess();
      return `Proxy: ${result}`;
    }
    return 'Proxy: Access denied.';
  }

  private checkAccess(): boolean {
    // Simulating check
    return true; 
  }

  private logAccess(): void {
    console.log('Proxy: Logging the time of request.');
  }
}
