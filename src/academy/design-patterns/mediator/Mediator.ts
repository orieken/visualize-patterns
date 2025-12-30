export interface Mediator {
  notify(sender: object, event: string): void;
}

export class ChatRoom implements Mediator {
  public users: User[] = [];

  register(user: User) {
    this.users.push(user);
    user.setMediator(this);
  }

  notify(sender: object, event: string): void {
    if (event.startsWith('MSG:')) {
      const msg = event.substring(4);
      // Broadcast to everyone except sender
      for (const u of this.users) {
        if (u !== sender) {
          u.receive(msg);
        }
      }
    }
  }
}

export class User {
  private mediator: Mediator | null = null;
  public inbox: string[] = [];

  constructor(public name: string) {}

  setMediator(m: Mediator) { this.mediator = m; }

  send(msg: string) {
    this.mediator?.notify(this, `MSG:${msg}`);
  }

  receive(msg: string) {
    this.inbox.push(msg);
  }
}
