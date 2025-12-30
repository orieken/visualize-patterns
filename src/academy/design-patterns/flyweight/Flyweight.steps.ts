import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { TreeFactory, TreeType } from './Flyweight';
import { CharacterFactory, Character } from './FlyweightChallenge';

// --- Reference Steps ---
let t1: TreeType;
let t2: TreeType;

Given('I request a {string} type twice', function (name) {
  t1 = TreeFactory.getTreeType(name, 'Green', 'Rough');
  t2 = TreeFactory.getTreeType(name, 'Green', 'Rough');
});

Then('the two types should be the SAME object instance', function () {
  assert.strictEqual(t1, t2);
});


// --- Challenge
let c1: Character;
let c2: Character;

Given('I get character {string} with font {string}', function (char, font) {
  c1 = CharacterFactory.getCharacter(font, 12);
});

Given('I get character {string} with font {string} again', function (char, font) {
  c2 = CharacterFactory.getCharacter(font, 12);
});

Then('they should be the exact same object', function () {
  assert.strictEqual(c1, c2, 'Expected same object reference for Flyweights');
});
