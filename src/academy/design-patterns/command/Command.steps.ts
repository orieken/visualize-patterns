import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Light, TurnOnCommand, Remote } from './Command';
import { Editor, CopyCommand, PasteCommand, Clipboard } from './CommandChallenge';

// --- Reference Steps ---
let light: Light;

Given('a Light is off', function () {
  light = new Light();
});

When('I execute the TurnOnCommand', function () {
  const cmd = new TurnOnCommand(light);
  cmd.execute();
});

Then('the Light should be on', function () {
  assert.strictEqual(light.isOn(), true);
});

// --- Challenge
let editor: Editor;
let pasteCmd: PasteCommand;

Given('the editor has text {string}', function (txt) {
  editor = new Editor();
  editor.text = txt;
});

Given('I copy {string}', function (txt) {
  // Simulate copy action. Ideally we'd select text then copy.
  // Here we assume selection is implicitly the whole text or passed argument.
  Clipboard.content = txt;
});

When('I paste', function () {
  pasteCmd = new PasteCommand(editor);
  pasteCmd.execute();
});

When('I undo paste', function () {
  pasteCmd.undo();
});

Then('the text should be {string}', function (txt) {
  assert.strictEqual(editor.text, txt);
});
