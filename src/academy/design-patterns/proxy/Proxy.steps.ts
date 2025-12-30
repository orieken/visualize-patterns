import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { RealSubject, ProxySubject } from './Proxy';
import { ProxyInternet } from './ProxyChallenge';

// --- Reference Steps ---
let real: RealSubject;
let proxy: ProxySubject;
let res: string;

Given('a RealSubject', function () {
  real = new RealSubject();
});

Given('a Proxy guarding it', function () {
  proxy = new ProxySubject(real);
});

When('I request through Proxy', function () {
  res = proxy.request();
});

Then('the request should be allowed and logged', function () {
  assert.ok(res.startsWith('Proxy:'), 'Response should be intercepted by Proxy');
});


// --- Challenge
let internet: ProxyInternet;
let connectRes: string;

Given('a ProxyInternet', function () {
  internet = new ProxyInternet();
});

When('I connect to {string}', function (host) {
  connectRes = internet.connectTo(host);
});

Then('it should connect', function () {
  assert.ok(connectRes.startsWith('Connecting'), `Expected connection, got ${connectRes}`);
});

Then('the connection should be denied', function () {
  assert.strictEqual(connectRes, 'Access Denied');
});
