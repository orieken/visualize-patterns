import { DecisionTree } from '../decision-trees/DecisionTree';

export class RandomForestChallenge {
  public trees: DecisionTree[] = [];

  constructor(private numTrees: number = 3) {}

  fit(X: number[][], y: number[]) {
    // Populate trees
    for (let i = 0; i < this.numTrees; i++) {
        const t = new DecisionTree();
        t.fit(X, y); // Use reference fit for simplicity
        this.trees.push(t);
    }
  }

  predict(x: number[]): number {
    // TODO: Collect votes from all this.trees
    // TODO: Return majority class
    return -1; // <-- FIX THIS
  }
}
