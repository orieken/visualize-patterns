export interface Visitor {
  visitDot(d: Dot): string;
  visitCircle(c: Circle): string;
}

export interface Shape {
  accept(v: Visitor): string;
}

export class Dot implements Shape {
  accept(v: Visitor) { return v.visitDot(this); }
}

export class Circle implements Shape {
  accept(v: Visitor) { return v.visitCircle(this); }
}

export class XMLExportVisitor implements Visitor {
  visitDot(d: Dot) { return '<dot>'; }
  visitCircle(c: Circle) { return '<circle>'; }
}
