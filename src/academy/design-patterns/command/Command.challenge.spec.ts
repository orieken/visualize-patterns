import { describe, it, expect } from 'vitest';
import { Editor, CopyCommand, PasteCommand, Clipboard } from './CommandChallenge';

describe('Command Challenge', () => {
  it('should support undo', () => {
    const editor = new Editor();
    editor.text = 'Hello';
    
    const copy = new CopyCommand(editor);
    copy.execute();
    
    const paste = new PasteCommand(editor);
    paste.execute(); // text = HelloHello
    
    expect(editor.text).toBe('HelloHello');
    
    paste.undo();
    expect(editor.text).toBe('Hello');
  });
});
