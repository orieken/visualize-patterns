export const dsaAlgorithms = [
  {
    name: 'Breadth-First Search',
    category: 'Graph traversal',
    complexity: 'O(V + E)',
    idea: 'Explore neighbors level by level using a queue.'
  },
  {
    name: 'Depth-First Search',
    category: 'Graph traversal',
    complexity: 'O(V + E)',
    idea: 'Go deep with a stack/recursion to explore paths.'
  },
  {
    name: 'Dijkstra',
    category: 'Shortest path',
    complexity: 'O((V + E) log V)',
    idea: 'Greedily relax edges using a priority queue to find shortest paths.'
  },
  {
    name: 'A* Search',
    category: 'Shortest path',
    complexity: 'O((V + E) log V)',
    idea: 'Dijkstra enhanced with a heuristic that prioritizes promising nodes.'
  },
  {
    name: 'Merge Sort',
    category: 'Sorting',
    complexity: 'O(n log n)',
    idea: 'Divide and conquer by sorting halves then merging.'
  },
  {
    name: 'Quick Sort',
    category: 'Sorting',
    complexity: 'O(n log n) average',
    idea: 'Partition around a pivot so smaller elements go left and larger go right.'
  },
  {
    name: 'Union-Find',
    category: 'Disjoint sets',
    complexity: 'Amortized near O(1)',
    idea: 'Track connected components with path compression and union by rank.'
  },
  {
    name: 'Topological Sort',
    category: 'Graph ordering',
    complexity: 'O(V + E)',
    idea: 'Linear order of DAG nodes produced via DFS or Kahn’s algorithm.'
  },
  {
    name: 'Knuth-Morris-Pratt',
    category: 'String matching',
    complexity: 'O(n + m)',
    idea: 'Preprocess pattern to skip redundant comparisons.'
  },
  {
    name: 'Dynamic Programming (Fibonacci)',
    category: 'Optimization',
    complexity: 'O(n)',
    idea: 'Cache sub-results to avoid repeated work.'
  }
];

export const designPatterns = [
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
];

export const mlAlgorithms = [
  { name: 'Linear Regression', type: 'Supervised', idea: 'Fit a line to minimize squared error.' },
  { name: 'Logistic Regression', type: 'Supervised', idea: 'Model probability with the logistic function.' },
  { name: 'k-Nearest Neighbors', type: 'Supervised', idea: 'Predict using the majority/average of nearest samples.' },
  { name: 'Decision Trees', type: 'Supervised', idea: 'Split data by feature thresholds to reduce impurity.' },
  { name: 'Random Forests', type: 'Ensemble', idea: 'Average many decision trees built on random subsets.' },
  { name: 'Gradient Boosting', type: 'Ensemble', idea: 'Sequentially add weak learners to correct residuals.' },
  { name: 'Support Vector Machines', type: 'Supervised', idea: 'Maximize margin between classes with kernels.' },
  { name: 'k-Means Clustering', type: 'Unsupervised', idea: 'Assign points to nearest centroids and iterate.' },
  { name: 'Principal Component Analysis', type: 'Dimensionality reduction', idea: 'Rotate data to principal axes of variance.' },
  { name: 'Neural Networks', type: 'Deep learning', idea: 'Stack layers of nonlinear units trained with backprop.' },
  { name: 'Reinforcement Learning (Q-learning)', type: 'RL', idea: 'Learn action values via temporal-difference updates.' }
];
