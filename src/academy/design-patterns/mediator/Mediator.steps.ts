import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { ChatRoom, User } from './Mediator';
import { AirportTower, Airplane } from './MediatorChallenge';

// --- Reference Steps ---
let room: ChatRoom;
let u1: User;
let u2: User;

Given('users Alice and Bob are in a ChatRoom', function () {
  room = new ChatRoom();
  u1 = new User('Alice');
  u2 = new User('Bob');
  room.register(u1);
  room.register(u2);
});

When('Alice sends {string}', function (msg) {
  u1.send(msg);
});

Then('Bob should receive {string}', function (msg) {
  assert.ok(u2.inbox.includes(msg));
});


// --- Challenge
let tower: AirportTower;
let p1: Airplane;
let p2: Airplane;
let p1Result: boolean;
let p2Result: boolean;

Given('an AirportTower', function () {
  tower = new AirportTower();
});

When('Plane A requests to land', function () {
  p1 = new Airplane('A', tower);
  p1Result = p1.requestToLand();
});

Then('permission should be GRANTED', function () {
  assert.strictEqual(p1Result, true, 'Plane A should land');
});

When('Plane B requests to land immediately after', function () {
  p2 = new Airplane('B', tower);
  p2Result = p2.requestToLand();
});

Then('permission should be DENIED', function () {
  assert.strictEqual(p2Result, false, 'Plane B should be denied');
});
