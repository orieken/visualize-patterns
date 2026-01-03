/**
 * CHALLENGE: Implement Union-Find (DSU).
 * 
 * Rules:
 * 1. Implement 'find' with Path Compression.
 * 2. Implement 'union' with Rank or Size optimization.
 */
export class UnionFindChallenge {
  private parent: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
  }

  find(i: number): number {
    if (this.parent[i] === i) {
        return i;
    }
    // Path compression
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i: number, j: number): void {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
        this.parent[rootI] = rootJ;
    }
  }

  connected(i: number, j: number): boolean {
    return this.find(i) === this.find(j);
  }
}
