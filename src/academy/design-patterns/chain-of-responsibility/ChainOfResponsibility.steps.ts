import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { MonkeyHandler, SquirrelHandler, DogHandler, Handler } from './ChainOfResponsibility';
import { Level1Support, Level2Support, ManagerSupport, SupportHandler } from './ChainOfResponsibilityChallenge';

// --- Reference Steps ---
let chain: Handler;
let response: string | null;

Given('a chain Monkey -> Squirrel -> Dog', function () {
  const m = new MonkeyHandler();
  const s = new SquirrelHandler();
  const d = new DogHandler();
  m.setNext(s).setNext(d);
  chain = m;
});

When('I feed {string} to the Monkey', function (food) {
  response = chain.handle(food);
});

Then('the {string} should eat it', function (animal) {
  assert.ok(response?.startsWith(animal));
});

Then('no one should eat it', function () {
  assert.strictEqual(response, null);
});


// --- Challenge
let supportChain: SupportHandler;
let ticketResult: string;

Given('a support chain Level1 -> Level2 -> Manager', function () {
  const l1 = new Level1Support();
  const l2 = new Level2Support();
  const m = new ManagerSupport();
  l1.setNext(l2).setNext(m);
  supportChain = l1;
});

When('I submit a {string} ticket', function (level) {
  ticketResult = supportChain.handleRequest(level);
});

Then('it should be handled by {string}', function (role) {
  assert.ok(ticketResult.includes(role));
});
