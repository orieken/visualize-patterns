export class QLearningChallenge {
  private qTable: number[][] = [];

  constructor(numStates: number, numActions: number) {
    // Initialize Q-Table
    this.qTable = Array.from({ length: numStates }, () => Array(numActions).fill(0));
  }

  learn(state: number, action: number, reward: number, nextState: number) {
    const alpha = 0.1;
    const gamma = 0.9;
    
    const currentQ = this.qTable[state][action];
    const maxNextQ = Math.max(...this.qTable[nextState]);
    
    this.qTable[state][action] = currentQ + alpha * (reward + gamma * maxNextQ - currentQ);
  }

  getQ(state: number, action: number): number {
    return this.qTable[state][action];
  }
}
