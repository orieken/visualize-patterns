import { describe, it, expect } from 'vitest';
import { Editor, History } from './Memento';

describe('Memento Pattern (Reference)', () => {
  it('should save and restore state', () => {
    const editor = new Editor();
    const history = new History();

    editor.type('Hello');
    history.push(editor.save());

    editor.type(' World');
    expect(editor.getContent()).toBe('Hello World');

    editor.restore(history.pop()!);
    expect(editor.getContent()).toBe('Hello');
  });
});
