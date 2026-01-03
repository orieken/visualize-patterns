import type { CatalogItem, Domain } from '../../types/catalog';

const slugify = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const normalizeItems = (items: Array<Omit<CatalogItem, 'domain' | 'slug'> & { slug?: string }>, domain: Domain): CatalogItem[] =>
  items.map(item => ({
    ...item,
    domain,
    slug: item.slug ?? slugify(item.name)
  }));

export const dsaAlgorithms: CatalogItem[] = normalizeItems(
  [
    {
      name: 'Breadth-First Search',
      category: 'Graph traversal',
      complexity: 'O(V + E)',
      idea: 'Explore neighbors level by level using a queue.',
      explanation: "Breadth-First Search (BFS) explores a graph layer by layer, like ripples spreading out from a pebble dropped in water. It visits all immediate neighbors of the starting node first, then their neighbors, and so on.\n\nImagine searching for a friend in a crowd: you'd look at the people immediately around you before looking at the people standing behind them. BFS guarantees finding the shortest path in an unweighted graph because it reaches every node at distance k before any node at distance k+1.\n\nKey Mechanisms:\n1. **Queue (FIFO)**: Tracks nodes to visit. First in, first out ensures we finish one 'layer' before moving to the next.\n2. **Visited Set**: Keeps track of where we've been to avoid cycles and redundant work.",
      visualization: {
        type: 'interactive',
        component: 'BfsInteractive',
        title: 'Interactive BFS Traversal',
        summary: 'Control the queue and watch the "ripples" spread.'
      },
      starterCode: `/**
 * Breadth-First Search Implementation
 * 
 * Implement the BFS algorithm to traverse a graph.
 * 
 * Instructions:
 * 1. Return an array of nodes in the order they were visited.
 * 2. Start from the given 'startNode'.
 * 3. Use the 'graph' adjacency list where keys are nodes and values are arrays of neighbors.
 */

class BreadthFirstSearch {
    solve(graph: Record<string, string[]>, startNode: string): string[] {
        // TODO: Implement BFS
        return [];
    }
}

// Example usage
const graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
};

const bfs = new BreadthFirstSearch();
console.log(bfs.solve(graph, 'A'));`,
      testCases: [
        {
          input: [{ 'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': ['F'], 'F': [] }, 'A'],
          expected: ['A', 'B', 'C', 'D', 'E', 'F']
        },
        {
           input: [{ '1': ['2'], '2': ['3'], '3': [] }, '1'],
           expected: ['1', '2', '3']
        }
      ],
      hints: [
          "Use a Queue data structure (array with push/shift) to store nodes.",
          "Keep track of visited nodes (Set) to avoid processing them twice.",
          "Start by pushing the `startNode` into the queue and marking it visited.",
          "Loop while the queue is not empty, dequeue a node, add it to result, and enqueue its unvisited neighbors."
      ]
    },
    {
      name: 'Depth-First Search',
      category: 'Graph traversal',
      complexity: 'O(V + E)',
      idea: 'Go deep with a stack/recursion to explore paths.',
      explanation: "Depth-First Search (DFS) is the opposite of BFS: it dives as deep as possible into one branch before backtracking. Think of solving a maze: you keep walking down a path until you hit a dead end, then you walk back to the last intersection and try a different path.\n\nIn computing terms, DFS uses a **Stack** (LIFO - Last In, First Out). The most recently discovered node is the one we visit next. This is naturally implemented using recursion (the call stack) or an explicit stack data structure.\n\nKey Mechanisms:\n1. **Stack (LIFO)**: Stores nodes to visit. Popping the newest element drives us deeper into the current path.\n2. **Backtracking**: When we run out of new neighbors, we retreat (pop from stack) to find unexplored branches.",
      visualization: {
        type: 'interactive',
        component: 'DfsInteractive',
        title: 'Interactive DFS Traversal',
        summary: 'Watch the stack drive the search deep into the graph.'
      },
      starterCode: `/**
 * Depth-First Search Implementation
 * 
 * Implement the DFS algorithm to traverse a graph.
 * 
 * Instructions:
 * 1. Return an array of nodes in the order they were visited.
 * 2. Start from the given 'startNode'.
 * 3. Use the 'graph' adjacency list.
 */

class DepthFirstSearch {
    solve(graph: Record<string, string[]>, startNode: string): string[] {
        const visited = new Set<string>();
        const result: string[] = [];
        
        // TODO: Implement DFS (Recursive or Iterative)
        
        return result;
    }
}

// Example usage
const graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
};
const dfs = new DepthFirstSearch();
console.log(dfs.solve(graph, 'A'));`,
      testCases: [
          {
              input: [{ 'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': ['F'], 'F': [] }, 'A'],
              expected: ['A', 'B', 'D', 'E', 'F', 'C'] // Note: Order depends on neighbor order/implementation (stack vs recursion). This assumes standard left-to-right neighbor visitation.
              // We might need to be lenient with order in tests or specify "Sort neighbors alphabetically" in instructions if we want strict equality.
              // For now, let's assume the user visits neighbors in list order.
          }
      ]
    },
    {
      name: 'Dijkstra',
      category: 'Shortest path',
      complexity: 'O((V + E) log V)',
      idea: 'Greedily relax edges using a priority queue to find shortest paths.',
      explanation: "Dijkstra's Algorithm finds the shortest path from a starting node to every other node in a weighted graph. It's like GPS navigation: finding the quickest route on a map where roads have different speed limits.\n\nIt works by always picking the 'closest' unvisited node next (using a Priority Queue). Once at that node, it checks all neighbors to see if it found a shortcut to them. If it did, it updates their distance. This process is called 'Relaxation'.\n\nKey Mechanisms:\n1. **Priority Queue**: Keeps nodes ordered by their current known distance from the start.\n2. **Relaxation**: Checking if `Distance(Current) + Weight(Edge) < Distance(Neighbor)`. If yes, we found a better way!",
      visualization: {
        type: 'interactive',
        component: 'DijkstraInteractive',
        title: 'Interactive Shortest Path',
        summary: 'Relax edges and watch the shortest paths emerge.'
      },
      starterCode: `/**
 * Dijkstra's Algorithm Implementation
 * 
 * Find the shortest distances from the startNode to all other nodes.
 * 
 * Instructions:
 * 1. Return an object where keys are node names and values are the shortest distance from startNode.
 * 2. If a node is unreachable, you can omit it or use Infinity.
 * 3. The graph is given as: { Node: { Neighbor: Weight, ... }, ... }
 */

class Dijkstra {
    solve(graph: Record<string, Record<string, number>>, startNode: string): Record<string, number> {
        const distances: Record<string, number> = {};
        
        // TODO: Implement Dijkstra's Algorithm
        
        return distances;
    }
}

// Example usage
const weightedGraph = {
    'A': { 'B': 1, 'C': 4 },
    'B': { 'C': 2, 'D': 5 },
    'C': { 'D': 1 },
    'D': {}
};
const dijkstra = new Dijkstra();
console.log(dijkstra.solve(weightedGraph, 'A'));`,
      testCases: [
          {
              input: [{ 'A': { 'B': 1, 'C': 4 }, 'B': { 'C': 2, 'D': 5 }, 'C': { 'D': 1 }, 'D': {} }, 'A'],
              expected: { 'A': 0, 'B': 1, 'C': 3, 'D': 4 }
          }
      ]
    },
    {
      name: 'A* Search',
      category: 'Shortest path',
      complexity: 'O((V + E) log V)',
      idea: 'Dijkstra enhanced with a heuristic that prioritizes promising nodes.',
      explanation: "A* (A-Star) Search works just like Dijkstra's, but it's 'smarter' because it guesses which direction looks most promising. It uses a **Heuristic (h)**—an estimate of the distance remaining to the goal.\n\nPriority is determined by `f = g + h`:\n- `g`: Cost so far (from start).\n- `h`: Estimated cost to goal.\n\nBy minimizing `f`, A* tries to find the shortest path (`g`) while favoring nodes that appear closer to the destination (`h`). This prevents the algorithm from wasting time exploring paths moving away from the goal.",
      visualization: {
        type: 'interactive',
        component: 'AStarInteractive',
        title: 'Interactive A* Search',
        summary: 'See how the heuristic guides the search toward the goal.'
      },
      starterCode: `/**
 * A* Search Implementation
 * 
 * Find the shortest path from startNode to goalNode.
 * 
 * Instructions:
 * 1. Return an array of nodes representing the path (e.g., ['A', 'B', 'Goal']).
 * 2. Use the provided 'heuristic' function to estimate cost.
 * 3. Graph format: { Node: { Neighbor: Weight } }
 * 4. Heuristics: { Node: EstimatedCost }
 */

class AStar {
    solve(
        graph: Record<string, Record<string, number>>, 
        heuristics: Record<string, number>,
        startNode: string, 
        goalNode: string
    ): string[] {
        // TODO: Implement A* Search
        return [];
    }
}

// Example usage
const graph = {
    'A': { 'B': 1, 'C': 3 },
    'B': { 'D': 1 },
    'C': { 'D': 1 },
    'D': {}
};
// Heuristic (distance to D)
const h = { 'A': 2, 'B': 1, 'C': 1, 'D': 0 };

const astar = new AStar();
console.log(astar.solve(graph, h, 'A', 'D'));`,
      testCases: [
          {
              input: [
                  { 'A': { 'B': 1, 'C': 3 }, 'B': { 'D': 4 }, 'C': { 'D': 1 }, 'D': {} },
                  { 'A': 2, 'B': 2, 'C': 1, 'D': 0 },
                  'A',
                  'D'
              ],
              expected: ['A', 'C', 'D']
          }
      ]
    },
    {
      name: 'Merge Sort',
      category: 'Sorting',
      complexity: 'O(n log n)',
      idea: 'Divide and conquer by sorting halves then merging.',
      explanation: "Merge Sort uses the 'Divide and Conquer' strategy. It breaks a big list into two smaller halves, recursively sorts those halves, and then 'merges' them back together in the correct order.\n\nThink of it like sorting a deck of cards: split the deck in half, give each half to a friend to sort, and when they return the sorted piles, you just pick the smallest top card from either pile to build your final sorted deck.\n\nKey Steps:\n1. **Divide**: Split array in half until you have arrays of size 1 (which are trivially sorted).\n2. **Conquer (Merge)**: Stitch two sorted arrays into one larger sorted array by comparing their front elements.",
      visualization: {
        type: 'interactive',
        component: 'MergeSortInteractive',
        title: 'Interactive Merge Sort',
        summary: 'Recursive splitting and merging in action.'
      },
      starterCode: `/**
 * Merge Sort Implementation
 * 
 * Sort an array of numbers using the Merge Sort algorithm.
 * 
 * Instructions:
 * 1. Implement 'sort(arr)' which returns a sorted array.
 * 2. You should probably use a helper method 'merge(left, right)'.
 */

class MergeSort {
    sort(arr: number[]): number[] {
        if (arr.length <= 1) return arr;
        
        // TODO: Split the array, recursively sort, and merge
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        
        return this.merge(this.sort(left), this.sort(right));
    }
    
    private merge(left: number[], right: number[]): number[] {
        const result: number[] = [];
        // TODO: Implement the merge logic
        return result;
    }
}

// Example usage
const sorter = new MergeSort();
console.log(sorter.sort([5, 3, 8, 1, 2]));`,
      testCases: [
          { input: [[5, 3, 8, 1, 2]], expected: [1, 2, 3, 5, 8] },
          { input: [[10, -1, 0]], expected: [-1, 0, 10] },
          { input: [[]], expected: [] }
      ]
    },
    {
      name: 'Quick Sort',
      category: 'Sorting',
      complexity: 'O(n log n) average',
      idea: 'Partition around a pivot so smaller elements go left and larger go right.',
      explanation: "Quick Sort is a Divide and Conquer algorithm that sorts 'in-place'. The key idea is **Partitioning**:\n1. Pick a 'Pivot' element (e.g., the last item).\n2. Rearrange the array so that everything smaller than the pivot moves to the left, and everything larger moves to the right.\n3. The pivot is now in its final, correct sorted position.\n4. Recursively repeat this for the left and right sides.\n\nIt's called 'Quick' because it's usually faster than Merge Sort in practice due to better cache locality, even though its worst-case scenario is O(n²).",
      visualization: {
        type: 'interactive',
        component: 'QuickSortInteractive',
        title: 'Interactive Quick Sort',
        summary: 'Watch partitioning in action: Pivots find their place.'
      },
      starterCode: `/**
 * Quick Sort Implementation
 * 
 * Sort an array using the Quick Sort algorithm.
 * 
 * Instructions:
 * 1. Implement 'sort(arr)'.
 * 2. Pick a pivot (e.g., last element).
 * 3. Partition the array into 'smaller than pivot' and 'larger than pivot'.
 * 4. Recursively sort the partitions.
 */

class QuickSort {
    sort(arr: number[]): number[] {
        if (arr.length <= 1) return arr;
        
        // TODO: Implement Quick Sort
        // Hint: You can do it in-place or create new arrays.
        // For simplicity in this playground, returning a new array is fine.
        
        const pivot = arr[arr.length - 1];
        const left: number[] = [];
        const right: number[] = [];
        
        // Partition logic here
        
        return [...this.sort(left), pivot, ...this.sort(right)];
    }
}

// Example usage
const qs = new QuickSort();
console.log(qs.sort([10, 5, 2, 3]));`,
      testCases: [
          { input: [[10, 5, 2, 3]], expected: [2, 3, 5, 10] },
          { input: [[1, 2, 3]], expected: [1, 2, 3] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] }
      ]
    },
    {
      name: 'Union-Find',
      category: 'Disjoint sets',
      complexity: 'Amortized near O(1)',
      idea: 'Track connected components with path compression and union by rank.',
      explanation: "Union-Find (or Disjoint Set Union - DSU) tracks which elements belong to the same set. It's heavily used in network connectivity, Kruskal's algorithm, and image processing.\n\nTwo main operations:\n1. **Find(x)**: Figures out which 'team' (representative root) element x belongs to.\n2. **Union(x, y)**: Merges the team of x and the team of y into one.\n\nOptimizations like **Path Compression** (flattening the tree during a Find) and **Union by Rank** (attaching smaller trees to taller trees) make this structure incredibly efficient, nearly constant time.",
      visualization: {
        type: 'interactive',
        component: 'UnionFindInteractive',
        title: 'Interactive DSU',
        summary: 'Merge sets and watch them unite under common roots.'
      },
      starterCode: `/**
 * Union-Find (Disjoint Set) Implementation
 * 
 * Implement the Union-Find data structure.
 * 
 * Instructions:
 * 1. 'find(i)': Return the root of element i.
 * 2. 'union(i, j)': Merge the sets containing i and j.
 * 3. 'connected(i, j)': Return true if i and j are in the same set.
 * 4. Constructor should initialize 'n' elements (0 to n-1).
 */

class UnionFind {
    private parent: number[];

    constructor(n: number = 10) {
        this.parent = Array.from({ length: n }, (_, i) => i);
    }

    find(i: number): number {
        // TODO: Implement path compression for efficiency
        if (this.parent[i] === i) {
            return i;
        }
        return this.find(this.parent[i]);
    }

    union(i: number, j: number): void {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ;
        }
    }

    connected(i: number, j: number): boolean {
        return this.find(i) === this.find(j);
    }
    
    // For the test harness to run a sequence of operations
    // Input: ['union', 0, 1], ['connected', 0, 1] ...
    // This is a bit tricky for our standard harness. 
    // Let's expose a 'run' method that takes a list of operations.
    execute(ops: [string, number, number][]): boolean[] {
        const results: boolean[] = [];
        for (const op of ops) {
            const [type, a, b] = op;
            if (type === 'union') {
                this.union(a, b);
            } else if (type === 'connected') {
                results.push(this.connected(a, b));
            }
        }
        return results;
    }
}

// Example usage
const uf = new UnionFind(10);
uf.union(0, 1);
console.log("0 and 1 connected?", uf.connected(0, 1));`,
      testCases: [
          {
              input: [[['union', 0, 1], ['connected', 0, 1], ['connected', 0, 2]]],
              expected: [true, false]
          },
          {
              input: [[['union', 0, 1], ['union', 1, 2], ['connected', 0, 2]]],
              expected: [true]
          }
      ]
    },
    {
      name: 'Topological Sort',
      category: 'Graph ordering',
      complexity: 'O(V + E)',
      idea: 'Linear order of DAG nodes produced via DFS or Kahn’s algorithm.',
      explanation: "Topological Sorting is like scheduling a series of tasks that have dependencies. If Task B requires Task A (A -> B), you must complete A before B.\n\nA common way to solve this is **Kahn's Algorithm**:\n1. Count the 'in-degree' (number of prerequisites) for every node. \n2. Find nodes with 0 prerequisites. These are ready to be done!\n3. 'Do' those tasks (remove them), which might free up new tasks (decrement neighbors' in-degrees).\n4. Repeat until everyone is scheduled.",
      visualization: {
        type: 'interactive',
        component: 'TopologicalSortInteractive',
        title: 'Interactive Kahn’s Algorithm',
        summary: 'Peel off nodes with zero dependencies.'
      },
      starterCode: `/**
 * Topological Sort Implementation
 * 
 * Sort the nodes of a Directed Acyclic Graph (DAG) linearly.
 * 
 * Instructions:
 * 1. Return an array of nodes in topological order.
 * 2. If the graph has a cycle, you might return an empty array or handle error.
 * 3. Input graph: Adjacency list { Node: [Neighbors] }
 */

class TopologicalSort {
    solve(graph: Record<string, string[]>): string[] {
        const inDegree: Record<string, number> = {};
        const result: string[] = [];
        
        // TODO: Calc in-degrees
        // TODO: Find 0-degree nodes
        // TODO: Process queue (Kahn's Algorithm)
        
        return result;
    }
}

// Example usage
const dag = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D'],
    'D': []
};
const topo = new TopologicalSort();
console.log(topo.solve(dag));`,
      testCases: [
          { 
              input: [{ 'A': ['B'], 'B': ['C'], 'C': [] }], 
              expected: ['A', 'B', 'C'] 
          },
          {
              input: [{ 'Task1': ['Task2', 'Task3'], 'Task2': [], 'Task3': [] }],
              // Note: Order of 'Task2' and 'Task3' can vary. 
              // Without a custom comparator in the runner, we might need a test case that forces order or accepts variances (not supported yet).
              // Let's rely on a strictly linear case or a standard queue behavior (insertion order).
              // If user pushes Task2 then Task3, result is T1, T2, T3.
              expected: ['Task1', 'Task2', 'Task3'] 
          }
      ]
    },
    {
      name: 'Knuth-Morris-Pratt',
      category: 'String matching',
      complexity: 'O(n + m)',
      idea: 'Preprocess pattern to skip redundant comparisons.',
      explanation: "The Knuth-Morris-Pratt (KMP) algorithm efficiently searches for occurrences of a 'Pattern' within a 'Text'.\n\nUnlike a naive search that resets completely on a mismatch, KMP uses a precomputed table (called the Failure Function or LPM table) to skip ahead. This table tells us: 'If we mismatch here, what's the longest prefix of the pattern that still matches the text?'\n\nThis prevents re-scanning characters in the Text that we've already matched, ensuring we move linearly through the input.",
      visualization: {
        type: 'interactive',
        component: 'KMPInteractive',
        title: 'Interactive KMP Search',
        summary: 'Skip redundant comparisons using the failure table.'
      },
      starterCode: `/**
 * Knuth-Morris-Pratt (KMP) Search
 * 
 * Find the starting index of a pattern in a text.
 * 
 * Instructions:
 * 1. Return the index of the first occurrence of 'pattern' in 'text'.
 * 2. Return -1 if not found.
 * 3. Implement the 'computeLPS' helper for the failure table.
 */

class KMP {
    search(text: string, pattern: string): number {
        if (pattern.length === 0) return 0;
        
        const lps = this.computeLPS(pattern);
        // TODO: Implement KMP search
        
        return -1;
    }
    
    private computeLPS(pattern: string): number[] {
        const lps: number[] = new Array(pattern.length).fill(0);
        // TODO: Build LPS table
        return lps;
    }
}

// Example usage
const kmp = new KMP();
console.log(kmp.search("ABABDABACDABABCABAB", "ABABCABAB"));`,
      testCases: [
          { input: ["HELLO WORLD", "WORLD"], expected: 6 },
          { input: ["AABAACAADAABAABA", "AABA"], expected: 0 },
          { input: ["abc", "def"], expected: -1 }
      ]
    },
    {
      name: 'Dynamic Programming (Fibonacci)',
      category: 'Optimization',
      complexity: 'O(n)',
      idea: 'Cache sub-results to avoid repeated work.',
      explanation: "Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems and storing their solutions to avoid re-computing them.\n\nCalculating the Fibonacci sequence is a classic example. Optimally, it's computed 'Bottom-Up':\n1. Start with the base cases: F(0)=0, F(1)=1.\n2. Compute F(2) using F(0) and F(1).\n3. Compute F(3) using F(1) and F(2).\n4. Continue until F(n) is found.\n\nThis turns an exponential O(2^n) recursion tree into a linear O(n) scan.",
      visualization: {
         type: 'interactive',
         component: 'FibonacciInteractive',
         title: 'Interactive DP Table',
         summary: 'Build the solution from the ground up.'
      },
      starterCode: `/**
 * Fibonacci Sequence (Dynamic Programming)
 * 
 * Calculate the nth Fibonacci number.
 * 
 * Instructions:
 * 1. Return the nth number in the sequence: 0, 1, 1, 2, 3, 5...
 * 2. Use memoization or tabulation to optimize to O(n).
 */

class Fibonacci {
    solve(n: number): number {
        if (n <= 1) return n;
        
        const dp: number[] = new Array(n + 1).fill(0);
        dp[1] = 1;
        
        // TODO: Fill DP table
        
        return dp[n];
    }
}

// Example usage
const fib = new Fibonacci();
console.log("Fib(10) =", fib.solve(10));`,
      testCases: [
          { input: [0], expected: 0 },
          { input: [1], expected: 1 },
          { input: [2], expected: 1 },
          { input: [10], expected: 55 }
      ]
    }
  ],
  'DS&A'
);


export const designPatterns: CatalogItem[] = normalizeItems(
  [
    {
      name: 'Singleton',
      category: 'Creational',
      intent: 'Ensure a class has a single instance and a global access point.',
      idea: 'Guard instantiation with a private constructor and hand out one shared object.',
      explanation: "The Singleton pattern ensures that a class has only one instance and provides a global point of access to it. It's like a government registry or a printer spooler—you don't want multiple conflicting copies running around; you need exactly one source of truth.\n\nIn code, this is achieved by:\n1. Making the constructor private so no one can simply say `new Singleton()`.\n2. Creating a static method (often named `getInstance()`) that acts as the gatekeeper.\n3. Storing the single instance in a private static variable.\n\nWhen `getInstance()` is called, it checks if the instance already exists. If not, it creates it. If it does, it simply returns the existing one. This 'lazy initialization' saves resources if the object is never needed.",
      visualization: {
        type: 'interactive',
        component: 'SingletonInteractive',
        title: 'Interactive Singleton Lifecycle',
        summary: 'Click to see how the instance is lazily created and reused.'
      },
      starterCode: `/**
 * Singleton Pattern Implementation
 * 
 * Ensure that the Singleton class has only one instance and provide a global point of access to it.
 */

class Singleton {
    private static instance: Singleton;

    // TODO: Make the constructor private to prevent direct instantiation
    constructor() {
        console.log("New instance created!");
    }

    public static getInstance(): Singleton {
         // TODO: Implement the lazy initialization logic
         if (!Singleton.instance) {
             Singleton.instance = new Singleton();
         }
         return Singleton.instance;
    }

    public someBusinessLogic(): void {
        console.log("Executing logic on the singleton instance.");
    }
}

// Example usage
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();

if (s1 === s2) {
    console.log("Singleton works, both variables contain the same instance.");
} else {
    console.log("Singleton failed, variables contain different instances.");
}`,
      testCases: [
          {
              input: [],
              expected: true 
          }
      ]
    },
    {
      name: 'Factory Method',
      category: 'Creational',
      intent: 'Create objects via subclass-chosen factories to decouple construction.',
      idea: 'Base class defines the creation hook, subclasses pick the concrete product.',
      explanation: "The Factory Method pattern defines an interface for creating an object, but lets subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.\n\nImagine a logistics company. At first, you only handle trucks. So you put all your code inside a `RoadLogistics` class. But then you expand to sea freight. Adding `Ship` logic into `RoadLogistics` would be messy.\n\nInstead, you define a `createTransport()` method. \n- `RoadLogistics` implements it to return a `Truck`.\n- `SeaLogistics` implements it to return a `Ship`.\n\nThe client code (which calls `createTransport()`) doesn't care if it gets a truck or a ship—it just knows it gets a 'Transport' that can 'deliver'. This is polymorphism in action for object creation.",
      visualization: {
        type: 'interactive',
        component: 'FactoryMethodInteractive',
        title: 'Interactive Logistics Factory',
        summary: 'Switch creators to produce different transports.'
      },
      starterCode: `/**
 * Factory Method Pattern
 * 
 * Define an interface for creating an object, but let subclasses decide which class to instantiate.
 * 
 * Instructions:
 * 1. Implement 'createTransport()' in RoadLogistics to return a Truck.
 * 2. Implement 'createTransport()' in SeaLogistics to return a Ship.
 * 3. The 'deliver()' method is shared but relies on the created transport.
 */

interface Transport {
    deliver(): string;
}

class Truck implements Transport {
    deliver(): string { return "Delivering by land in a box"; }
}

class Ship implements Transport {
    deliver(): string { return "Delivering by sea in a container"; }
}

abstract class Logistics {
    // TODO: Define the factory method
    abstract createTransport(): Transport;

    planDelivery(): string {
        const transport = this.createTransport();
        return "Logistics: " + transport.deliver();
    }
}

class RoadLogistics extends Logistics {
    createTransport(): Transport {
        // TODO: Return a Truck
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    createTransport(): Transport {
        // TODO: Return a Ship
        return new Ship();
    }
}

// Example usage
const road = new RoadLogistics();
console.log(road.planDelivery());`,
      testCases: [
          {
              input: [], // Our current runner is too simple for multi-class structure testing easily without a wrapper.
              // Let's adjust starter code to have a 'Solution' class that returns the factories?
              // Or just test RoadLogistics if it's the first class?
              // Let's modify starter code to put 'App' or 'Main' class first? 
              // Or just keep it simple: "Implement RoadLogistics" -> `class RoadLogistics ...`
              expected: "Logistics: Delivering by land in a box"
          }
      ] 
      // NOTE: Our current runner is too simple for multi-class structure testing easily without a wrapper.
      // Let's adjust starter code to have a 'Solution' class that returns the factories?
      // Or just test RoadLogistics if it's the first class?
      // Let's modify starter code to put 'App' or 'Main' class first? 
      // Or just keep it simple: "Implement RoadLogistics" -> `class RoadLogistics ...`

    },
    {
      name: 'Abstract Factory',
      category: 'Creational',
      intent: 'Provide families of related objects without specifying concrete classes.',
      idea: 'Expose a suite of creation methods so variants stay consistent.',
      explanation: "Abstract Factory is like a 'Super Factory' that creates other factories. It's useful when you have families of related products (e.g., Chair + Sofa + Table) and you need to ensure they all match a specific theme (e.g., 'Modern' vs 'Victorian') without mixing them up.\n\nThe code defines an interface (Abstract Factory) with methods like `createChair()` and `createSofa()`. \n- A `ModernFactory` class implements these to return Modern chairs/sofas.\n- A `VictorianFactory` class implements them to return Victorian ones.\n\nThe client code works with the abstract interface, so it doesn't care which style it's currently producing, but it's guaranteed that `createChair()` and `createSofa()` will return matching items.",
      visualization: {
         type: 'interactive',
         component: 'AbstractFactoryInteractive',
         title: 'Interactive Furniture Factory',
         summary: 'Create matching families of products (Modern vs Victorian).'
      },
      starterCode: `/**
 * Abstract Factory Pattern
 * 
 * Provide an interface for creating families of related or dependent objects without specifying their concrete classes.
 */

interface Chair { hasLegs(): boolean; sitOn(): string; }
interface Sofa { hasLegs(): boolean; sitOn(): string; }

class ModernChair implements Chair {
    hasLegs() { return false; }
    sitOn() { return "Sitting on a modern chair"; }
}
class VictorianChair implements Chair {
    hasLegs() { return true; }
    sitOn() { return "Sitting on a victorian chair"; }
}

// TODO: Define Abstract Factory Interface
// TODO: Implement Concrete Factories (ModernFurnitureFactory, VictorianFurnitureFactory)

class Client {
    private factory: any; // Use the interface type
    
    constructor(factory: any) {
        this.factory = factory;
    }
    
    describeFurniture(): string {
        const chair = this.factory.createChair();
        return chair.sitOn();
    }
}

// Main class to run
class AbstractFactoryDemo {
    run(type: 'modern' | 'victorian'): string {
        // TODO: Return description based on type
        return "";
    }
}`,
      testCases: [
          { input: ['modern'], expected: "Sitting on a modern chair" },
          { input: ['victorian'], expected: "Sitting on a victorian chair" }
      ]
    },
    {
      name: 'Builder',
      category: 'Creational',
      intent: 'Construct complex objects step by step while controlling representation.',
      idea: 'Directors orchestrate ordered steps while builders decide how parts materialize.',
      explanation: "The Builder pattern is about constructing complex objects step by step. It separates the construction of a complex object from its representation, so the same construction process can create different representations.\n\nThink of a custom PC configuration. A 'Gaming Computer' has a specific CPU, GPU, and RAM. Instead of a massive constructor like `new Computer('i9', 'ROX-4090', '32GB', '1TB', 'RGB-Case', ...)`, which is hard to read and prone to errors, you use a Builder.\n\n`new ComputerBuilder().setCPU('i9').setGPU('4090').build()`\n\nThis makes the code fluent, readable, and flexible. You can build objects with different combinations of parts without needing dozens of constructor overloads.",
      visualization: {
        type: 'interactive',
        component: 'BuilderInteractive',
        title: 'Interactive PC Builder',
        summary: 'Assemble a custom PC step-by-step using a fluent API.'
      },
      starterCode: `/**
 * Builder Pattern
 * 
 * Separte the construction of a complex object from its representation.
 */

class Computer {
    parts: string[] = [];
    add(part: string) { this.parts.push(part); }
    show() { return this.parts.join(', '); }
}

class ComputerBuilder {
    private computer: Computer;
    
    constructor() {
        this.computer = new Computer();
    }
    
    // TODO: Implement fluent methods for setCPU, setGPU, setRAM
    setCPU(cpu: string): ComputerBuilder {
        this.computer.add("CPU: " + cpu);
        return this;
    }
    
    setGPU(gpu: string): ComputerBuilder {
        this.computer.add("GPU: " + gpu);
        return this;
    }
    
    build(): Computer {
        return this.computer;
    }
}

class Director {
    constructGamingPC(builder: ComputerBuilder) {
        return builder.setCPU("i9").setGPU("RTX 4090").build();
    }
}

// Main class
class BuilderDemo {
    execute(): string {
        const builder = new ComputerBuilder();
        const director = new Director();
        const pc = director.constructGamingPC(builder);
        return pc.show();
    }
}`,
       testCases: [
           { input: [], expected: "CPU: i9, GPU: RTX 4090" }
       ]
    },
    {
      name: 'Prototype',
      category: 'Creational',
      intent: 'Clone existing objects instead of instantiating new ones.',
      idea: 'Copy an initialized exemplar to skip repetitive setup.',
      explanation: "The Prototype pattern allows you to create new objects by copying an existing one (the prototype). It's essentially 'Cloning'.\n\nThis is particularly useful when:\n1. Creating an object is expensive (e.g., database calls or heavy computation).\n2. You want to avoid subclassing just to create objects with different configurations.\n\nInstead of `new Object(configA, configB, configC...)`, you just say `original.clone()`. The clone starts with the exact state of the original but is a separate instance. You can then tweak the clone without affecting the original.",
      visualization: {
        type: 'interactive',
        component: 'PrototypeInteractive',
        title: 'Interactive Cloning Machine',
        summary: 'Configure a prototype and spawn independent clones.'
      },
      starterCode: `/**
 * Prototype Pattern
 * 
 * Specify the kinds of objects to create using a prototypical instance, 
 * and create new objects by copying this prototype.
 */

interface Prototype {
    clone(): Prototype;
}

class Robot implements Prototype {
    public name: string;
    public type: string;
    
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
    
    clone(): Robot {
        // TODO: Implement clone (shallow copy)
        // return new Robot(this.name, this.type);
        // OR using Object.assign or similar (be careful with methods)
        const clone = Object.create(this);
        clone.name = this.name + " (Copy)";
        return clone;
    }
}

// Main class
class PrototypeDemo {
    run(): string {
        const original = new Robot("R2", "Astromech");
        const copy = original.clone();
        return copy.name;
    }
}`,
      testCases: [
          { input: [], expected: "R2 (Copy)" } // Assuming starter code logic
      ]
    },
    {
      name: 'Adapter',
      category: 'Structural',
      intent: 'Convert one interface into another that clients expect.',
      idea: 'Wrap an incompatible object so its methods match the target contract.',
      explanation: "The Adapter pattern (also known as Wrapper) allows objects with incompatible interfaces to collaborate. It acts like a bridge/translator between two objects.\n\nAnalogy: You're in Europe with a US laptop. The plug (Client Interface) doesn't fit the wall socket (Service Interface). You use a Power Adapter. The adapter catches your US plug and fits into the EU socket.\n\nIn code:\n- **Client** wants to call `roundPeg.getRadius()`.\n- **Service** (SquarePeg) only has `getWidth()`.\n- **Adapter** implements `roundPeg`, but inside `getRadius()`, it does the math to translate it to `squarePeg.getWidth()`.",
      visualization: {
        type: 'interactive',
        component: 'AdapterInteractive',
        title: 'Interactive Plug Adapter',
        summary: 'Fit a Square Peg into a Round Hole using an Adapter.'
      },
      starterCode: `/**
 * Adapter Pattern
 * 
 * Convert the interface of a class into another interface clients expect.
 */

interface RoundHole {
    getRadius(): number;
    fits(peg: RoundPeg): boolean;
}

class RoundPeg {
    constructor(private radius: number) {}
    getRadius() { return this.radius; }
}

class SquarePeg {
    constructor(private width: number) {}
    getWidth() { return this.width; }
}

// TODO: Implement an adapter that makes a SquarePeg look like a RoundPeg
class SquarePegAdapter extends RoundPeg {
    private peg: SquarePeg;
    
    constructor(peg: SquarePeg) {
        super(0); // Dummy call
        this.peg = peg;
    }
    
    getRadius(): number {
        // Width * sqrt(2) / 2 matches the fitting logic if it's the diagonal
        // Or simply width / 2?
        // Let's say fits roughly by diagonal: w * Math.sqrt(2) / 2
        return this.peg.getWidth() * Math.sqrt(2) / 2;
    }
}

// Main class
class AdapterDemo {
    run(holeRadius: number, squareWidth: number): boolean {
        const hole = {
            getRadius: () => holeRadius,
            fits: (peg: RoundPeg) => holeRadius >= peg.getRadius()
        };
        
        const squarePeg = new SquarePeg(squareWidth);
        const adapter = new SquarePegAdapter(squarePeg);
        
        return hole.fits(adapter);
    }
}`,
      testCases: [
           { input: [5, 5], expected: true }, // Hole r=5, Square w=5 (diag/2 ~= 3.5) -> Fits
           { input: [5, 10], expected: false } // Hole r=5, Square w=10 (diag/2 ~= 7.1) -> Fails
      ]
    },
    {
      name: 'Bridge',
      category: 'Structural',
      intent: 'Decouple abstraction from implementation so both can vary independently.',
      idea: 'Split what you do (abstraction) from how it is done (implementor).',
      explanation: "The Bridge pattern splits a large class or a set of closely related classes into two separate hierarchies—Abstraction and Implementation—which can be developed independently.\n\nThink of a 'Remote Control' (Abstraction) and a 'Device' (Implementation).\n\n- You can have `BasicRemote` or `AdvancedRemote`.\n- You can have `TV` or `Radio`.\n\nInstead of creating `BasicRemoteForTV`, `AdvancedRemoteForTV`, `BasicRemoteForRadio`, etc. (Cartesian product of classes), the Remote just holds a reference to a `Device` interface. The remote calls `device.turnOn()`. It doesn't care if it's a TV or Radio.",
      visualization: {
         type: 'interactive',
         component: 'BridgeInteractive',
         title: 'Remote <-> Device Bridge',
         summary: 'Pair different remotes with different devices independently.'
      },
      starterCode: `/**
 * Bridge Pattern
 * 
 * Decouple an abstraction from its implementation so that the two can vary independently.
 */

// Implementation Interface
interface Device {
    isEnabled(): boolean;
    enable(): void;
    disable(): void;
    getVolume(): number;
    setVolume(percent: number): void;
}

class Radio implements Device {
    private on = false;
    private volume = 30;
    isEnabled() { return this.on; }
    enable() { this.on = true; }
    disable() { this.on = false; }
    getVolume() { return this.volume; }
    setVolume(percent: number) { this.volume = percent; }
}

// Abstraction
class RemoteControl {
    protected device: Device;
    
    constructor(device: Device) {
        this.device = device;
    }
    
    togglePower() {
        if (this.device.isEnabled()) this.device.disable();
        else this.device.enable();
    }
}

class AdvancedRemote extends RemoteControl {
    mute() {
        this.device.setVolume(0);
    }
}

// Main class
class BridgeDemo {
    run(): number {
        const radio = new Radio();
        const remote = new AdvancedRemote(radio);
        remote.togglePower(); // On
        remote.mute(); // Vol 0
        return radio.getVolume();
    }
}`,
      testCases: [
          { input: [], expected: 0 }
      ]
    },
    {
      name: 'Composite',
      category: 'Structural',
      intent: 'Treat part-whole object hierarchies uniformly.',
      idea: 'Leaves and containers share the same interface so operations recurse naturally.',
      explanation: "The Composite pattern lets you compose objects into tree structures to represent part-whole hierarchies. It allows clients to treat individual objects (leaves) and compositions of objects (composites) uniformly.\n\nA classic example is a File System. A `Folder` contains Files or other Folders. If you want to know the size of a Folder, you don't iterate manually. You just call `.getSize()` on the Folder, and it recursively asks all its children (Files or sub-Folders) for their `.getSize()`.\n\nThe client code doesn't get bogged down with `if (node is Folder) ... else ...`. It just treats everything as a `FileSystemNode`.",
      visualization: {
        type: 'interactive',
        component: 'CompositeInteractive',
        title: 'Recursive File System',
        summary: 'Operations propagate from root to leaves uniformly.'
      },
      starterCode: `/**
 * Composite Pattern
 * 
 * Compose objects into tree structures to represent part-whole hierarchies.
 */

interface FileSystemNode {
    getSize(): number;
}

class FileNode implements FileSystemNode {
    constructor(private size: number) {}
    getSize() { return this.size; }
}

class FolderNode implements FileSystemNode {
    private children: FileSystemNode[] = [];
    
    add(child: FileSystemNode) {
        this.children.push(child);
    }
    
    getSize(): number {
        // TODO: Recursively sum size of children
        return this.children.reduce((acc, child) => acc + child.getSize(), 0);
    }
}

// Main class
class CompositeDemo {
    run(): number {
        const root = new FolderNode();
        const f1 = new FileNode(10);
        const sub = new FolderNode();
        const f2 = new FileNode(5);
        
        sub.add(f2);
        root.add(f1);
        root.add(sub);
        
        return root.getSize();
    }
}`,
      testCases: [
          { input: [], expected: 15 } // 10 + 5
      ]
    },
    {
      name: 'Decorator',
      category: 'Structural',
      intent: 'Attach responsibilities dynamically without altering the original class.',
      idea: 'Wrap components in layers that add behavior before/after delegating.',
      explanation: "The Decorator pattern lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors.\n\nImagine you run a coffee shop. You have a `Coffee` class. Customers want Milk, Sugar, Whip, etc. Creating subclasses like `CoffeeWithMilk`, `CoffeeWithMilkAndSugar` leads to a class explosion.\n\nInstead, you treat `Milk` and `Sugar` as **Decorators**. They wrap the base coffee.\n- `Milk(Coffee)` is still a `Coffee`.\n- `Whip(Milk(Coffee))` is also a `Coffee`.\n\nWhen you ask for the cost, the 'Whip' adds its price and then asks the 'Milk', which adds its price and asks the 'Coffee'.",
      visualization: {
        type: 'interactive',
        component: 'DecoratorInteractive',
        title: 'Coffee Builder',
        summary: 'Wrap a base object with layers of behavior (or flavor!).'
      },
      starterCode: `/**
 * Decorator Pattern
 * 
 * Attach additional responsibilities to an object dynamically.
 */

interface Coffee {
    cost(): number;
}

class SimpleCoffee implements Coffee {
    cost() { return 5; }
}

class CoffeeDecorator implements Coffee {
    constructor(protected coffee: Coffee) {}
    cost() { return this.coffee.cost(); }
}

class Milk extends CoffeeDecorator {
    cost() { return super.cost() + 2; }
}

class Whip extends CoffeeDecorator {
    cost() { return super.cost() + 3; }
}

// Main class
class DecoratorDemo {
    run(): number {
        let myCoffee = new SimpleCoffee();
        // TODO: Decorate with Milk, then Whip
        myCoffee = new Milk(myCoffee);
        myCoffee = new Whip(myCoffee);
        return myCoffee.cost();
    }
}`,
      testCases: [
          { input: [], expected: 10 } // 5 + 2 + 3
      ]
    },
    {
      name: 'Facade',
      category: 'Structural',
      intent: 'Provide a simplified interface to a subsystem.',
      idea: 'One high-level API coordinates a set of complex or verbose calls.',
      explanation: "The Facade pattern provides a simplified interface to a library, a framework, or any other complex set of classes.\n\nAnalogy: Your car's starter button is a Facade. When you push it, a lot of complex things happen (fuel injection, spark plugs firing, starter motor engaging, etc.), but the interface for you is just 'Push Button'.\n\nIn this example, a `HomeTheaterFacade` exposes simple methods like `watchMovie()` and `endMovie()`. Under the hood, it talks to the Projector, Screen, Lights, Amplifier, and DVD Player in the correct order, saving the client from having to know these details.",
      visualization: {
         type: 'interactive',
         component: 'FacadeInteractive',
         title: 'Home Theater Controller',
         summary: 'One button press orchestrates lights, camera, and action.'
      },
      starterCode: `/**
 * Facade Pattern
 * 
 * Provide a unified interface to a set of interfaces in a subsystem.
 */

class Amplifier {
    on() { return "Amp on"; }
}
class Lights {
    dim() { return "Lights dim"; }
}
class Projector {
    on() { return "Projector on"; }
}

class HomeTheaterFacade {
    private amp = new Amplifier();
    private lights = new Lights();
    private projector = new Projector();
    
    watchMovie(): string[] {
        // TODO: Coordinate subsystem
        return [
            this.lights.dim(),
            this.amp.on(),
            this.projector.on()
        ];
    }
}

// Main class
class FacadeDemo {
    run(): string[] {
        const homeTheater = new HomeTheaterFacade();
        return homeTheater.watchMovie();
    }
}`,
      testCases: [
          { input: [], expected: ["Lights dim", "Amp on", "Projector on"] }
      ]
    },
    {
      name: 'Flyweight',
      category: 'Structural',
      intent: 'Share state efficiently between many fine-grained objects.',
      idea: 'Cache intrinsic data and externalize context to reduce duplication.',
      explanation: "The Flyweight pattern conserves memory by sharing common state among huge numbers of fine-grained objects.\n\nImagine a forest in a video game with 1 million trees. storing the same 3D mesh, texture, and color for every single tree would crash your RAM. Instead, you extract the shared state (mesh, texture) into a 'TreeType' object (the Flyweight).\n\nEach individual 'Tree' object now only holds its unique state (like X, Y position) and a reference to the shared 'TreeType'.\n\n- **Intrinsic State**: Shared, read-only (e.g., Texture).\n- **Extrinsic State**: Unique, passed in context (e.g., Position).",
      visualization: {
         type: 'interactive',
         component: 'FlyweightInteractive',
         title: 'Forest Memory Saver',
         summary: 'Plant thousands of trees using shared models to save RAM.'
      },
      starterCode: `/**
 * Flyweight Pattern
 * 
 * Use sharing to support large numbers of fine-grained objects efficiently.
 */

// Intrinsic State (Shared)
class TreeType {
    constructor(private name: string, private color: string, private texture: string) {}
    draw(x: number, y: number) {
        return \`Drawing \${this.name} at (\${x}, \${y}) using color \${this.color}\`;
    }
}

// Factory to manage Flyweights
class TreeFactory {
    static treeTypes = new Map<string, TreeType>();
    
    static getTreeType(name: string, color: string, texture: string) {
        const key = \`\${name}-\${color}-\${texture}\`;
        if (!TreeFactory.treeTypes.has(key)) {
            TreeFactory.treeTypes.set(key, new TreeType(name, color, texture));
        }
        return TreeFactory.treeTypes.get(key)!;
    }
}

class Tree {
    private type: TreeType;
    constructor(x: number, y: number, name: string, color: string, texture: string) {
        this.type = TreeFactory.getTreeType(name, color, texture);
    }
    // ... logic
}

// Main class
class FlyweightDemo {
    run(): string {
        const type1 = TreeFactory.getTreeType("Oak", "Green", "Rough");
        const type2 = TreeFactory.getTreeType("Oak", "Green", "Rough");
        
        if (type1 === type2) {
            return "Shared Object Used!";
        }
        return "Different Objects Created";
    }
}`,
      testCases: [
          { input: [], expected: "Shared Object Used!" }
      ]
    },
    {
      name: 'Proxy',
      category: 'Structural',
      intent: 'Provide a surrogate to control access to another object.',
      idea: 'Stand-in object manages access, caching, or remoting before touching the real subject.',
      explanation: "The Proxy pattern provides a surrogate or placeholder for another object to control access to it.\n\nThere are several types of proxies:\n- **Remote Proxy**: Represents an object that lives on a different server.\n- **Virtual Proxy**: Delays the creation of expensive objects until they are needed (Lazy Loading).\n- **Protection Proxy**: Checks access rights before allowing an operation.\n- **Caching Proxy**: Stores results of expensive operations and returns the cached result on subsequent requests.\n\nIn this demo, we use a Caching Proxy. The first time you ask for an image, it fetches it from the 'Server' (simulated delay). The second time, it serves it instantly from its local cache.",
      visualization: {
         type: 'interactive',
         component: 'ProxyInteractive',
         title: 'Caching Proxy',
         summary: 'Speed up access by caching expensive results.'
      },
      starterCode: `/**
 * Proxy Pattern
 * 
 * Provide a surrogate or placeholder for another object to control access to it.
 */

interface Image {
    display(): string;
}

class RealImage implements Image {
    constructor(private filename: string) {
        this.loadFromDisk();
    }
    
    private loadFromDisk() { console.log(\`Loading \${this.filename}\`); }
    
    display() { return \`Displaying \${this.filename}\`; }
}

class ProxyImage implements Image {
    private realImage: RealImage | null = null;
    
    constructor(private filename: string) {}
    
    display(): string {
        // TODO: Implement Lazy Loading
        if (!this.realImage) {
            this.realImage = new RealImage(this.filename);
        }
        return this.realImage.display();
    }
}

// Main class
class ProxyDemo {
    run(): string {
        const image = new ProxyImage("photo.jpg");
        // Image not loaded yet
        return image.display(); // Loads and displays
    }
}`,
      testCases: [
          { input: [], expected: "Displaying photo.jpg" }
      ]
    },
    {
      name: 'Chain of Responsibility',
      category: 'Behavioral',
      intent: 'Pass requests through a chain until one handles it.',
      idea: 'Handlers link together; each decides to process or forward.',
      explanation: "The Chain of Responsibility pattern passes a request along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.\n\nThink of a tech support hotline:\n1. **AutoBot**: Tries to answer basic FAQs.\n2. **Level 1 Support**: Handles billing and basic usage.\n3. **Level 2 Support**: Handles technical crashes and bugs.\n4. **Manager**: Handles anything else.\n\nThe customer (Client) sends a ticket. They don't know who will fix it, just that *someone* in the chain will.",
      visualization: {
        type: 'interactive',
        component: 'ChainOfResponsibilityInteractive',
        title: 'Support Ticket Chain',
        summary: 'Watch a request travel down the chain until a handler accepts it.'
      },
      starterCode: `/**
 * Chain of Responsibility Pattern
 * 
 * Avoid coupling the sender of a request to its receiver by giving multiple objects a chance to handle the request.
 */

abstract class Handler {
    protected nextHandler: Handler | null = null;
    
    setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }
    
    handle(request: string): string | null {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}

class Level1Support extends Handler {
    handle(request: string): string | null {
        if (request === "Login Issue") {
            return "Level 1 fixed Login Issue";
        }
        return super.handle(request);
    }
}

class Level2Support extends Handler {
    handle(request: string): string | null {
        if (request === "Server Crash") {
            return "Level 2 fixed Server Crash";
        }
        return super.handle(request);
    }
}

// Main class
class ChainDemo {
    run(issue: string): string | null {
        const h1 = new Level1Support();
        const h2 = new Level2Support();
        
        h1.setNext(h2);
        
        return h1.handle(issue);
    }
}`,
      testCases: [
          { input: ["Login Issue"], expected: "Level 1 fixed Login Issue" },
          { input: ["Server Crash"], expected: "Level 2 fixed Server Crash" },
          { input: ["Unknown"], expected: null }
      ]
    },
    {
      name: 'Command',
      category: 'Behavioral',
      intent: 'Encapsulate a request as an object for parameterization and logging.',
      idea: 'Commands capture receiver and parameters so invokers can queue, undo, or log them.',
      explanation: "The Command pattern turns a request into a stand-alone object that contains all information about the request. This transformation lets you parameterize methods with different requests, delay or queue a request's execution, and support undoable operations.\n\nThink of a Robot Controller. Instead of just calling `robot.moveUp()`, you create a `MoveUpCommand`. You can store this command object in a history stack. If the user hits 'Undo', you just pop the command and call its `undo()` method (which moves the robot down).\n\nKey players:\n- **Invoker**: The remote control buttons.\n- **Command**: The object (e.g., `MoveUp`).\n- **Receiver**: The Robot.",
      visualization: {
         type: 'interactive',
         component: 'CommandInteractive',
         title: 'Robot Remote Control',
         summary: 'Issue commands to a robot and Undo them using a history stack.'
      },
      starterCode: `/**
 * Command Pattern
 * 
 * Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.
 */

interface Command {
    execute(): void;
    undo(): void;
}

class Robot {
    private x = 0;
    private y = 0;
    
    move(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
        return \`Moved to (\${this.x}, \${this.y})\`;
    }
    
    getPosition() { return [this.x, this.y]; }
}

class MoveCommand implements Command {
    constructor(private robot: Robot, private dx: number, private dy: number) {}
    
    execute() {
        this.robot.move(this.dx, this.dy);
    }
    
    undo() {
        this.robot.move(-this.dx, -this.dy);
    }
}

class RemoteControl {
    private history: Command[] = [];
    
    execute(command: Command) {
        command.execute();
        this.history.push(command);
    }
    
    undo() {
        const cmd = this.history.pop();
        if (cmd) cmd.undo();
    }
}

// Main class
class CommandDemo {
    run(): number[] {
        const robot = new Robot();
        const remote = new RemoteControl();
        const moveUp = new MoveCommand(robot, 0, 1);
        const moveRight = new MoveCommand(robot, 1, 0);
        
        remote.execute(moveUp);    // (0, 1)
        remote.execute(moveRight); // (1, 1)
        remote.undo();             // (0, 1)
        
        return robot.getPosition();
    }
}`,
      testCases: [
          { input: [], expected: [0, 1] }
      ]
    },
    {
      name: 'Interpreter',
      category: 'Behavioral',
      intent: 'Define a language grammar and interpret sentences.',
      idea: 'Represent grammar rules as expression classes that evaluate recursively.',
      explanation: "The Interpreter pattern defines a representation for a grammar of a simple language and an interpreter to interpret sentences in the language.\n\nIt is often used for simple scripting languages, math evaluations, or SQL-like parsers. Each rule in the grammar (like 'Number', 'Addition', 'Subtraction') becomes a class.\n\nFor `5 + 2 - 3`, we build a tree:\n- The root is a `SubtractionExpression`.\n- Its left child is an `AdditionExpression` (5 + 2).\n- Its right child is a `NumberExpression` (3).\n\nTo 'interpret' the tree, the root calls evaluate() on its children recursively.",
      visualization: {
         type: 'interactive',
         component: 'InterpreterInteractive',
         title: 'Math Expression Evaluator',
         summary: 'Parse and evaluate "10 + 5 - 3" using a tree of Expression objects.'
      },
      starterCode: `/**
 * Interpreter Pattern
 * 
 * Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.
 */

interface Expression {
    interpret(): number;
}

class NumberExpression implements Expression {
    constructor(private value: number) {}
    interpret() { return this.value; }
}

class AddExpression implements Expression {
    constructor(private left: Expression, private right: Expression) {}
    interpret() { return this.left.interpret() + this.right.interpret(); }
}

class SubtractExpression implements Expression {
    constructor(private left: Expression, private right: Expression) {}
    interpret() { return this.left.interpret() - this.right.interpret(); }
}

// Main class
class InterpreterDemo {
    run(): number {
        // Tree for: 10 + 5 - 3
        // ((10 + 5) - 3)
        const ten = new NumberExpression(10);
        const five = new NumberExpression(5);
        const three = new NumberExpression(3);
        
        const addition = new AddExpression(ten, five);
        const subtraction = new SubtractExpression(addition, three);
        
        return subtraction.interpret();
    }
}`,
      testCases: [
          { input: [], expected: 12 }
      ]
    },
    {
      name: 'Iterator',
      category: 'Behavioral',
      intent: 'Access elements of an aggregate sequentially without exposing representation.',
      idea: 'Expose a small cursor API so collections remain encapsulated.',
      explanation: "The Iterator pattern lets you traverse elements of a collection without exposing its underlying representation (Array, Stack, Tree, etc.).\n\nThe Client doesn't need to know if the list is an array or a linked list. It just calls `iterator.next()` and `iterator.hasNext()`.\n\nIn this example, we use a `ShuffleIterator`. The internal playlist is a simple list, but the Iterator makes it behave like a random shuffle, ensuring every song is played once before repeating.",
      visualization: {
         type: 'interactive',
         component: 'IteratorInteractive',
         title: 'Playlist Shuffle',
         summary: 'Traverse a collection with a Shuffle Iterator.'
      },
      starterCode: `/**
 * Iterator Pattern
 * 
 * Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.
 */

interface Iterator<T> {
    hasNext(): boolean;
    next(): T | null;
}

class PlaylistIterator implements Iterator<string> {
    private position = 0;
    
    constructor(private songs: string[]) {}
    
    hasNext(): boolean {
        return this.position < this.songs.length;
    }
    
    next(): string | null {
        if (this.hasNext()) {
            return this.songs[this.position++];
        }
        return null;
    }
}

class Playlist {
    private songs: string[] = [];
    
    add(song: string) { this.songs.push(song); }
    
    createIterator(): Iterator<string> {
        // TODO: Implement custom shuffle iterator if desired, or simple sequential
        return new PlaylistIterator(this.songs);
    }
}

// Main class
class IteratorDemo {
    run(): string[] {
        const playlist = new Playlist();
        playlist.add("Song A");
        playlist.add("Song B");
        
        const iterator = playlist.createIterator();
        const result: string[] = [];
        
        while (iterator.hasNext()) {
            const s = iterator.next();
            if (s) result.push(s);
        }
        return result;
    }
}`,
      testCases: [
          { input: [], expected: ["Song A", "Song B"] }
      ]
    },
    {
      name: 'Mediator',
      category: 'Behavioral',
      intent: 'Centralize complex communication and control between objects.',
      idea: 'Colleagues talk to a mediator instead of each other to reduce coupling.',
      explanation: "The Mediator pattern reduces chaotic dependencies between objects. Instead of Object A calling Object B, C, and D directly, it calls the Mediator, which then decides who needs to be notified.\n\nThink of an Air Traffic Control tower. Planes (Colleagues) don't talk to each other to avoid collisions. They talk to the Tower (Mediator). The Tower tells other planes what to do.\n\nIn this chat demo, Alice doesn't send a message to Bob directly. She sends it to the ChatMediator, which then broadcasts it to everyone else.",
      visualization: {
         type: 'interactive',
         component: 'MediatorInteractive',
         title: 'Chat Room Hub',
         summary: 'Routing messages through a central mediator.'
      },
      starterCode: `/**
 * Mediator Pattern
 * 
 * Define an object that encapsulates how a set of objects interact.
 */

interface ChatMediator {
    sendMessage(msg: string, user: User): void;
    addUser(user: User): void;
}

class ChatRoom implements ChatMediator {
    private users: User[] = [];
    public history: string[] = [];

    addUser(user: User) {
        this.users.push(user);
    }
    
    sendMessage(msg: string, user: User) {
        // TODO: Send message to all other users
        const log = \`\${user.getName()}: \${msg}\`;
        this.history.push(log);
        this.users.forEach(u => {
            if (u !== user) u.receive(msg);
        });
    }
}

class User {
    constructor(private mediator: ChatMediator, private name: string) {}
    
    getName() { return this.name; }
    
    send(msg: string) {
        this.mediator.sendMessage(msg, this);
    }
    
    receive(msg: string) {
        // console.log(\`\${this.name} received: \${msg}\`);
    }
}

// Main class
class MediatorDemo {
    run(): string[] {
        const chatRoom = new ChatRoom();
        const user1 = new User(chatRoom, "Alice");
        const user2 = new User(chatRoom, "Bob");
        
        chatRoom.addUser(user1);
        chatRoom.addUser(user2);
        
        user1.send("Hi Bob!");
        user2.send("Hey Alice!");
        
        return chatRoom.history;
    }
}`,
      testCases: [
          { input: [], expected: ["Alice: Hi Bob!", "Bob: Hey Alice!"] }
      ]
    },
    {
      name: 'Memento',
      category: 'Behavioral',
      intent: 'Capture and restore an object’s internal state without violating encapsulation.',
      idea: 'Snapshot state into a token managed by a caretaker for undo/restore.',
      explanation: "The Memento pattern captures and externalizes an object's internal state so that it can be restored later, all without violating encapsulation.\n\nThe 'Originator' (the object with state) creates a 'Memento' (a snapshot). A 'Caretaker' (like a history stack) holds on to these tokens but cannot peek inside them.\n\nIn this example, the Hero Editor is the Originator. When you click 'Save Checkpoint', it gives you a token. Later, you can give that token back to restore the Hero to that exact state.",
      visualization: {
         type: 'interactive',
         component: 'MementoInteractive',
         title: 'Game Save System',
         summary: 'Save snapshots of your Hero and restore them later.'
      },
      starterCode: `/**
 * Memento Pattern
 * 
 * Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later.
 */

class Memento {
    constructor(private state: string) {}
    getState() { return this.state; }
}

class Originator {
    private state: string = "";
    
    setState(state: string) { this.state = state; }
    getState() { return this.state; }
    
    saveStateToMemento(): Memento {
        return new Memento(this.state);
    }
    
    getStateFromMemento(memento: Memento) {
        this.state = memento.getState();
    }
}

class CareTaker {
    private mementos: Memento[] = [];
    
    add(state: Memento) { this.mementos.push(state); }
    get(index: number) { return this.mementos[index]; }
}

// Main class
class MementoDemo {
    run(): string {
        const originator = new Originator();
        const careTaker = new CareTaker();
        
        originator.setState("State #1");
        originator.setState("State #2");
        careTaker.add(originator.saveStateToMemento()); // Saved State #2
        
        originator.setState("State #3");
        
        originator.getStateFromMemento(careTaker.get(0)); // Restore State #2
        return originator.getState();
    }
}`,
      testCases: [
          { input: [], expected: "State #2" }
      ]
    },
    {
      name: 'Observer',
      category: 'Behavioral',
      intent: 'Define a one-to-many dependency for automatic updates.',
      idea: 'Subjects notify subscribed observers when state changes.',
      explanation: "The Observer pattern defines a subscription mechanism. A 'Subject' (like a YouTube Channel) maintains a list of 'Observers' (Subscribers).\n\nWhen the Subject changes state (e.g., uploads a new video), it iterates over its list of subscribers and calls their update method automatically.\n\nThis decouples the Subject from the observers. The Subject doesn't care who is listening, just that they implement the Observer interface.",
      visualization: {
         type: 'interactive',
         component: 'ObserverInteractive',
         title: 'Channel Subscription',
         summary: 'Notify subscribers automatically when a new video renders.'
      },
      starterCode: `/**
 * Observer Pattern
 * 
 * Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
 */

interface Observer {
    update(msg: string): void;
}

class Subject {
    private observers: Observer[] = [];
    
    attach(o: Observer) { this.observers.push(o); }
    
    notify(msg: string) {
        // TODO: Notify all observers
        for (const o of this.observers) {
            o.update(msg);
        }
    }
}

class Subscriber implements Observer {
    public lastMessage: string = "";
    update(msg: string) { this.lastMessage = msg; }
}

// Main class
class ObserverDemo {
    run(): string {
        const sub1 = new Subscriber();
        const sub2 = new Subscriber();
        const channel = new Subject();
        
        channel.attach(sub1);
        channel.attach(sub2);
        
        channel.notify("New Video Uploaded!");
        
        return sub1.lastMessage;
    }
}`,
      testCases: [
          { input: [], expected: "New Video Uploaded!" }
      ]
    },
    {
      name: 'State',
      category: 'Behavioral',
      intent: 'Let an object alter behavior when its internal state changes.',
      idea: 'State objects represent modes and handle events, swapping themselves as needed.',
      explanation: "The State pattern allows an object to alter its behavior when its internal state changes. It appears as if the object changed its class.\n\nConsider an Audio Player. \n- When **Playing**, the Play button pauses it.\n- When **Ready**, the Play button starts playback.\n- When **Locked**, the buttons do nothing.\n\nInstead of a giant `switch(state)` inside the player, we create separate state classes (`PlayingState`, `ReadyState`, `LockedState`) and delegate the button clicks to the current state object.",
      visualization: {
         type: 'interactive',
         component: 'StateInteractive',
         title: 'Audio Player',
         summary: 'Buttons behave differently depending on whether the player is playing, paused, or locked.'
      },
      starterCode: `/**
 * State Pattern
 * 
 * Allow an object to alter its behavior when its internal state changes.
 */

interface State {
    clickPlay(): string;
    clickLock(): string;
}

class AudioPlayer {
    public state: State;
    
    constructor() {
        this.state = new ReadyState(this); // Initial state
    }
    
    changeState(state: State) {
        this.state = state;
    }
    
    clickPlay() { return this.state.clickPlay(); }
    clickLock() { return this.state.clickLock(); }
}

class ReadyState implements State {
    constructor(private player: AudioPlayer) {}
    
    clickPlay() {
        this.player.changeState(new PlayingState(this.player));
        return "Playing";
    }
    
    clickLock() {
        this.player.changeState(new LockedState(this.player));
        return "Locked";
    }
}

class PlayingState implements State {
    constructor(private player: AudioPlayer) {}
    
    clickPlay() {
        this.player.changeState(new ReadyState(this.player));
        return "Paused";
    }
    
    clickLock() {
        this.player.changeState(new LockedState(this.player));
        return "Locked";
    }
}

class LockedState implements State {
    constructor(private player: AudioPlayer) {}
    
    clickPlay() { return "Locked..."; }
    
    clickLock() {
        this.player.changeState(new ReadyState(this.player));
        return "Unlocked";
    }
}

// Main class
class StateDemo {
    run(): string[] {
        const player = new AudioPlayer();
        const output: string[] = [];
        output.push(player.clickPlay()); // Playing
        output.push(player.clickPlay()); // Paused
        output.push(player.clickLock()); // Locked
        output.push(player.clickPlay()); // Locked...
        output.push(player.clickLock()); // Unlocked
        return output;
    }
}`,
      testCases: [
          { input: [], expected: ["Playing", "Paused", "Locked", "Locked...", "Unlocked"] }
      ]
    },
    {
      name: 'Strategy',
      category: 'Behavioral',
      intent: 'Define a family of algorithms and make them interchangeable.',
      idea: 'Encapsulate algorithms behind a shared interface and inject them at runtime.',
      explanation: "The Strategy pattern allows you to define a family of algorithms, put each of them into a separate class, and make their objects interchangeable.\n\nA classic example is a Navigation App. You want to get from A to B. \n- **Road Strategy**: Use roads, avoid traffic. (Fast for cars)\n- **Walking Strategy**: Use sidewalks, shortcuts through parks. (Slow but direct)\n- **Public Transit Strategy**: Use bus/train schedules.\n\nThe 'Navigator' context doesn't implement the pathfinding. It just has a `routeStrategy` field and calls `routeStrategy.buildRoute(A, B)`. You can swap strategies instantly based on user preference.",
      visualization: {
         type: 'interactive',
         component: 'StrategyInteractive',
         title: 'Route Planner',
         summary: 'Swap between Driving, Walking, and Transit algorithms on the fly.'
      },
      starterCode: `/**
 * Strategy Pattern
 * 
 * Define a family of algorithms, encapsulate each one, and make them interchangeable.
 */

interface RouteStrategy {
    buildRoute(a: string, b: string): string;
}

class WalkingStrategy implements RouteStrategy {
    buildRoute(a: string, b: string) { return \`Walking from \${a} to \${b}\`; }
}

class DrivingStrategy implements RouteStrategy {
    buildRoute(a: string, b: string) { return \`Driving from \${a} to \${b}\`; }
}

class NavigatorContext {
    private strategy: RouteStrategy;
    
    constructor(strategy: RouteStrategy) {
        this.strategy = strategy;
    }
    
    setStrategy(strategy: RouteStrategy) {
        this.strategy = strategy;
    }
    
    navigate(a: string, b: string) {
        return this.strategy.buildRoute(a, b);
    }
}

// Main class
class StrategyDemo {
    run(): string {
        const nav = new NavigatorContext(new WalkingStrategy());
        let result = nav.navigate("Home", "Park"); // Walking...
        
        nav.setStrategy(new DrivingStrategy());
        result += " | " + nav.navigate("Park", "Work"); // Driving...
        
        return result;
    }
}`,
      testCases: [
          { input: [], expected: "Walking from Home to Park | Driving from Park to Work" }
      ]
    },
    {
      name: 'Template Method',
      category: 'Behavioral',
      intent: 'Define skeleton of an algorithm with overridable steps.',
      idea: 'Encapsulate algorithms behind a shared interface and inject them at runtime.',
      explanation: "The Template Method pattern defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.\n\nThink of a Data Miner `mineData()`. \n1. `openFile()` (Abstract - Subclasses decide how)\n2. `parseData()` (Abstract - Subclasses decide how)\n3. `analyze()` (Shared - Base class does this)\n4. `sendReport()` (Shared - Base class does this)\n5. `closeFile()` (Abstract)\n\nThe `mineData` method in the base class calls these steps in order. PDFMiner and CSVMiner just fill in the blanks.",
      visualization: {
         type: 'interactive',
         component: 'TemplateMethodInteractive',
         title: 'Data Mining Pipeline',
         summary: 'Run a pipeline where some steps are shared and others are customized.'
      },
      starterCode: `/**
 * Template Method Pattern
 * 
 * Define the skeleton of an algorithm in an operation, deferring some steps to subclasses.
 */

abstract class DataMiner {
    // The Template Method
    mine() {
        let result = this.openFile();
        result += " -> " + this.parseData();
        result += " -> " + this.analyze();
        result += " -> " + this.closeFile();
        return result;
    }
    
    // Abstract steps
    abstract openFile(): string;
    abstract parseData(): string;
    
    // Concrete steps (Hooks)
    analyze() { return "Analyzing data"; }
    closeFile() { return "Closing file"; }
}

class PdfMiner extends DataMiner {
    openFile() { return "Opening PDF"; }
    parseData() { return "Parsing PDF fields"; }
}

class CsvMiner extends DataMiner {
    openFile() { return "Opening CSV"; }
    parseData() { return "Splitting CSV lines"; }
}

// Main class
class TemplateMethodDemo {
    run(): string {
        const miner = new PdfMiner();
        return miner.mine();
    }
}`,
      testCases: [
          { input: [], expected: "Opening PDF -> Parsing PDF fields -> Analyzing data -> Closing file" }
      ]
    },
    {
      name: 'Visitor',
      category: 'Behavioral',
      intent: 'Represent operations to be performed on elements of an object structure.',
      idea: 'Double dispatch lets new operations run across varied element types without editing them.',
      explanation: "The Visitor pattern lets you define a new operation without changing the classes of the elements on which it operates.\n\nImagine a shopping cart with diverse items: Books, Fruit, Gadgets. You want to:\n1. Calculate Total Price.\n2. Calculate Shipping Weight.\n3. Export to XML.\n\nInstead of adding `calculatePrice()`, `calculateWeight()`, and `toXML()` methods to every single class (Book, Fruit, Gadget), you create external Visitor classes (`PricingVisitor`, `ShippingVisitor`) that visit the items.",
      visualization: {
         type: 'interactive',
         component: 'VisitorInteractive',
         title: 'Inventory Operations',
         summary: 'Apply different operations (Price, Weight, Export) to a collection of items without changing their classes.'
      },
      starterCode: `/**
 * Visitor Pattern
 * 
 * Represent an operation to be performed on the elements of an object structure.
 */

interface Visitor {
    visitBook(book: Book): void;
    visitFruit(fruit: Fruit): void;
}

interface Item {
    accept(visitor: Visitor): void;
}

class Book implements Item {
    constructor(public price: number, public weight: number) {}
    accept(v: Visitor) { v.visitBook(this); }
}

class Fruit implements Item {
    constructor(public price: number, public weight: number) {}
    accept(v: Visitor) { v.visitFruit(this); }
}

class ShoppingCartVisitor implements Visitor {
    public totalPrice = 0;
    public totalWeight = 0;
    
    visitBook(book: Book) {
        this.totalPrice += book.price;
        this.totalWeight += book.weight;
    }
    
    visitFruit(fruit: Fruit) {
        this.totalPrice += fruit.price;
        this.totalWeight += fruit.weight;
    }
}

// Main class
class VisitorDemo {
    run(): number[] {
        const items: Item[] = [
            new Book(10, 2),
            new Fruit(2, 1),
            new Book(20, 3)
        ];
        
        const visitor = new ShoppingCartVisitor();
        
        for (const item of items) {
            item.accept(visitor);
        }
        
        return [visitor.totalPrice, visitor.totalWeight];
    }
}`,
      testCases: [
          { input: [], expected: [32, 6] }
      ]
    }
  ],
  'Gang of Four',
);
export const mlAlgorithms: CatalogItem[] = normalizeItems(
  [
    {
      name: 'Linear Regression',
      type: 'Supervised',
      idea: 'Fit a line to minimize squared error.',
      explanation: "Linear Regression tries to fit a straight line ($y = mx + b$) through a set of data points to model the relationship between two variables.\n\nIt calculates the line that minimizes the sum of squared vertical distances (residuals) between the observed data points and the fitted line.\n- **m** (Slope): How much $y$ changes for a unit change in $x$.\n- **b** (Intercept): Where the line crosses the y-axis when $x=0$.",
      visualization: {
         type: 'interactive',
         component: 'LinearRegressionInteractive',
         title: 'Least Squares Fitting',
          summary: 'Click to add points and watch the line of best fit adjust instantly.'
       },
       starterCode: `/**
 * Linear Regression
 * 
 * Find the line y = mx + b that minimizes the mean squared error for a set of points.
 */

class LinearRegression {
    solve(points: number[][]): { m: number, b: number } {
        // Points are [x, y]
        let m = 0;
        let b = 0;
        
        // TODO: Implement Linear Regression (Gradient Descent or Normal Equation)
        // Hint: Normal Equation:
        // m = (n*sum(xy) - sum(x)*sum(y)) / (n*sum(x^2) - sum(x)^2)
        // b = (sum(y) - m*sum(x)) / n
        
        const n = points.length;
        if (n === 0) return { m: 0, b: 0 };
        
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        
        for (const [x, y] of points) {
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        }
        
        // Simple formula implementation
        m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        b = (sumY - m * sumX) / n;
        
        return { m, b };
    }
}

// Example usage
const points = [[1, 2], [2, 3], [3, 4]]; // y = x + 1
const lr = new LinearRegression();
console.log(lr.solve(points));`,
       testCases: [
           { 
               input: [[[1, 2], [2, 3], [3, 4]]], 
               expected: { m: 1, b: 1 } // Exact match might be tricky with floats, but integer logic is safe here
               // For float tolerance, we'd need a looser assertion in runner, assume simple integer cases for now
           }
       ]
    },
    {
      name: 'Logistic Regression',
      type: 'Supervised',
      idea: 'Model probability with the logistic function.',
      explanation: "Logistic Regression is used for binary classification (Pass/Fail, Spam/Not Spam). Unlike Linear Regression which fits a line, Logistic Regression fits an 'S-shaped' Sigmoid curve.\n\nThe output is a probability between 0 and 1.\n- **Sigmoid Function**: $\\sigma(z) = \\frac{1}{1 + e^{-z}}$\n- If output > 0.5, classify as True (1).\n- If output < 0.5, classify as False (0).",
      visualization: {
         type: 'interactive',
         component: 'LogisticRegressionInteractive',
         title: 'Pass/Fail Probability',
          summary: 'Add Pass/Fail data points to curve the probability slope.'
       },
       starterCode: `/**
 * Logistic Regression
 * 
 * Predict a binary outcome (0 or 1) based on an input feature.
 * y = sigmoid(mx + b)
 */

class LogisticRegression {
    private m = 0; // weight
    private b = 0; // bias
    private learningRate = 0.1;
    private epochs = 100;

    train(data: { x: number, y: number }[]): void {
        // TODO: Implement Gradient Descent
        // p = 1 / (1 + exp(-(mx + b)))
        // error = p - y
        // m = m - learningRate * error * x
        // b = b - learningRate * error
        
        for (let i = 0; i < this.epochs; i++) {
            for (const p of data) {
                const pred = this.predictProb(p.x);
                const error = pred - p.y;
                this.m -= this.learningRate * error * p.x;
                this.b -= this.learningRate * error;
            }
        }
    }
    
    predictProb(x: number): number {
        return 1 / (1 + Math.exp(-(this.m * x + this.b)));
    }
    
    predict(x: number): number {
        return this.predictProb(x) >= 0.5 ? 1 : 0;
    }
}

// Main class
class LogisticRegressionDemo {
    run(): number {
        // 1 -> 0, 5 -> 1
        const logData = [{ x: 1, y: 0 }, { x: 5, y: 1 }];
        const logReg = new LogisticRegression();
        logReg.train(logData);
        // The test case expects 1, which is the classification for x=5
        return logReg.predict(5);
    }
}`,
       testCases: [
           { 
               input: [], 
               // Testing internal state implies we need 'train' and then 'predict'
               // Our runner calls 'solve' usually. 
               // For classes like this, let's look for a wrapper or assume user writes a helper.
               // Let's rely on checking specific predictions
               // But how do we pass data? 
               // Modify starter code to have a 'solve' that takes data and a query?
               expected: 1 // We expect x=5 to be class 1 given the training data effectively separates low/high
           }
       ] // Wait, test input is arguments to 'solve'. 
         // If we follow 'solve(data, query)', it's cleaner.
         // Let's rewrite starter helper below to be stateless or 'fit' then 'predict' in one call for the test.

    },
    {
      name: 'k-Nearest Neighbors',
      type: 'Supervised',
      idea: 'Predict using the majority/average of nearest samples.',
      explanation: "k-Nearest Neighbors (k-NN) assumes that similar things exist in close proximity. To classify a new data point, it looks at the 'k' closest training data points.\n\n- If **k=3**, it looks at the 3 nearest neighbors.\n- If 2 are Blue and 1 is Orange, the new point is classified as **Blue**.\n\nIt is a 'lazy' learner because it doesn't learn a model; it essentially memorizes the dataset.",
      visualization: {
         type: 'interactive',
         component: 'KNNInteractive',
         title: 'Majority Voting',
          summary: 'Move the cursor to classify new points based on their neighbors.'
       },
       starterCode: `/**
 * k-Nearest Neighbors (k-NN)
 * 
 * Classify a query point based on the majority vote of its 'k' nearest neighbors.
 */

interface Point {
    x: number;
    y: number;
    label: string;
}

class KNN {
    constructor(private k: number) {}
    
    classify(trainData: Point[], query: { x: number, y: number }): string {
        // TODO: Calculate distances
        // TODO: Sort by distance
        // TODO: Take top k labels
        // TODO: Return majority vote
        
        const distances = trainData.map(p => ({
            dist: Math.sqrt((p.x - query.x) ** 2 + (p.y - query.y) ** 2),
            label: p.label
        }));
        
        distances.sort((a, b) => a.dist - b.dist);
        
        const kNearest = distances.slice(0, this.k);
        const counts: Record<string, number> = {};
        
        for (const n of kNearest) {
            counts[n.label] = (counts[n.label] || 0) + 1;
        }
        
        // Find max
        let maxLabel = "";
        let maxCount = -1;
        for (const [lbl, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count;
                maxLabel = lbl;
            }
        }
        
        return maxLabel;
    }
}

// Example usage
const data = [
    { x: 1, y: 1, label: 'A' },
    { x: 1, y: 2, label: 'A' },
    { x: 5, y: 5, label: 'B' }
];
const knn = new KNN(3);
console.log(knn.classify(data, { x: 4, y: 4 }));`,
       testCases: [
           { 
               input: [
                   [{ x: 1, y: 1, label: 'A' }, { x: 5, y: 5, label: 'B' }, { x: 5, y: 6, label: 'B' }], 
                   { x: 4, y: 4 }
               ],
               expected: 'B' 
           }
       ]
    },
    {
      name: 'Decision Trees',
      type: 'Supervised',
      idea: 'Split data by feature thresholds to reduce impurity.',
      explanation: "A Decision Tree makes predictions by asking a series of questions. It splits the data into smaller and smaller subsets based on feature values.\n\nImagine a flowchart: \n1. **Is it raining?** \n   - Yes -> Take Umbrella.\n   - No -> **Is it sunny?**\n     - Yes -> Wear Sunglasses.\n     - No -> Just go outside.\n\nEach split aims to make the resulting groups as 'pure' as possible (e.g., all samples in a leaf node belong to the same class).",
      visualization: {
         type: 'interactive',
         component: 'DecisionTreeInteractive',
         title: 'Activity Recommender',
          summary: 'Follow the flowchart based on Mood and Weather to decide what to do.'
       },
       starterCode: `/**
 * Decision Tree Prediction
 * 
 * Given a tree data structure, traverse it to make a prediction for an input sample.
 */

interface TreeNode {
    feature?: string; // Feature to split on (e.g., "weather")
    threshold?: any;  // Value to check (e.g., "sunny")
    left?: TreeNode;  // Path if value matches or < threshold
    right?: TreeNode; // Path if value doesn't match or >= threshold
    
    label?: string;   // Leaf node output
}

class DecisionTree {
    predict(node: TreeNode, sample: Record<string, any>): string {
        // TODO: Recursively traverse the tree
        // If leaf, return label.
        // Else, check sample[node.feature] vs node.threshold
        
        if (node.label) return node.label;
        
        if (node.feature && sample[node.feature] === node.threshold) {
             return node.left ? this.predict(node.left, sample) : "Error";
        } else {
             return node.right ? this.predict(node.right, sample) : "Error";
             // Note: Real trees handles numerical splits (<=) and categorical differently.
             // This is a simplified "Equals goes Left" logic for the playground.
        }
    }
}

// Example usage
const tree: TreeNode = {
    feature: "weather",
    threshold: "sunny",
    left: { label: "Wear Sunglasses" },
    right: { 
        feature: "time", 
        threshold: "morning",
        left: { label: "Drink Coffee" },
        right: { label: "Sleep" }
    }
};

const dt = new DecisionTree();
console.log(dt.predict(tree, { weather: "rain", time: "morning" }));`,
       testCases: [
           {
               input: [
                   {
                        feature: "weather",
                        threshold: "sunny",
                        left: { label: "Wear Sunglasses" },
                        right: { label: "Bring Umbrella" }
                   },
                   { weather: "sunny" }
               ],
               expected: "Wear Sunglasses"
           }
       ]
    },
    {
      name: 'Random Forests',
      type: 'Ensemble',
      idea: 'Average many decision trees built on random subsets.',
      explanation: "A Random Forest is an 'ensemble' method that constructs many Decision Trees during training. \n\nEach tree is trained on a random subset of the data and uses a random subset of features (Bootstrap Aggregation or 'Bagging').\n\nTo make a prediction, it asks every individual tree for its vote and takes the majority. It reduces overfitting compared to a single Decision Tree because the errors of individual trees cancel out.",
      visualization: {
         type: 'interactive',
         component: 'RandomForestsInteractive',
         title: 'Democracy of Trees',
         summary: 'Watch multiple trees vote on whether a fruit is an Apple or Banana.'
      },
      starterCode: `/**
 * Random Forest Prediction
 * 
 * Aggregates predictions from multiple Decision Trees (e.g., majority vote).
 */

interface TreeNode {
    label?: string;
    // ... simplfied for this example, we assume we just call predictTree
}

// Mock function to simulate tree prediction
function predictTree(treeIndex: number, sample: any): string {
    // In reality, this would traverse a real tree structure
    // We'll simulate: Tree 0 says A, Tree 1 says A, Tree 2 says B
    const predictions = ["A", "A", "B", "A", "B"];
    return predictions[treeIndex % predictions.length];
}

class RandomForest {
    constructor(private numTrees: number) {}
    
    predict(sample: any): string {
        const votes: Record<string, number> = {};
        
        for (let i = 0; i < this.numTrees; i++) {
            const vote = predictTree(i, sample);
            votes[vote] = (votes[vote] || 0) + 1;
        }
        
        // TODO: Find majority vote
        let winner = "";
        let maxVotes = -1;
        for (const [label, count] of Object.entries(votes)) {
            if (count > maxVotes) {
                maxVotes = count;
                winner = label;
            }
        }
        return winner;
    }
}

// Example usage
const rf = new RandomForest(5);
console.log(rf.predict({}));`,
      testCases: [
          { input: [{}], expected: "A" } // A:3, B:2 -> A
      ]
    },
    {
      name: 'Gradient Boosting',
      type: 'Ensemble',
      idea: 'Sequentially add weak learners to correct residuals.',
      explanation: "Gradient Boosting builds a strong model by combining many weak models sequentially.\n\nUnlike Random Forest (which builds independent trees in parallel), Gradient Boosting builds trees one at a time.\n\n1. Train a model.\n2. Calculate the errors (residuals).\n3. Train a NEW model to predict *just* the errors.\n4. Add this new model to the ensemble.\n\nIt's like a golfer putt: The first shot gets close. The second shot aims at the hole from where the first landed.",
      visualization: {
         type: 'interactive',
         component: 'GradientBoostingInteractive',
         title: 'Closing the Gap',
         summary: 'Add new learners to progressively close the distance to the target.'
      },
       starterCode: `/**
 * Gradient Boosting (Regression)
 * 
 * Combine weak learners sequentially. Each new model predicts the residual error of the previous ensemble.
 * Final Prediction = Sum of all model predictions.
 */

// Mock Weak Learner (e.g., small decision tree)
class WeakLearner {
    constructor(private value: number) {}
    predict(x: number) { return this.value; } 
    // In reality, this would be a function of x
}

class GradientBoosting {
    private models: WeakLearner[] = [];
    
    addModel(model: WeakLearner) {
        this.models.push(model);
    }
    
    predict(x: number): number {
        // TODO: Sum up predictions from all models
        let sum = 0;
        for (const model of this.models) {
            sum += model.predict(x);
        }
        return sum;
    }
}

// Example usage
// Target: 10
// Model 1 says 6. Residual = 4.
// Model 2 says 3. Residual = 1.
// Model 3 says 1. Residual = 0.
const gb = new GradientBoosting();
gb.addModel(new WeakLearner(6));
gb.addModel(new WeakLearner(3));
gb.addModel(new WeakLearner(1));

console.log("Prediction:", gb.predict(0));`,
       testCases: [
           { input: [0], expected: 10 }
       ]
    },
    {
      name: 'Support Vector Machines',
      type: 'Supervised',
      idea: 'Maximize margin between classes with kernels.',
      explanation: "A Support Vector Machine (SVM) finds the best boundary (hyperplane) that separates two classes of data points.\n\nThe key goal is to maximize the **margin**—the distance between the boundary and the nearest separating points (called Support Vectors).\n\nA wider margin means the model is more robust and likely to generalize better to new data.",
      visualization: {
         type: 'interactive',
         component: 'SVMInteractive',
         title: 'Max Margin Separator',
         summary: 'Add points to see the boundary shift to maintain the widest gap.'
      },
       starterCode: `/**
 * Support Vector Machine (Linear SVM)
 * 
 * Classify data by finding the hyperplane that maximizes the margin between classes.
 * Decision Rule: w . x + b >= 0 -> Class 1, else Class -1
 */

class SVM {
    constructor(private w: number[], private b: number) {}
    
    predict(x: number[]): number {
        // TODO: Calculate dot product w.x + b
        let dot = 0;
        for(let i=0; i<this.w.length; i++) {
            dot += this.w[i] * x[i];
        }
        return (dot + this.b) >= 0 ? 1 : -1;
    }
}

// Example usage
// 2D weights [1, 1], bias -5. Line x+y=5.
// Point (3, 3) -> 6-5=1 (>0) -> Class 1
// Point (1, 1) -> 2-5=-3 (<0) -> Class -1
const svm = new SVM([1, 1], -5);
console.log(svm.predict([3, 3]));`,
       testCases: [
           { input: [[3, 3]], expected: 1 },
           { input: [[1, 1]], expected: -1 }
       ]
    },
    {
      name: 'k-Means Clustering',
      type: 'Unsupervised',
      idea: 'Assign points to nearest centroids and iterate.',
      explanation: "k-Means is an unsupervised algorithm that groups similar data points together into 'k' clusters.\n\nIt works iteratively:\n1. **Initialization**: Pick 'k' random points as centroids.\n2. **Assignment**: Assign every data point to the nearest centroid.\n3. **Update**: Move each centroid to the center (mean) of its assigned points.\n4. Repeat 2 & 3 until centroids stop moving.",
      visualization: {
         type: 'interactive',
         component: 'KMeansInteractive',
         title: 'Cluster Iteration',
         summary: 'Add points, init centroids, and step through the assignment/update loop.'
      },
       starterCode: `/**
 * k-Means Clustering
 * 
 * Partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean.
 */

interface Point { x: number; y: number; }

class KMeans {
    solve(points: Point[], k: number, iterations: number = 5): Point[] {
        // Simple 1D init for playground stability or just take first k
        // Let's assume we return the final centroids
        if (points.length < k) return points;
        
        let centroids = points.slice(0, k).map(p => ({...p})); // Clone
        
        for(let iter=0; iter<iterations; iter++) {
            // Assignment step
            const clusters: Point[][] = Array.from({length: k}, () => []);
            
            for(const p of points) {
                let minDist = Infinity;
                let clusterIdx = 0;
                
                for(let i=0; i<k; i++) {
                    const c = centroids[i];
                    const d = Math.sqrt((p.x-c.x)**2 + (p.y-c.y)**2);
                    if (d < minDist) {
                        minDist = d;
                        clusterIdx = i;
                    }
                }
                clusters[clusterIdx].push(p);
            }
            
            // Update step
            for(let i=0; i<k; i++) {
                const cluster = clusters[i];
                if (cluster.length === 0) continue; // Keep old centroid if empty
                
                let sumX = 0, sumY = 0;
                for(const p of cluster) {
                    sumX += p.x;
                    sumY += p.y;
                }
                centroids[i] = { x: sumX / cluster.length, y: sumY / cluster.length };
            }
        }
        
        return centroids;
    }
}

// Example usage
const points = [
    {x: 0, y: 0}, {x: 1, y: 0}, // Cluster 1
    {x: 10, y: 10}, {x: 11, y: 10} // Cluster 2
];
const kmeans = new KMeans();
const centers = kmeans.solve(points, 2);
console.log(centers);`,
       testCases: [
           {
               input: [
                   [{x: 0, y: 0}, {x: 2, y: 0}, {x: 10, y: 0}, {x: 12, y: 0}],
                   2
               ],
               // We expect centroids around 1 and 11
               expected: [{x: 1, y: 0}, {x: 11, y: 0}]
           }
       ]
    },
    {
      name: 'Principal Component Analysis',
      type: 'Unsupervised',
      idea: 'Rotate data to principal axes of variance.',
      explanation: "Principal Component Analysis (PCA) is a technique for Dimensionality Reduction. It finds the directions (Principal Components) where the data varies the most.\n\nImagine a cloud of points shaped like a flat pancake. \n- **PC1** is the long axis of the pancake.\n- **PC2** is the short axis.\n\nBy ignoring the short axis (projecting everything onto PC1), we reduce dimensions while keeping most of the information.",
      visualization: {
         type: 'interactive',
         component: 'PCAInteractive',
         title: 'Finding the Axis',
          summary: 'Toggle between a 2D cloud and its 1D projection onto the Principal Component.'
       },
       starterCode: `/**
 * Principal Component Analysis (PCA)
 * 
 * Reduce dimensionality by finding the direction of maximum variance (First Principal Component).
 */

class PCA {
    solve(data: {x: number, y: number}[]): {x: number, y: number} {
        // TODO: Center data
        // TODO: Compute Covariance Matrix
        // TODO: Find eigenvector with largest eigenvalue (Power Iteration or just analytic for 2D)
        
        // Simple approximation or hardcoded logic for playground? 
        // Let's implement Power Iteration for 2D
        
        // 1. Center
        const n = data.length;
        if (n === 0) return {x: 0, y: 0};
        
        let meanX = 0, meanY = 0;
        data.forEach(p => { meanX += p.x; meanY += p.y; });
        meanX /= n; meanY /= n;
        
        // 2. Covariance
        let covXX = 0, covXY = 0, covYY = 0;
        data.forEach(p => {
             const dx = p.x - meanX;
             const dy = p.y - meanY;
             covXX += dx * dx;
             covXY += dx * dy;
             covYY += dy * dy;
        });
        covXX /= (n-1); covXY /= (n-1); covYY /= (n-1);
        
        // 3. Power Iteration to find dominant eigenvector
        let vx = 1, vy = 1; // Random start
        for(let i=0; i<10; i++) {
            const nx = covXX * vx + covXY * vy;
            const ny = covXY * vx + covYY * vy;
            // Normalize
            const mag = Math.sqrt(nx*nx + ny*ny);
            vx = nx / mag;
            vy = ny / mag;
        }
        
        return {x: vx, y: vy};
    }
}

// Example usage
// Points along y=x
const pcapoints = [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}];
const pca = new PCA();
console.log(pca.solve(pcapoints));`,
       testCases: [
           { 
               input: [[{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]], 
               // Expect close to [0.707, 0.707]
               expected: {x: 0.7071067811865475, y: 0.7071067811865475} 
           }
       ]
    },
    {
      name: 'Neural Networks',
      type: 'Deep learning',
      idea: 'Stack layers of nonlinear units trained with backprop.',
      visualization: {
         type: 'interactive',
         component: 'NeuralNetworkInteractive',
         title: 'Interactive XOR Network',
          summary: 'Train a small MLP to solve the XOR problem.'
       },
       starterCode: `/**
 * Neural Network (XOR Problem)
 * 
 * Train a simple network to solve XOR:
 * 0,0 -> 0
 * 0,1 -> 1
 * 1,0 -> 1
 * 1,1 -> 0
 */

class NeuralNet {
    // Simple architecture: 2 inputs -> 2 hidden -> 1 output
    // Weights would be initialized randomly here...
    
    train(data: {input: number[], output: number}[], epochs: number) {
        // TODO: Forward pass
        // TODO: Calculate Loss
        // TODO: Backpropagation
        // TODO: Update weights
    }
    
    predict(input: number[]): number {
        // Placeholder logic for the starter
        // User needs to implement forward pass
        return 0; 
    }
}

// Example usage
const trainingData = [
    { input: [0, 0], output: 0 },
    { input: [0, 1], output: 1 },
    { input: [1, 0], output: 1 },
    { input: [1, 1], output: 0 }
];

const nn = new NeuralNet();
nn.train(trainingData, 1000);
console.log("0,1 ->", nn.predict([0, 1]));`,
       testCases: [
           { input: [[0, 1]], expected: 1 } // Hard to test without a working internal implementation in starter
       ]
    },
    {
      name: 'Reinforcement Learning (Q-learning)',
      type: 'RL',
      idea: 'Learn action values via temporal-difference updates.',
      visualization: {
        type: 'interactive',
         component: 'RLInteractive',
         title: 'Grid World Explorer',
         summary: 'Watch an agent learn the best path to the reward via Q-Learning.'
       },
       starterCode: `/**
 * Reinforcement Learning (Q-Learning)
 * 
 * Q(s, a) = Q(s, a) + alpha * (reward + gamma * max(Q(s', a')) - Q(s, a))
 */

class QLearner {
    private qTable: Record<string, number> = {};
    private alpha = 0.1; // Learning rate
    private gamma = 0.9; // Discount factor
    
    getQ(state: string, action: string) {
        return this.qTable[\`\${state}-\${action}\`] || 0;
    }
    
    update(state: string, action: string, reward: number, nextState: string, possibleNextActions: string[]) {
        // TODO: Implement Q-Learning Update Rule
        
        const currentQ = this.getQ(state, action);
        
        // Max Q for next state
        let maxNextQ = 0;
        if (possibleNextActions.length > 0) {
            maxNextQ = Math.max(...possibleNextActions.map(a => this.getQ(nextState, a)));
        }
        
        const newQ = currentQ + this.alpha * (reward + this.gamma * maxNextQ - currentQ);
        this.qTable[\`\${state}-\${action}\`] = newQ;
    }
}

// Example usage
// State "A", Action "Right" -> Reward 10 -> State "B"
const agent = new QLearner();
agent.update("A", "Right", 10, "B", ["Left", "Right"]);
console.log("Q(A, Right) =", agent.getQ("A", "Right"));`,
       testCases: [
           { input: ["A", "Right"], expected: 1 } // alpha(0.1) * (10 + 0 - 0) = 1
       ]
    }
  ],
  'ML & AI'
);

export const mathItems: CatalogItem[] = normalizeItems(
  [
    {
      name: 'Big O Proofs',
      category: 'Foundations',
      idea: 'Formal definition using limits and constants.',
      explanation: "To prove f(n) = O(g(n)), we must find constants C and k such that:\n\n|f(n)| <= C * |g(n)| for all n > k.\n\nGraphically, this means g(n) (scaled by C) eventually dominates f(n). This is the foundation of algorithm analysis.",
      visualization: {
         type: 'interactive',
         component: 'BigOInteractive', // Placeholder
         title: 'Find the Constant C',
         summary: 'Adjust C and k to sandwich the function.'
      },
      starterCode: `/**
 * Big O Proof Checker
 * 
 * Verify if f(n) <= C * g(n) for all n >= k
 */
function verifyBigO(f: (n:number)=>number, g: (n:number)=>number, C: number, k: number): boolean {
    // Check a range of values > k
    for(let n = k; n < k + 100; n++) {
        if (f(n) > C * g(n)) return false;
    }
    return true;
}

// Example: Prove 2n + 5 is O(n)
// Let C = 3, k = 5
console.log(verifyBigO(n => 2*n + 5, n => n, 3, 5));`,
      testCases: [{ input: [], expected: true }] // Logic check
    },
    {
      name: 'Matrix Multiplication',
      category: 'Linear Algebra',
      idea: 'Row by Column dot products.',
      explanation: "Matrix multiplication is the workhorse of Deep Learning. If A is (m x n) and B is (n x p), the result C is (m x p).\n\nEach element C[i][j] is the dot product of Row i from A and Column j from B.",
      visualization: {
         type: 'interactive',
         component: 'MatrixInteractive',
         title: 'Visual Matrix Multiply',
         summary: 'Highlight rows and columns to see how they combine.'
      },
      starterCode: `/**
 * Matrix Multiplication
 * 
 * Compute C = A * B
 */
class MatrixMath {
    multiply(A: number[][], B: number[][]): number[][] {
        const rowsA = A.length;
        const colsA = A[0].length;
        const rowsB = B.length;
        const colsB = B[0].length;
        
        if (colsA !== rowsB) throw new Error("Dimension mismatch");
        
        const C = Array.from({length: rowsA}, () => Array(colsB).fill(0));
        
        for(let i=0; i<rowsA; i++) {
            for(let j=0; j<colsB; j++) {
                for(let k=0; k<colsA; k++) {
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return C;
    }
}

const mm = new MatrixMath();
const A = [[1, 2], [3, 4]];
const B = [[2, 0], [1, 2]];
console.log(mm.multiply(A, B));`,
      testCases: [
          { input: [[[1, 2], [3, 4]], [[2, 0], [1, 2]]], expected: [[4, 4], [10, 8]] }
      ]
    },
    {
      name: 'Gradient Descent',
      category: 'Calculus',
      idea: 'Iteratively move against the gradient direction.',
      explanation: "To minimize a function f(x), we calculate its derivative (gradient) f'(x) at the current point.\n\nSince the gradient points uphill, we move in the opposite direction:\n\nx_new = x_old - learning_rate * f'(x_old)",
      visualization: {
         type: 'interactive',
         component: 'GradientDescentInteractive',
         title: 'Ball on a Hill',
         summary: 'Adjust learning rate to reach the minimum without overshooting.'
      },
      starterCode: `/**
 * Gradient Descent (1D)
 * 
 * Find x that minimizes f(x) = x^2
 * f'(x) = 2x
 */
function train(iterations: number, lr: number) {
    let x = 10; // Start at 10
    
    for(let i=0; i<iterations; i++) {
        const gradient = 2 * x; // Derivative of x^2
        x = x - lr * gradient;
        console.log(\`Iter \${i}: x = \${x}\`);
    }
    return x;
}

console.log("Result:", train(10, 0.1));`,
      testCases: [{ input: [10, 0.1], expected: 1.0737418240000003 }] // (1-2*0.1)^10 * 10 = (0.8)^10 * 10 ≈ 1.07
    },
    {
      name: 'Mathematical Claims & Proofs',
      category: 'Logic & Foundations',
      idea: 'Rigorous informal logic to verify truth.',
      explanation: "Simple mathematical claims/proofs employ logic expressed in symbols and natural language. This logic forms the bedrock of mathematics and computer science.\n\nKey Concepts:\n1. **Propositions**: Statements that are either True or False.\n2. **Operators**: AND (∧), OR (∨), NOT (¬), IMPLIES (→).\n3. **Truth Tables**: A systematic way to test logical equivalence (e.g., De Morgan's Laws).",
      visualization: {
         type: 'interactive',
         component: 'TruthTableInteractive',
         title: 'Truth Table Generator',
         summary: 'Check if two logical statements are equivalent.'
      },
      starterCode: `/**
 * Logical Equivalence Checker
 * 
 * Verify De Morgan's First Law:
 * ¬(A ∧ B) ≡ (¬A) ∨ (¬B)
 */

function checkDeMorgan(): boolean {
    const values = [true, false];
    
    for(const A of values) {
        for(const B of values) {
            // Left Side: NOT (A AND B)
            const left = !(A && B);
            
            // Right Side: (NOT A) OR (NOT B)
            const right = (!A) || (!B);
            
            console.log(\`A=\${A}, B=\${B} -> L:\${left} == R:\${right}\`);
            
            if (left !== right) return false;
        }
    }
    return true;
}

console.log("Equivalent?", checkDeMorgan());`,
      testCases: [{ input: [], expected: true }]
    },
    {
      name: 'Propositional Logic',
      category: 'Logic & Foundations',
      idea: 'Formal language of correct reasoning using precise syntax and semantics.',
      explanation: "Propositional Logic is the most elementary form of logic. It treats logic as a language with strict rules:\n\n1. **Syntax (Structure)**: Well-formed formulas (WFF) built from atomic variables (p, q) and connectives (¬, ∧, ∨, →).\n2. **Semantics (Meaning)**: Determined by Truth Tables.\n3. **Expressibility**: We can find a minimal set of symbols (e.g., just NAND) that can express *any* logical statement.",
      visualization: {
         type: 'interactive',
         component: 'SyntaxTreeInteractive',
         title: 'Logic Syntax Tree',
         summary: 'Visualize the structure of a Well-Formed Formula.'
      },
      starterCode: `/**
 * Well-Formed Formula (WFF) Validator
 * 
 * Simple recursive parser to check if a string is a valid WFF.
 * Grammar:
 * S -> Atom | (S op S) | (not S)
 */
function isWFF(expr: string): boolean {
    expr = expr.trim();
    if (/^[p-z]$/.test(expr)) return true; // Atom
    
    // Check for (not S)
    if (expr.startsWith('(not ') && expr.endsWith(')')) {
        return isWFF(expr.slice(5, -1));
    }
    
    // Check for (S op S)
    if (expr.startsWith('(') && expr.endsWith(')')) {
        // Find split point (naive)
        // In real parser, we count parens
        const inner = expr.slice(1, -1);
        const parts = inner.split(' ');
        if (parts.length === 3) {
             // simplified: assumes no nested spaces for demo
             return isWFF(parts[0]) && isWFF(parts[2]);
        }
    }
    return false;
}

console.log(isWFF("(p and q)")); // Simplified check`,
      testCases: [{ input: [], expected: undefined }] // Just a demo
    },
    {
      name: 'Logical Equivalence & Trees',
      category: 'Logic & Foundations',
      idea: 'Simplify statements and use Truth Trees for satisfiability.',
      explanation: "Two statements are **Logically Equivalent** if they have the same truth value in every possible scenario (same Truth Table columns).\n\nWe use equivalence rules (Association, Distribution, De Morgan's) to simplify complex statements.\n\n**Truth Trees** (Semantic Tableaux) are a more efficient visual method to test for consistency or validity without building a massive table.",
      visualization: {
         type: 'interactive',
         component: 'TruthTreeInteractive',
         title: 'Interactive Truth Tree',
         summary: 'Decompose a statement to check for contradictions.'
      },
      starterCode: `/**
 * Truth Tree Branching (Semantic Tableaux)
 * 
 * Check Satisfiability of (A AND (NOT A))
 */
type Formula = { type: 'atom', val: string } | { type: 'not', inner: Formula } | { type: 'and', left: Formula, right: Formula };

function solveTree(forms: Formula[]): boolean {
    // If we find A and NOT A in the list -> CLOSED (Unsatisfiable)
    const atoms = new Set<string>();
    const negatedAtoms = new Set<string>();
    
    for(const f of forms) {
        if(f.type === 'atom') atoms.add(f.val);
        if(f.type === 'not' && f.inner.type === 'atom') negatedAtoms.add(f.inner.val);
    }
    
    for(const a of atoms) {
        if(negatedAtoms.has(a)) return false; // Branch Closed (Contradiction)
    }
    
    // Expand AND rules ... (Simplified)
    return true; // Open branch found
}

const unsat: Formula[] = [
    {type: 'atom', val: 'A'}, 
    {type: 'not', inner: {type: 'atom', val: 'A'}}
];
console.log("Is Satisfiable?", solveTree(unsat));`,
    },
    {
      name: 'Boolean Algebra & Circuits',
      category: 'Logic & Foundations',
      idea: 'Logic realized in hardware via gates.',
      explanation: "Boolean Algebra is the algebraic structure of logic. It maps logical operators to physical gates:\n\n- **AND** -> Series circuit / AND Gate on chip\n- **OR** -> Parallel circuit / OR Gate\n- **NOT** -> Inverter\n\nThis maps abstract logic directly to the transistors inside CPUs.",
      visualization: {
         type: 'interactive',
         component: 'CircuitInteractive',
         title: 'Logic Gate Simulator',
         summary: 'Build circuits from equations.'
      },
      starterCode: `/**
 * Simple Logic Gate Simulator
 * 
 * Simulates a Half Adder:
 * Sum = A XOR B
 * Carry = A AND B
 */
function halfAdder(a: number, b: number) {
    const sum = a ^ b; // XOR
    const carry = a & b; // AND
    return { sum, carry };
}

console.log("1 + 1 =", halfAdder(1, 1)); // Sum 0, Carry 1 (Binary 10)`,
      testCases: [{ input: [], expected: undefined }]
    },
    {
      name: 'First-Order Logic',
      category: 'Logic & Foundations',
      idea: 'Extends propositional logic with quantifiers (∀, ∃).',
      explanation: "Propositions are limited (e.g., 'Socrates is mortal'). First-Order Logic adds:\n\n1. **Predicates**: P(x) is true for some x.\n2. **Quantifiers**:\n   - **Universal (∀)**: For all x.\n   - **Existential (∃)**: There exists an x.\n\nThis allows expressing 'All men are mortal' formally: ∀x (Man(x) → Mortal(x)).",
      visualization: {
         type: 'interactive',
         component: 'QuantifierInteractive',
         title: 'World of Blocks',
         summary: 'Verify statements like "All red blocks are square".'
      },
      starterCode: `/**
 * Predicate Logic Checker
 * 
 * Domain: Array of numbers
 * Predicate P(x): x > 5
 * Check: ∃x P(x) vs ∀x P(x)
 */
function checkQuantifiers(domain: number[]) {
    const P = (x: number) => x > 5;
    
    const exists = domain.some(P); // ∃x
    const forAll = domain.every(P); // ∀x
    
    return { exists, forAll };
}

console.log(checkQuantifiers([1, 10, 2]));`,
      testCases: [{ input: [], expected: undefined }]
    },
    {
      name: 'Set Theory & Relations',
      category: 'Discrete Math',
      idea: 'Collections of objects and links between them.',
      explanation: "Sets are unordered collections of unique elements. Relations are links between sets.\n\n- **Partitions**: Dividing a set into non-overlapping subsets.\n- **Reflexive**: Every node links to itself.\n- **Symmetric**: If A->B, then B->A.\n- **Transitive**: If A->B and B->C, then A->C.\n\nRelations can be visualized as Directed Graphs.",
      visualization: {
         type: 'interactive',
         component: 'VennInteractive',
         title: 'Interactive Venn Diagram',
         summary: 'Visualize Union, Intersection, and Difference.'
      },
      starterCode: `/**
 * Set Operations & Transitivity Check
 */
class SetMath {
    union(a: Set<number>, b: Set<number>): Set<number> {
        return new Set([...a, ...b]);
    }
    
    isTransitive(relation: [number, number][]): boolean {
        // Simple O(n^3) check
        // If (a,b) and (b,c) exist, (a,c) must exist
        const set = new Set(relation.map(p => \`\${p[0]},\${p[1]}\`));
        
        for(const [a, b] of relation) {
            for(const [b2, c] of relation) {
                if(b === b2) {
                    if(!set.has(\`\${a},\${c}\`)) return false;
                }
            }
        }
        return true;
    }
}

const sm = new SetMath();
const rel: [number,number][] = [[1,2], [2,3], [1,3]]; // Transitive
console.log("Transitive?", sm.isTransitive(rel));`,
      testCases: [{ input: [], expected: undefined }]
    },
    {
      name: 'Functions & Combinatorics',
      category: 'Discrete Math',
      idea: 'Mappings and Counting.',
      explanation: "**Functions**: Map inputs to outputs.\n- **Injective (1-to-1)**: No two inputs map to same output.\n- **Surjective (Onto)**: Every possible output is covered.\n\n**Combinatorics**: Counting without listing.\n- **Permutations**: Order matters (Arranging books).\n- **Combinations**: Order doesn't matter (Picking a team).",
      visualization: {
         type: 'interactive',
         component: 'MappingInteractive',
         title: 'Function Mapper',
         summary: 'Drag lines to see Injection/Surjection status.'
      },
      starterCode: `/**
 * Combinatorics Calculator
 */
function factorial(n: number): number {
    if(n <= 1) return 1;
    return n * factorial(n - 1);
}

function nCr(n: number, r: number) {
    return factorial(n) / (factorial(r) * factorial(n - r));
}

console.log("Ways to choose 2 items from 5:", nCr(5, 2));`,
      testCases: [{ input: [], expected: undefined }]
    },
    {
      name: 'Recurrence Relations',
      category: 'Discrete Math',
      idea: 'Defining sequences recursively.',
      explanation: "A recurrence relation defines a sequence based on previous terms (e.g., Fibonacci).\n\n**Homogeneous**: Depends only on previous terms (a_n = 2a_{n-1}).\n**Inhomogeneous**: Has an extra term (a_n = 2a_{n-1} + n).\n\nSolving them gives a closed-form formula (like Binet's formula for Fib).",
      visualization: {
         type: 'interactive',
         component: 'RecurrencePlotter',
         title: 'Sequence Visualizer',
         summary: 'Plot the growth of linear recurrences.'
      },
      starterCode: `/**
 * Linear Recurrence Solver (Iterative)
 * a_n = c1*a_{n-1} + c2*a_{n-2}
 */
function solveRecurrence(n: number, c1: number, c2: number, a0: number, a1: number): number {
    if(n === 0) return a0;
    if(n === 1) return a1;
    
    let prev2 = a0;
    let prev1 = a1;
    
    for(let i=2; i<=n; i++) {
        const current = c1 * prev1 + c2 * prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}

// Fibonacci: a_n = 1*a_{n-1} + 1*a_{n-2}
console.log("Fib(10):", solveRecurrence(10, 1, 1, 0, 1));`,
      testCases: [{ input: [], expected: undefined }]
    },
    {
      name: 'Graph Theory & Matrices',
      category: 'Graph Theory',
      idea: 'Structures of nodes and edges, analyzed via Matrices.',
      explanation: "Graphic Theory studies pairwise relations. It connects deeply with Linear Algebra:\n\n**Adjacency Matrix**: A graph can be represented as a matrix M. Computing M^k tells us the number of paths of length k between nodes.\n\nKey Concepts:\n- **Euler Path**: Visits every edge exactly once.\n- **Spanning Tree**: A subgraph that connects all nodes with min edges.",
      visualization: {
         type: 'interactive',
         component: 'GraphMatrixInteractive',
         title: 'Matrix Power Graph',
         summary: 'Square the adjacency matrix to see path counts.'
      },
      starterCode: `/**
 * Adjacency Matrix & Path Counting
 * 
 * Given Graph G, calculate G^2 to find paths of length 2.
 */
function squareMatrix(adj: number[][]): number[][] {
    const size = adj.length;
    const result = Array.from({length: size}, () => Array(size).fill(0));
    
    for(let i=0; i<size; i++) {
        for(let j=0; j<size; j++) {
            for(let k=0; k<size; k++) {
                // If there is a path i->k AND k->j, add 1
                result[i][j] += adj[i][k] * adj[k][j];
            }
        }
    }
    return result;
}

const G = [
    [0, 1, 0], 
    [0, 0, 1], 
    [1, 0, 0]
]; // Triangle cycle 0->1->2->0
console.log("Paths of len 2:", squareMatrix(G));`,
      testCases: [{ input: [], expected: undefined }]
    }
  ],
  'Math'
);

export const allItems: CatalogItem[] = [...dsaAlgorithms, ...designPatterns, ...mlAlgorithms, ...mathItems];
export const visualizedItems: CatalogItem[] = allItems.filter(item => Boolean(item.visualization));
export const pendingVisualizations: CatalogItem[] = allItems.filter(item => !item.visualization);
export { slugify };
