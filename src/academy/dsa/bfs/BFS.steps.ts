import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { bfs } from './BFS';
import { bfsChallenge } from './BFSChallenge';

let graph: Record<string, string[]> = {};
let result: string[] = [];

Given('a graph structure:', function (dataTable) {
  graph = {};
  const rows = dataTable.hashes(); 
  for (const row of rows) {
    const neighbors = row.neighbors ? row.neighbors.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
    graph[row.node] = neighbors;
  }
});

When('I run the Reference BFS starting from {string}', function (startNode) {
  result = bfs(graph, startNode);
});

When('I run the Challenge BFS starting from {string}', function (startNode) {
  result = bfsChallenge(graph, startNode);
});

Then('the visited order should be {string}', function (expectedStr) {
  const expected = expectedStr.split(',').map((s: string) => s.trim());
  assert.deepEqual(result, expected, `Expected ${expected} but got ${result}`);
});
