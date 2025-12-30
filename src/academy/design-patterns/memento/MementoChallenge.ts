export class GameStateMemento {
  // TODO: store level and health
}

/**
 * CHALLENGE: Implement Game and GameHistory.
 */
export class Game {
  level = 1;
  health = 100;

  play() {
    this.level++;
    this.health -= 10;
  }

  save(): GameStateMemento {
    // TODO: Create memento
    return new GameStateMemento(); // <-- FIX THIS
  }

  load(m: GameStateMemento) {
    // TODO: restore
  }
}
