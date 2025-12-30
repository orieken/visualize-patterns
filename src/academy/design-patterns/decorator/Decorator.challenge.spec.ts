import { describe, it, expect } from 'vitest';
import { FileDataSource, EncryptionDecorator } from './DecoratorChallenge';

describe('Decorator Challenge', () => {
  it('should encrypt data', () => {
    const source = new FileDataSource();
    const encrypted = new EncryptionDecorator(source);
    
    // Assumption: Implementation reverses or changes string
    // "hello" -> "olleh" or similar
    const result = encrypted.writeData('hello');
    expect(result).not.toBe('Writing: hello'); 
    expect(result.length).toBeGreaterThan(5);
  });
});
