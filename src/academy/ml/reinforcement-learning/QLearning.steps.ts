import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { QLearning } from './QLearning';
import { QLearningChallenge } from './QLearningChallenge';

// --- Reference Steps ---
let ql: QLearning;

Given('a linear path 0 -> 1 -> 2\(Goal\)', function () {
  ql = new QLearning(3, 2, 2);
});

When('I train the agent', function () {
  for(let i=0; i<50; i++) {
    ql.learn(1, 1, 10, 2); // 1->2 Reward 10
    ql.learn(0, 1, -1, 1); // 0->1 Reward -1
  }
});

Then('the value of state {int} should increase towards Goal', function (state) {
  // Q(0, Right) should be > 0. If it was only -1, it would be negative.
  // The fact it's positive means +10 propagated back.
  assert.ok(ql.getQ(state, 1) > 0);
});


// --- Challenge
let cQl: QLearningChallenge;

Given('an initialized Q-Agent', function () {
  cQl = new QLearningChallenge(2, 2);
});

When('I perform a learning step with reward {int}', function (r) {
  cQl.learn(0, 0, r, 1);
});

Then('the Q-value should be non-zero', function () {
  assert.notStrictEqual(cQl.getQ(0, 0), 0);
});
