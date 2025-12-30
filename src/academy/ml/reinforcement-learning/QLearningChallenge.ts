export class QLearningChallenge {
  private qTable: number[][] = [];

  constructor(numStates: number, numActions: number) {
    // Initialize Q-Table
    this.qTable = Array.from({ length: numStates }, () => Array(numActions).fill(0));
  }

  learn(state: number, action: number, reward: number, nextState: number) {
    // TODO: Implement Q-Learning update rule
    // Q(s,a) += alpha * (reward + gamma * maxQ(s') - Q(s,a))
  }

  getQ(state: number, action: number): number {
    return this.qTable[state][action];
  }
}
