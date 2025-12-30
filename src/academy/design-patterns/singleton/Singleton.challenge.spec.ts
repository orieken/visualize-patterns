import { describe, it, expect } from 'vitest';
import { DatabaseConnection } from './SingletonChallenge';

describe('Singleton Challenge', () => {
  it('should return the same database connection instance', () => {
    const db1 = DatabaseConnection.getInstance();
    const db2 = DatabaseConnection.getInstance();

    // This expectation will fail until you implement the Singleton pattern!
    expect(db1).toBe(db2); 
  });
});
