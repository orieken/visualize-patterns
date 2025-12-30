export abstract class Component {
  abstract operation(): string;
  add(c: Component): void {}
  remove(c: Component): void {}
  getChild(i: number): Component | null { return null; }
}

export class Leaf extends Component {
  operation(): string {
    return 'Leaf';
  }
}

export class Composite extends Component {
  protected children: Component[] = [];

  add(c: Component): void {
    this.children.push(c);
  }

  remove(c: Component): void {
    const index = this.children.indexOf(c);
    if (index > -1) this.children.splice(index, 1);
  }

  getChild(i: number): Component | null {
    return this.children[i] || null;
  }

  operation(): string {
    const results = [];
    for (const child of this.children) {
      results.push(child.operation());
    }
    return `Branch(${results.join('+')})`;
  }
}
