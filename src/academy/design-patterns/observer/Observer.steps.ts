import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { NewsAgency, NewsChannel } from './Observer';
import { WeatherStation, WeatherObserver } from './ObserverChallenge';

// --- Reference Steps ---
let agency: NewsAgency;
let channel: NewsChannel;

Given('a NewsAgency', function () {
  agency = new NewsAgency();
});

Given('a channel {string} subscribed to it', function (name) {
  channel = new NewsChannel();
  agency.subscribe(channel);
});

When('the agency broadcasts {string}', function (news) {
  agency.notify(news);
});

Then('{string} should have the latest news {string}', function (name, news) {
  assert.strictEqual(channel.latestNews, news);
});


// --- Challenge
let station: WeatherStation;
let phoneDisplay: WeatherObserver & { lastTemp: number };

Given('a WeatherStation', function () {
  station = new WeatherStation();
});

Given('a PhoneDisplay subscribed', function () {
  phoneDisplay = {
    lastTemp: -100,
    update(t: number) { this.lastTemp = t; }
  };
  station.addObserver(phoneDisplay);
});

When('the temperature changes to {int}', function (temp) {
  station.setTemperature(temp);
});

Then('the info on PhoneDisplay should update to {int}', function (temp) {
  assert.strictEqual(phoneDisplay.lastTemp, temp);
});
