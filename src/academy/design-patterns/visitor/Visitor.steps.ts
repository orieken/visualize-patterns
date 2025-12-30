import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Dot, XMLExportVisitor } from './Visitor';
import { Book, DiscountVisitor } from './VisitorChallenge';

// --- Reference Steps ---
let dot: Dot;
let xml: string;

Given('a Dot shape', function () {
  dot = new Dot();
});

When('I export it to XML', function () {
  const visitor = new XMLExportVisitor();
  xml = dot.accept(visitor);
});

Then('the result should be {string}', function (val) {
  assert.strictEqual(xml, val);
});


// --- Challenge
let book: Book;
let finalPrice: number;

Given('a Book costing {int}', function (p) {
  book = new Book(p);
});

When('I apply the Discount Visitor', function () {
  const v = new DiscountVisitor();
  finalPrice = book.accept(v);
});

Then('the new cost should be {int}', function (p) {
  assert.strictEqual(finalPrice, p);
});
