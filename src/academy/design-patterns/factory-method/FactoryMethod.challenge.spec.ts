import { describe, it, expect } from 'vitest';
import { WindowsDialog, WebDialog } from './FactoryMethodChallenge';

describe('Factory Method Challenge', () => {
  it('WindowsDialog should create WindowsButton', () => {
    const dialog = new WindowsDialog();
    // Expected: The dialog renders a windows button
    // You might need to cast or inspect internals if you want check types, 
    // but checking the output string is sufficient for the pattern logic.
    expect(dialog.renderWindow()).toContain('Rendering Windows Button');
  });

  it('WebDialog should create HTMLButton', () => {
    const dialog = new WebDialog();
    expect(dialog.renderWindow()).toContain('Rendering HTML Button');
  });
});
