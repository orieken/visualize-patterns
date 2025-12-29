const slugify = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const normalizeItems = (items, domain) =>
  items.map(item => ({
    ...item,
    domain,
    slug: item.slug ?? slugify(item.name)
  }));

export const dsaAlgorithms = normalizeItems([
  {
    name: 'Breadth-First Search',
    category: 'Graph traversal',
    complexity: 'O(V + E)',
    idea: 'Explore neighbors level by level using a queue.',
    visualization: {
      title: 'Level-order sweep',
      summary: 'Queue drives expansion from the source outward.',
      type: 'graph',
      nodes: [
        { id: 'S', layer: 0 },
        { id: 'A', layer: 1 },
        { id: 'B', layer: 1 },
        { id: 'C', layer: 2 },
        { id: 'D', layer: 2 }
      ],
      order: ['S', 'A', 'B', 'C', 'D']
    }
  },
  {
    name: 'Depth-First Search',
    category: 'Graph traversal',
    complexity: 'O(V + E)',
    idea: 'Go deep with a stack/recursion to explore paths.',
    visualization: {
      title: 'Recursive spine',
      summary: 'Stack follows a single branch before backtracking.',
      type: 'graph',
      nodes: [
        { id: 'S', layer: 0 },
        { id: 'A', layer: 1 },
        { id: 'C', layer: 2 },
        { id: 'D', layer: 3 },
        { id: 'B', layer: 1 }
      ],
      order: ['S', 'A', 'C', 'D', 'B']
    }
  },
  {
    name: 'Dijkstra',
    category: 'Shortest path',
    complexity: 'O((V + E) log V)',
    idea: 'Greedily relax edges using a priority queue to find shortest paths.',
    visualization: {
      title: 'Priority queue frontier',
      summary: 'Distances settle from the source outward.',
      type: 'timeline',
      stages: ['Pick the closest unsettled node', 'Relax outgoing edges', 'Update queue priorities', 'Repeat until all nodes settled']
    }
  },
  {
    name: 'A* Search',
    category: 'Shortest path',
    complexity: 'O((V + E) log V)',
    idea: 'Dijkstra enhanced with a heuristic that prioritizes promising nodes.',
    visualization: {
      title: 'Heuristic-guided path',
      summary: 'Queue ordered by g + h to favor promising routes.',
      type: 'timeline',
      stages: ['Start with source and heuristic estimates', 'Expand node with smallest f = g + h', 'Update neighbors with better scores', 'Terminate when goal dequeued']
    }
  },
  {
    name: 'Merge Sort',
    category: 'Sorting',
    complexity: 'O(n log n)',
    idea: 'Divide and conquer by sorting halves then merging.',
    visualization: {
      title: 'Divide and merge',
      summary: 'Halve the array, sort recursively, then stitch.',
      type: 'bars',
      values: [40, 70, 15, 90, 55, 20],
      steps: ['Split', 'Sort halves', 'Merge sorted runs']
    }
  },
  {
    name: 'Quick Sort',
    category: 'Sorting',
    complexity: 'O(n log n) average',
    idea: 'Partition around a pivot so smaller elements go left and larger go right.',
    visualization: {
      title: 'Pivot partitions',
      summary: 'Choose pivot, partition, recurse on sides.',
      type: 'bars',
      values: [65, 25, 80, 40, 55, 15],
      steps: ['Pick pivot', 'Partition', 'Recurse']
    }
  },
  {
    name: 'Union-Find',
    category: 'Disjoint sets',
    complexity: 'Amortized near O(1)',
    idea: 'Track connected components with path compression and union by rank.',
    visualization: {
      title: 'Disjoint sets union',
      summary: 'Parents compress while ranks guide attachment.',
      type: 'flow',
      stages: [
        { title: 'Find', detail: 'Climb parents and compress paths' },
        { title: 'Union', detail: 'Attach shorter tree under taller root' },
        { title: 'Components', detail: 'Roots represent connected components' }
      ]
    }
  },
  {
    name: 'Topological Sort',
    category: 'Graph ordering',
    complexity: 'O(V + E)',
    idea: 'Linear order of DAG nodes produced via DFS or Kahn’s algorithm.',
    visualization: {
      title: 'Ordering a DAG',
      summary: 'Peel off zero in-degree nodes to form a schedule.',
      type: 'timeline',
      stages: ['Compute in-degrees', 'Enqueue zero in-degree nodes', 'Pop, output, and decrement neighbors', 'Repeat until queue empty']
    }
  },
  {
    name: 'Knuth-Morris-Pratt',
    category: 'String matching',
    complexity: 'O(n + m)',
    idea: 'Preprocess pattern to skip redundant comparisons.',
    visualization: {
      title: 'Prefix table hopping',
      summary: 'Failure table lets the matcher skip ahead.',
      type: 'timeline',
      stages: ['Build longest prefix-suffix table', 'Scan text left to right', 'On mismatch, jump using table without rescanning']
    }
  },
  {
    name: 'Dynamic Programming (Fibonacci)',
    category: 'Optimization',
    complexity: 'O(n)',
    idea: 'Cache sub-results to avoid repeated work.',
    visualization: {
      title: 'Bottom-up table',
      summary: 'Reuse previous answers to climb the ladder.',
      type: 'timeline',
      stages: ['Seed F(0) and F(1)', 'Iterate from 2..n', 'Store and reuse each computed value']
    }
  }
], 'DS&A');

export const designPatterns = normalizeItems([
  { name: 'Singleton', intent: 'Ensure a class has a single instance and a global access point.' },
  { name: 'Factory Method', intent: 'Create objects via subclass-chosen factories to decouple construction.' },
  { name: 'Abstract Factory', intent: 'Provide families of related objects without specifying concrete classes.' },
  { name: 'Builder', intent: 'Construct complex objects step by step while controlling representation.' },
  { name: 'Prototype', intent: 'Clone existing objects instead of instantiating new ones.' },
  { name: 'Adapter', intent: 'Convert one interface into another that clients expect.' },
  { name: 'Bridge', intent: 'Decouple abstraction from implementation so both can vary independently.' },
  { name: 'Composite', intent: 'Treat part-whole object hierarchies uniformly.' },
  { name: 'Decorator', intent: 'Attach responsibilities dynamically without altering the original class.' },
  { name: 'Facade', intent: 'Provide a simplified interface to a subsystem.' },
  { name: 'Flyweight', intent: 'Share state efficiently between many fine-grained objects.' },
  { name: 'Proxy', intent: 'Provide a surrogate to control access to another object.' },
  { name: 'Chain of Responsibility', intent: 'Pass requests through a chain until one handles it.' },
  { name: 'Command', intent: 'Encapsulate a request as an object for parameterization and logging.' },
  { name: 'Interpreter', intent: 'Define a language grammar and interpret sentences.' },
  { name: 'Iterator', intent: 'Access elements of an aggregate sequentially without exposing representation.' },
  { name: 'Mediator', intent: 'Centralize complex communication and control between objects.' },
  { name: 'Memento', intent: 'Capture and restore an object’s internal state without violating encapsulation.' },
  { name: 'Observer', intent: 'Define a one-to-many dependency for automatic updates.' },
  { name: 'State', intent: 'Let an object alter behavior when its internal state changes.' },
  { name: 'Strategy', intent: 'Define a family of algorithms and make them interchangeable.' },
  { name: 'Template Method', intent: 'Define skeleton of an algorithm with overridable steps.' },
  { name: 'Visitor', intent: 'Represent operations to be performed on elements of an object structure.' }
], 'Gang of Four');

export const mlAlgorithms = normalizeItems([
  {
    name: 'Linear Regression',
    type: 'Supervised',
    idea: 'Fit a line to minimize squared error.',
    visualization: {
      title: 'Best-fit line',
      summary: 'Line minimizes squared residuals across points.',
      type: 'scatter',
      points: [
        { label: 'A', x: 15, y: 25, category: 'Supervised' },
        { label: 'B', x: 35, y: 35, category: 'Supervised' },
        { label: 'C', x: 55, y: 50, category: 'Supervised' },
        { label: 'D', x: 75, y: 65, category: 'Supervised' }
      ]
    }
  },
  {
    name: 'Logistic Regression',
    type: 'Supervised',
    idea: 'Model probability with the logistic function.',
    visualization: {
      title: 'Sigmoid decision',
      summary: 'Scores map to probabilities via the S-curve.',
      type: 'timeline',
      stages: ['Compute linear score w = x·θ', 'Push through sigmoid σ(z)', 'Threshold to classify']
    }
  },
  {
    name: 'k-Nearest Neighbors',
    type: 'Supervised',
    idea: 'Predict using the majority/average of nearest samples.',
    visualization: {
      title: 'Neighborhood voting',
      summary: 'Points close in feature space cast the votes.',
      type: 'scatter',
      points: [
        { label: 'Q', x: 50, y: 50, category: 'Supervised' },
        { label: '1', x: 40, y: 55, category: 'Supervised' },
        { label: '2', x: 55, y: 60, category: 'Supervised' },
        { label: '3', x: 45, y: 40, category: 'Supervised' }
      ]
    }
  },
  {
    name: 'Decision Trees',
    type: 'Supervised',
    idea: 'Split data by feature thresholds to reduce impurity.',
    visualization: {
      title: 'Recursive splits',
      summary: 'Thresholds partition space into pure leaves.',
      type: 'flow',
      stages: [
        { title: 'Choose feature', detail: 'Pick split with best gain' },
        { title: 'Split dataset', detail: 'Route left/right on threshold' },
        { title: 'Leaf prediction', detail: 'Majority vote or mean' }
      ]
    }
  },
  {
    name: 'Random Forests',
    type: 'Ensemble',
    idea: 'Average many decision trees built on random subsets.',
    visualization: {
      title: 'Bagged trees',
      summary: 'Sampled data + features create decorrelated trees.',
      type: 'flow',
      stages: [
        { title: 'Bootstrap samples', detail: 'Draw rows with replacement' },
        { title: 'Train many trees', detail: 'Limit features per split' },
        { title: 'Aggregate', detail: 'Average/majority across trees' }
      ]
    }
  },
  {
    name: 'Gradient Boosting',
    type: 'Ensemble',
    idea: 'Sequentially add weak learners to correct residuals.',
    visualization: {
      title: 'Residual chasing',
      summary: 'Each learner fits what the previous missed.',
      type: 'timeline',
      stages: ['Fit first weak learner', 'Compute residuals', 'Fit next learner on residuals', 'Combine with learning rate']
    }
  },
  {
    name: 'Support Vector Machines',
    type: 'Supervised',
    idea: 'Maximize margin between classes with kernels.',
    visualization: {
      title: 'Maximum margin',
      summary: 'Support vectors define the separating hyperplane.',
      type: 'scatter',
      points: [
        { label: '+', x: 30, y: 70, category: 'Supervised' },
        { label: '+', x: 70, y: 75, category: 'Supervised' },
        { label: '-', x: 40, y: 35, category: 'Supervised' },
        { label: '-', x: 75, y: 40, category: 'Supervised' }
      ]
    }
  },
  {
    name: 'k-Means Clustering',
    type: 'Unsupervised',
    idea: 'Assign points to nearest centroids and iterate.',
    visualization: {
      title: 'Centroid updates',
      summary: 'Assign, recompute centers, repeat.',
      type: 'scatter',
      points: [
        { label: '1', x: 25, y: 35, category: 'Unsupervised' },
        { label: '2', x: 30, y: 65, category: 'Unsupervised' },
        { label: '3', x: 65, y: 45, category: 'Unsupervised' },
        { label: 'C₁', x: 28, y: 50, category: 'Unsupervised' }
      ]
    }
  },
  {
    name: 'Principal Component Analysis',
    type: 'Dimensionality reduction',
    idea: 'Rotate data to principal axes of variance.',
    visualization: {
      title: 'Variance axes',
      summary: 'Top components capture most spread.',
      type: 'timeline',
      stages: ['Center the data', 'Compute covariance matrix', 'Pick top eigenvectors as components']
    }
  },
  {
    name: 'Neural Networks',
    type: 'Deep learning',
    idea: 'Stack layers of nonlinear units trained with backprop.',
    visualization: {
      title: 'Layered processing',
      summary: 'Inputs flow forward; gradients flow backward.',
      type: 'flow',
      stages: [
        { title: 'Forward pass', detail: 'Multiply, sum, and activate' },
        { title: 'Loss', detail: 'Compare prediction to target' },
        { title: 'Backprop', detail: 'Chain-rule gradients update weights' }
      ]
    }
  },
  {
    name: 'Reinforcement Learning (Q-learning)',
    type: 'RL',
    idea: 'Learn action values via temporal-difference updates.',
    visualization: {
      title: 'Value iteration',
      summary: 'Bootstrapped Q estimates guide exploration.',
      type: 'timeline',
      stages: ['Observe state and choose action', 'Receive reward and next state', "Update Q(s, a) toward reward + γ maxₐ′ Q(s′, a′)"]
    }
  }
], 'ML & AI');

export const allItems = [...dsaAlgorithms, ...designPatterns, ...mlAlgorithms];
export const visualizedItems = allItems.filter(item => Boolean(item.visualization));
export const pendingVisualizations = allItems.filter(item => !item.visualization);
export { slugify };
