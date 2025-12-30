import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { ConcreteBuilder1, Director, Product } from './Builder';
import { CarBuilderImpl, Car } from './BuilderChallenge';

// --- Reference Steps ---
let director: Director;
let builder: ConcreteBuilder1;
let product: Product;

Given('a Director with a ConcreteBuilder', function () {
  builder = new ConcreteBuilder1();
  director = new Director(builder);
});

When('I ask for a minimal viable product', function () {
  director.buildMinimalViableProduct();
  product = builder.getProduct();
});

When('I ask for a full featured product', function () {
  director.buildFullFeaturedProduct();
  product = builder.getProduct();
});

Then('the product should have parts {string}', function (parts) {
  assert.strictEqual(product.listParts(), `Product parts: ${parts}`);
});

// --- Challenge Steps ---
let carBuilder: CarBuilderImpl;
let car: Car;

Given('a CarBuilder', function () {
  carBuilder = new CarBuilderImpl();
});

When('I build a car with {int} seats, {string} engine, and GPS', function (seats, engine) {
  car = carBuilder
    .setSeats(seats)
    .setEngine(engine)
    .setGPS(true)
    .getResult();
});

Then('the car description should be {string}', function (desc) {
  assert.strictEqual(car.describe(), desc);
});
