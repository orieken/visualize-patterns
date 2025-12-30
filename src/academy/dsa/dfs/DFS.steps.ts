import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { dfs } from './DFS';
import { dfsChallenge } from './DFSChallenge';

let graph: Record<string, string[]> = {};
let result: string[] = [];

Given('a DFS graph structure:', function (dataTable) {
  graph = {};
  const rows = dataTable.hashes(); 
  for (const row of rows) {
    const neighbors = row.neighbors ? row.neighbors.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
    graph[row.node] = neighbors;
  }
});

When('I run the Reference DFS starting from {string}', function (startNode) {
  result = dfs(graph, startNode);
});

When('I run the Challenge DFS starting from {string}', function (startNode) {
  result = dfsChallenge(graph, startNode);
});

Then('the DFS visited order should be {string}', function (expectedStr) {
  const expected = expectedStr.split(',').map((s: string) => s.trim());
  assert.deepEqual(result, expected, `Expected ${expected} but got ${result}`);
});
