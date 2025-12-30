export interface State {
  publish(doc: Document): void;
  render(): string;
}

export class DraftState implements State {
  publish(doc: Document): void {
    doc.setState(new PublishedState());
  }
  render(): string {
    return 'Draft Mode';
  }
}

export class PublishedState implements State {
  publish(doc: Document): void {
    // Already published, maybe do nothing
  }
  render(): string {
    return 'Published Mode';
  }
}

export class Document {
  private state: State;

  constructor() {
    this.state = new DraftState();
  }

  setState(s: State) {
    this.state = s;
  }

  publish() {
    this.state.publish(this);
  }

  render() {
    return this.state.render();
  }
}
