export interface Node {
  id: string;
  x: number;
  y: number;
}

export interface Graph {
  nodes: Record<string, Node>;
  edges: Record<string, Record<string, number>>; // Adjacency list with weights
}

// Manhattan distance heuristic
function heuristic(a: Node, b: Node): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function aStar(graph: Graph, startId: string, endId: string): string[] {
  const openSet = new Set<string>([startId]);
  const cameFrom: Record<string, string> = {};
  
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  
  Object.keys(graph.nodes).forEach(n => {
    gScore[n] = Infinity;
    fScore[n] = Infinity;
  });
  
  gScore[startId] = 0;
  fScore[startId] = heuristic(graph.nodes[startId], graph.nodes[endId]);
  
  while (openSet.size > 0) {
    // Find node in openSet having lowest fScore[] value
    let current: string | null = null;
    let lowestF = Infinity;
    
    for (const node of openSet) {
      if (fScore[node] < lowestF) {
        lowestF = fScore[node];
        current = node;
      }
    }
    
    if (current === endId) {
      // Reconstruct path
      const path = [current!];
      while (current! in cameFrom) {
        current = cameFrom[current!];
        path.unshift(current);
      }
      return path;
    }
    
    openSet.delete(current!);
    
    const neighbors = graph.edges[current!] || {};
    for (const neighbor in neighbors) {
      const tentativeG = gScore[current!] + neighbors[neighbor];
      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current!;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = gScore[neighbor] + heuristic(graph.nodes[neighbor], graph.nodes[endId]);
        
        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }
      }
    }
  }
  
  return []; // No path
}
