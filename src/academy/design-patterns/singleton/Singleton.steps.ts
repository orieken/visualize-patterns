import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Singleton } from './Singleton';
import { DatabaseConnection } from './SingletonChallenge';

// --- Reference Steps ---
let s1: Singleton;
let s2: Singleton;

Given('the Singleton class exists', function () {
  // Class is imported
});

When('I call the static getInstance method twice', function () {
  s1 = Singleton.getInstance();
  s2 = Singleton.getInstance();
});

Then('the two returned instances should be physically identical', function () {
  assert.strictEqual(s1, s2, 'Instances are not identical');
});

// --- Challenge Steps ---
let db1: DatabaseConnection;
let db2: DatabaseConnection;

Given('I have a class "DatabaseConnection" that is not yet reduced to a Singleton', function () {
  // Class is imported
});

When('I obtain two instances via "getInstance"', function () {
  db1 = DatabaseConnection.getInstance();
  db2 = DatabaseConnection.getInstance();
});

Then('the system should verify they are the SAME instance', function () {
  assert.strictEqual(db1, db2, 'DB Instances are not identical - Challenge Failed!');
});
