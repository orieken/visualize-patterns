import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Navigator, RoadStrategy } from './Strategy';
import { ShoppingCart, PaypalStrategy } from './StrategyChallenge';

// --- Reference Steps ---
let nav: Navigator;
let route: string;

Given('a Navigator with RoadStrategy', function () {
  nav = new Navigator(new RoadStrategy());
});

When('I plan route from {string} to {string}', function (a, b) {
  route = nav.buildRoute(a, b);
});

Then('the route should be via {string}', function (type) {
  assert.ok(route.includes(type));
});


// --- Challenge
let cart: ShoppingCart;
let receipt: string;

Given('a Cart with PayPal Strategy', function () {
  cart = new ShoppingCart(new PaypalStrategy());
});

When('I checkout {int}', function (amt) {
  receipt = cart.checkout(amt);
});

Then('the payment should indicate {string}', function (method) {
  assert.ok(receipt.includes(method), `Expected ${receipt} to include ${method}`);
});
