import { Given, When, Then } from 'cucumber';
import assert from 'node:assert/strict';
import { dsaAlgorithms, designPatterns, mlAlgorithms } from '../../../src/assets/data/catalog.js';

let summary;

Given('the curated collections of algorithms and patterns', function () {
  assert.ok(dsaAlgorithms.length > 0);
  assert.ok(designPatterns.length > 0);
  assert.ok(mlAlgorithms.length > 0);
});

When('I summarize the learning themes', function () {
  const traversalCount = dsaAlgorithms.filter(item => item.category.toLowerCase().includes('traversal')).length;
  const creationCount = designPatterns.filter(item => ['Factory Method', 'Abstract Factory', 'Builder', 'Prototype'].includes(item.name)).length;
  const supervisedCount = mlAlgorithms.filter(item => item.type.toLowerCase().includes('supervised')).length;

  summary = {
    traversal: traversalCount,
    creation: creationCount,
    supervised: supervisedCount
  };
});

Then('I see a breakdown that includes traversal, creation, and supervised learning', function () {
  assert.ok(summary.traversal >= 1, 'Traversal examples missing');
  assert.ok(summary.creation >= 1, 'Creation patterns missing');
  assert.ok(summary.supervised >= 1, 'Supervised algorithms missing');
});
