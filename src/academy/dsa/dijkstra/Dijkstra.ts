export function dijkstra(
  graph: Record<string, Record<string, number>>,
  start: string
): Record<string, number> {
  const distances: Record<string, number> = {};
  const visited = new Set<string>();
  const nodes = Object.keys(graph);

  // Initialize
  for (const node of nodes) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  while (true) {
    let closestNode: string | null = null;
    let shortestDistance = Infinity;

    // Find closest unvisited node (Naive Priority Queue)
    for (const node of nodes) {
      if (!visited.has(node) && distances[node] < shortestDistance) {
        closestNode = node;
        shortestDistance = distances[node];
      }
    }

    if (closestNode === null) break; // All reachable nodes visited or disconnected

    visited.add(closestNode);

    // Relax neighbors
    const neighbors = graph[closestNode];
    for (const neighbor in neighbors) {
      const dist = distances[closestNode] + neighbors[neighbor];
      if (dist < distances[neighbor]) {
        distances[neighbor] = dist;
      }
    }
  }

  return distances;
}
