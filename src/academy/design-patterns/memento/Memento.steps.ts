import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Editor, History, Memento } from './Memento';
import { Game, GameStateMemento } from './MementoChallenge';

// --- Reference Steps ---
let editor: Editor;
let savedState: Memento;

Given('an Editor with text {string}', function (txt) {
  editor = new Editor();
  editor.type(txt);
});

When('I save state', function () {
  savedState = editor.save();
});

When('I type {string}', function (txt) {
  editor.type(txt);
});

When('I restore state', function () {
  editor.restore(savedState);
});

Then('the text should be {string}', function (txt) {
  assert.strictEqual(editor.getContent(), txt);
});


// --- Challenge
let game: Game;
let gameSave: GameStateMemento;

Given('a Game at Level {int} with {int} HP', function (lvl, hp) {
  game = new Game();
  game.level = lvl;
  game.health = hp;
});

When('I save the game', function () {
  gameSave = game.save();
});

When('I play getting damaged to {int} HP', function (hp) {
  game.play(); // Simulates change
  // We force logic to match scenario just in case play() logic differs
  // But typically we just want to ensure state changed
  assert.notStrictEqual(game.health, 50); // Ensure it changed
});

When('I load the save', function () {
  game.load(gameSave);
});

Then('I should be back at Level {int} with {int} HP', function (lvl, hp) {
  assert.strictEqual(game.level, lvl);
  assert.strictEqual(game.health, hp);
});
