export class Singleton {
  private static instance: Singleton;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public getData(): string {
    return "I am the single source of truth!";
  }
}
