export class Character {
  // Intrinsic state (shared)
  public readonly font: string;
  public readonly size: number;
  
  constructor(font: string, size: number) {
    this.font = font;
    this.size = size;
  }
}

export class CharacterFactory {
  // TODO: Cache for Characters
  
  static getCharacter(font: string, size: number): Character {
    // TODO: Return cached or create new
    return new Character(font, size); // <-- FIX THIS (Not sharing!)
  }
}
