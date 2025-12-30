import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { dijkstra } from './Dijkstra';
import { dijkstraChallenge } from './DijkstraChallenge';

let graph: Record<string, Record<string, number>>;
let distances: Record<string, number>;

Given('a weighted graph:', function (dataTable) {
  graph = {};
  const rows = dataTable.hashes();

  // Pre-seed keys
  for (const row of rows) {
    if (!graph[row.from]) graph[row.from] = {};
    if (row.to && !graph[row.to]) graph[row.to] = {};
  }

  for (const row of rows) {
    if (row.to && row.weight) {
      graph[row.from][row.to] = parseFloat(row.weight);
    }
  }
});

When('I run Reference Dijkstra from {string}', function (start) {
  distances = dijkstra(graph, start);
});

When('I run Challenge Dijkstra from {string}', function (start) {
  distances = dijkstraChallenge(graph, start);
});

Then('the distance to {string} should be {int}', function (node, expectedDist) {
  assert.strictEqual(distances[node], expectedDist, `Expected distance to ${node} to be ${expectedDist}, got ${distances[node]}`);
});
