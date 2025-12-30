export interface DataSource {
  writeData(data: string): string;
}

export class FileDataSource implements DataSource {
  writeData(data: string): string {
    return `Writing: ${data}`;
  }
}

/**
 * CHALLENGE: Implement EncryptionDecorator.
 * It should modify the data string before delegation.
 */
export class EncryptionDecorator implements DataSource {
  protected wrappee: DataSource;

  constructor(source: DataSource) {
    this.wrappee = source;
  }

  writeData(data: string): string {
    // TODO: Encrypt data (e.g. reverse it or scramble)
    // TODO: Call wrappee
    return ""; // <-- FIX THIS
  }
}
