export class Node {
  constructor(
    public featureIndex: number | null = null,
    public threshold: number | null = null,
    public left: Node | null = null,
    public right: Node | null = null,
    public value: number | null = null
  ) {}
}

export class DecisionTreeChallenge {
  public root: Node | null = null;

  fit(X: number[][], y: number[]) {
    // Challenge: Build a simple stump manually
    // If x[0] < 10 -> class 0, else -> class 1
    // TODO: Construct the tree nodes here
  }

  predict(x: number[]): number {
    // TODO: Traverse the tree
    return -1; // <-- FIX THIS
  }
}
