import { DecisionTree } from '../decision-trees/DecisionTree';

export class RandomForest {
  private trees: DecisionTree[] = [];

  constructor(private numTrees: number = 3) {}

  fit(X: number[][], y: number[]) {
    // In a real RF, we'd bootstrap data and select subset of features.
    // Here, we just create Trees that (fake) learned slightly different things.
    // For reference, we'll just push identical trees since our DT is hardcoded.
    for (let i = 0; i < this.numTrees; i++) {
        const tree = new DecisionTree();
        tree.fit(X, y);
        this.trees.push(tree);
    }
  }

  predict(x: number[]): number {
    const votes: number[] = [];
    for (const tree of this.trees) {
        votes.push(tree.predict(x));
    }

    const counts = votes.reduce((acc, v) => {
        acc[v] = (acc[v] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    let maxVote = -1;
    let maxLabel = -1;
    for (const [label, count] of Object.entries(counts)) {
        if (count > maxVote) {
            maxVote = count;
            maxLabel = parseInt(label);
        }
    }
    return maxLabel;
  }
}
