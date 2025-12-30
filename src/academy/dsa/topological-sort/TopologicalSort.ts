export function topologicalSort(graph: Record<string, string[]>): string[] {
  const inDegree: Record<string, number> = {};
  const nodes = Object.keys(graph);
  
  // Init in-degrees
  nodes.forEach(n => inDegree[n] = 0);
  nodes.forEach(n => {
    graph[n].forEach(neighbor => {
      inDegree[neighbor] = (inDegree[neighbor] || 0) + 1;
    });
  });

  const queue: string[] = [];
  nodes.forEach(n => {
    if (inDegree[n] === 0) queue.push(n);
  });

  const result: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    const neighbors = graph[node];
    for (const neighbor of neighbors) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  return result.length === nodes.length ? result : []; // Cycle detected if length mismatch
}
