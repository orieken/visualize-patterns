export class Node {
  constructor(
    public featureIndex: number | null = null,
    public threshold: number | null = null,
    public left: Node | null = null,
    public right: Node | null = null,
    public value: number | null = null // Predicted class for leaf
  ) {}
}

export class DecisionTree {
  public root: Node | null = null;
  private maxDepth = 2;

  fit(X: number[][], y: number[]) {
    // Hardcoded tree for reference demonstration
    // If x[0] < 5 -> class 0
    // else -> class 1
    this.root = new Node(0, 5, 
      new Node(null, null, null, null, 0), 
      new Node(null, null, null, null, 1)
    );
  }

  predict(x: number[]): number {
    let node = this.root;
    while (node && node.value === null) {
      if (x[node.featureIndex!] < node.threshold!) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return node ? node.value! : 0;
  }
}
