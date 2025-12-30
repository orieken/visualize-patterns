import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { aStar, Graph } from './AStar';
import { aStarChallenge } from './AStarChallenge';

let graph: Graph;
let result: string[];

Given('a grid map with nodes:', function (dataTable) {
  graph = { nodes: {}, edges: {} };
  const rows = dataTable.hashes();
  for (const row of rows) {
    graph.nodes[row.id] = { id: row.id, x: parseInt(row.x), y: parseInt(row.y) };
    graph.edges[row.id] = {};
  }
});

Given('edges with weights:', function (dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    if (!graph.edges[row.from]) graph.edges[row.from] = {};
    graph.edges[row.from][row.to] = parseFloat(row.weight);
  }
});

When('I run Reference A* from {string} to {string}', function (start, end) {
  result = aStar(graph, start, end);
});

When('I run Challenge A* from {string} to {string}', function (start, end) {
  result = aStarChallenge(graph, start, end);
});

Then('the path should be {string}', function (pathStr) {
  const expected = pathStr.split(',').map((s: string) => s.trim());
  assert.deepEqual(result, expected);
});
