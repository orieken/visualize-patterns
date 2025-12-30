import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { topologicalSort } from './TopologicalSort';
import { topologicalSortChallenge } from './TopologicalSortChallenge';

let graph: Record<string, string[]>;
let result: string[];

Given('a dependency graph:', function (dataTable) {
  graph = {};
  const rows = dataTable.hashes();

  // "task" depends on "dependsOn".
  // Arrow: dependsOn -> task.
  // Note: Standard TopoSort usually takes adjacency list: Node -> [Children/Dependents].
  // If Lint depends on Install, then Install -> Lint.
  
  // Prefill
  rows.forEach((r: any) => {
    if (!graph[r.task]) graph[r.task] = [];
    if (r.dependsOn && !graph[r.dependsOn]) graph[r.dependsOn] = [];
  });

  rows.forEach((r: any) => {
    if (r.dependsOn) {
      graph[r.dependsOn].push(r.task);
    }
  });
});

When('I run Reference TopoSort', function () {
  result = topologicalSort(graph);
});

Then('{string} should come before {string}', function (a, b) {
  const idxA = result.indexOf(a);
  const idxB = result.indexOf(b);
  assert.ok(idxA !== -1, `${a} not found in result ${result}`);
  assert.ok(idxB !== -1, `${b} not found in result ${result}`);
  assert.ok(idxA < idxB, `Expected ${a} to be before ${b}, but got indices ${idxA} and ${idxB}`);
});

// --- Challenge ---
let cGraph: Record<string, string[]>;
let cResult: string[];

Given('a Challenge dependency graph:', function (dataTable) {
  cGraph = {};
  const rows = dataTable.hashes();
  
  rows.forEach((r: any) => {
    if (!cGraph[r.task]) cGraph[r.task] = [];
    if (r.dependsOn && !cGraph[r.dependsOn]) cGraph[r.dependsOn] = [];
  });

  rows.forEach((r: any) => {
    if (r.dependsOn) {
      cGraph[r.dependsOn].push(r.task);
    }
  });
});

When('I run Challenge TopoSort', function () {
  cResult = topologicalSortChallenge(cGraph);
});

Then('{string} should come before {string} in Challenge result', function (a, b) {
  const idxA = cResult.indexOf(a);
  const idxB = cResult.indexOf(b);
  assert.ok(idxA !== -1);
  assert.ok(idxB !== -1);
  assert.ok(idxA < idxB);
});
