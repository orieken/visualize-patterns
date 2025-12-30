// Simple GridWorld Q-Learning
// State: 0..N (Index on grid)
// Actions: 0 (Left), 1 (Right)
// Reward: +10 at Goal, -1 otherwise

export class QLearning {
  private qTable: number[][]; // [State][Action]
  private learningRate = 0.5;
  private gamma = 0.9;
  private goalState: number;

  constructor(numStates: number, numActions: number, goal: number) {
    this.qTable = Array.from({ length: numStates }, () => Array(numActions).fill(0));
    this.goalState = goal;
  }

  // Choose action (Greedy or Epsilon-Greedy)
  chooseAction(state: number, epsilon = 0.0): number {
    if (Math.random() < epsilon) {
        return Math.floor(Math.random() * this.qTable[state].length);
    }
    // Argmax
    return this.qTable[state].reduce((bestIdx, val, i, arr) => val > arr[bestIdx] ? i : bestIdx, 0);
  }

  // Update Q(s,a) = Q(s,a) + lr * (r + gamma * max(Q(s', a')) - Q(s,a))
  learn(state: number, action: number, reward: number, nextState: number) {
    const maxNextQ = Math.max(...this.qTable[nextState]);
    const currentQ = this.qTable[state][action];
    
    this.qTable[state][action] = currentQ + this.learningRate * (reward + this.gamma * maxNextQ - currentQ);
  }

  getQ(state: number, action: number) {
    return this.qTable[state][action];
  }
}
