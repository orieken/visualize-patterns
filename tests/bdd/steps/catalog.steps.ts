import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import type { CatalogItem } from '../../../src/types/catalog';

let dsaAlgorithms: CatalogItem[] = [];
let designPatterns: CatalogItem[] = [];
let mlAlgorithms: CatalogItem[] = [];
let summary: { traversal: number; creation: number; supervised: number };

Given('the curated collections of algorithms and patterns', async function () {
  const catalog = await import('../../../src/assets/data/catalog');
  dsaAlgorithms = catalog.dsaAlgorithms;
  designPatterns = catalog.designPatterns;
  mlAlgorithms = catalog.mlAlgorithms;
  assert.ok(dsaAlgorithms.length > 0);
  assert.ok(designPatterns.length > 0);
  assert.ok(mlAlgorithms.length > 0);
});

When('I summarize the learning themes', function () {
  const traversalCount = dsaAlgorithms.filter(
    (item: CatalogItem) => Boolean(item.category && item.category.toLowerCase().includes('traversal'))
  ).length;
  const creationCount = designPatterns.filter((item: CatalogItem) =>
    ['Factory Method', 'Abstract Factory', 'Builder', 'Prototype'].includes(item.name)
  ).length;
  const supervisedCount = mlAlgorithms.filter(
    (item: CatalogItem) => Boolean(item.type && item.type.toLowerCase().includes('supervised'))
  ).length;

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
