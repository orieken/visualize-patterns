export class Editor {
  public text = '';
}

export interface Command {
  execute(): void;
  undo(): void;
}

/**
 * CHALLENGE: Implement CopyCommand (simulated) and PasteCommand with Undo.
 * For simplicity: 
 * - CopyCommand just stores text in a static clipboard.
 * - PasteCommand appends clipboard text to Editor.
 * - PasteCommand.undo removes appended text.
 */
export class Clipboard {
  static content = '';
}

export class CopyCommand implements Command {
  constructor(private editor: Editor) {}

  execute() {
    // TODO: Clipboard.content = editor.text
  }
  undo() {}
}

export class PasteCommand implements Command {
  private backup = '';

  constructor(private editor: Editor) {}

  execute() {
    // TODO: backup = editor.text
    // editor.text += Clipboard.content
  }

  undo() {
    // TODO: editor.text = backup
  }
}
