export function dfs(graph: Record<string, string[]>, start: string): string[] {
  const result: string[] = [];
  const visited = new Set<string>();

  function traverse(node: string) {
    if (visited.has(node)) return;
    visited.add(node);
    result.push(node);

    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      traverse(neighbor);
    }
  }

  traverse(start);
  return result;
}
