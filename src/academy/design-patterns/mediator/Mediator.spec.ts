import { describe, it, expect } from 'vitest';
import { ChatRoom, User } from './Mediator';

describe('Mediator Pattern (Reference)', () => {
  it('should facilitate communication', () => {
    const room = new ChatRoom();
    const alice = new User('Alice');
    const bob = new User('Bob');

    room.register(alice);
    room.register(bob);

    alice.send('Hello');
    
    expect(bob.inbox).toContain('Hello');
    expect(alice.inbox).not.toContain('Hello'); // Sender doesn't receive own msg
  });
});
