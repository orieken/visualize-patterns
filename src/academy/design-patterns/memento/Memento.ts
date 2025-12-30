export class Memento {
  constructor(private state: string) {}

  getState() {
    return this.state;
  }
}

export class Editor {
  private content = '';

  type(words: string) {
    this.content += words;
  }

  getContent() {
    return this.content;
  }

  save(): Memento {
    return new Memento(this.content);
  }

  restore(m: Memento) {
    this.content = m.getState();
  }
}

export class History {
  private mementos: Memento[] = [];

  push(m: Memento) {
    this.mementos.push(m);
  }

  pop(): Memento | undefined {
    return this.mementos.pop();
  }
}
