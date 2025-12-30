import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { BookShelf, Book } from './Iterator';
import { LinkedList, ListIterator } from './IteratorChallenge';

// --- Reference Steps ---
let shelf: BookShelf;
let retrievedBooks: string[];

Given('a Bookshelf with {string} and {string}', function (b1, b2) {
  shelf = new BookShelf();
  shelf.appendBook(new Book(b1));
  shelf.appendBook(new Book(b2));
});

When('I iterate through the shelf', function () {
  retrievedBooks = [];
  const it = shelf.createIterator();
  while (it.hasNext()) {
    retrievedBooks.push(it.next().title);
  }
});

Then('I should retrieve {string} then {string}', function (b1, b2) {
  assert.deepEqual(retrievedBooks, [b1, b2]);
});

// --- Challenge
let list: LinkedList<number>;
let listValues: number[];

Given('a LinkedList with {int} and {int}', function (v1, v2) {
  list = new LinkedList<number>();
  list.add(v1);
  list.add(v2);
});

When('I iterate the list', function () {
  listValues = [];
  const it = new ListIterator(list);
  while (it.hasNext()) {
    const val = it.next();
    if (val !== null) listValues.push(val);
  }
});

Then('I should get {int} then {int}', function (v1, v2) {
  assert.deepEqual(listValues, [v1, v2]);
});
