/**
 * CHALLENGE: Implement Union-Find (DSU).
 * 
 * Rules:
 * 1. Implement 'find' with Path Compression.
 * 2. Implement 'union' with Rank or Size optimization.
 */
export class UnionFindChallenge {
  // TODO: Add state (parent array, rank, etc)

  constructor(size: number) {
    // TODO: Init arrays
  }

  find(i: number): number {
    // TODO: Implement find with path compression
    return i; 
  }

  union(i: number, j: number): void {
    // TODO: Implement union
  }

  connected(i: number, j: number): boolean {
    return this.find(i) === this.find(j);
  }
}
