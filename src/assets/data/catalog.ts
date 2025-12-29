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
        stages: [
          'Start with source and heuristic estimates',
          'Expand node with smallest f = g + h',
          'Update neighbors with better scores',
          'Terminate when goal dequeued'
        ]
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
  ],
  'DS&A'
);

export const designPatterns: CatalogItem[] = normalizeItems(
  [
    {
      name: 'Singleton',
      intent: 'Ensure a class has a single instance and a global access point.',
      idea: 'Guard construction so callers always receive the same shared instance.',
      visualization: {
        title: 'Single entry point',
        summary: 'All callers funnel through one lazy-created instance.',
        type: 'timeline',
        stages: ['Check for existing instance', 'Create once if missing', 'Return the shared reference']
      }
    },
    {
      name: 'Factory Method',
      intent: 'Create objects via subclass-chosen factories to decouple construction.',
      idea: 'Defer which concrete product is built to specialized creators.',
      visualization: {
        title: 'Creator delegates choice',
        summary: 'Subclass factories decide which product to return.',
        type: 'flow',
        stages: [
          { title: 'Request product', detail: 'Client calls the creator API' },
          { title: 'Subclass picks', detail: 'Concrete creator chooses product type' },
          { title: 'Deliver instance', detail: 'Creator returns a product that matches the request' }
        ]
      }
    },
    {
      name: 'Abstract Factory',
      intent: 'Provide families of related objects without specifying concrete classes.',
      idea: 'Expose a kit of products that stay consistent inside each family.',
      visualization: {
        title: 'Consistent families',
        summary: 'Client picks a family; the factory supplies matching parts.',
        type: 'flow',
        stages: [
          { title: 'Select family', detail: 'Choose theme such as “dark” or “light” widgets' },
          { title: 'Create products', detail: 'Factory spawns coordinated pieces from the family' },
          { title: 'Assemble suite', detail: 'Client composes the compatible objects together' }
        ]
      }
    },
    {
      name: 'Builder',
      intent: 'Construct complex objects step by step while controlling representation.',
      idea: 'Separate construction steps from final assembly for varied outputs.',
      visualization: {
        title: 'Incremental build',
        summary: 'Director drives ordered steps before returning the product.',
        type: 'timeline',
        stages: ['Configure builder', 'Apply step-by-step adds', 'Assemble and return the product']
      }
    },
    {
      name: 'Prototype',
      intent: 'Clone existing objects instead of instantiating new ones.',
      idea: 'Copy a primed prototype and adjust to avoid costly setup.',
      visualization: {
        title: 'Clone then customize',
        summary: 'Duplication preserves structure while tweaks personalize it.',
        type: 'timeline',
        stages: ['Choose prototype', 'Clone the base object', 'Apply targeted customizations']
      }
    },
    {
      name: 'Adapter',
      intent: 'Convert one interface into another that clients expect.',
      idea: 'Wrap an incompatible API to translate calls on the fly.',
      visualization: {
        title: 'Translator wrapper',
        summary: 'Adapter rephrases the client call for the adaptee.',
        type: 'flow',
        stages: [
          { title: 'Client calls target', detail: 'Requests use the expected interface' },
          { title: 'Adapter maps', detail: 'Convert parameters and method names' },
          { title: 'Adaptee responds', detail: 'Real work happens behind the adapter' }
        ]
      }
    },
    {
      name: 'Bridge',
      intent: 'Decouple abstraction from implementation so both can vary independently.',
      idea: 'Split the high-level API from low-level implementations and bind them at runtime.',
      visualization: {
        title: 'Two-layer handshake',
        summary: 'Abstractions forward work to interchangeable implementors.',
        type: 'flow',
        stages: [
          { title: 'Define abstraction', detail: 'High-level control owns an implementor handle' },
          { title: 'Plug implementor', detail: 'Bind a specific platform/driver at runtime' },
          { title: 'Delegate calls', detail: 'Abstraction forwards operations to the implementor' }
        ]
      }
    },
    {
      name: 'Composite',
      intent: 'Treat part-whole object hierarchies uniformly.',
      idea: 'Leaf and container nodes share the same interface so clients recurse naturally.',
      visualization: {
        title: 'Tree of components',
        summary: 'Uniform operations walk a nested hierarchy.',
        type: 'graph',
        nodes: [
          { id: 'Root', layer: 0 },
          { id: 'Branch A', layer: 1 },
          { id: 'Branch B', layer: 1 },
          { id: 'Leaf 1', layer: 2 },
          { id: 'Leaf 2', layer: 2 },
          { id: 'Leaf 3', layer: 2 }
        ],
        order: ['Root', 'Branch A', 'Leaf 1', 'Leaf 2', 'Branch B', 'Leaf 3']
      }
    },
    {
      name: 'Decorator',
      intent: 'Attach responsibilities dynamically without altering the original class.',
      idea: 'Wrap components in layers to add behaviors before or after delegating.',
      visualization: {
        title: 'Layered wrappers',
        summary: 'Each decorator adds flavor then forwards to the next.',
        type: 'timeline',
        stages: ['Wrap the core component', 'Add behavior in the decorator', 'Forward call to inner component']
      }
    },
    {
      name: 'Facade',
      intent: 'Provide a simplified interface to a subsystem.',
      idea: 'Offer a gentle entry point that hides coordination across complex parts.',
      visualization: {
        title: 'One friendly door',
        summary: 'Facade orchestrates multiple subsystems for the caller.',
        type: 'flow',
        stages: [
          { title: 'Client calls facade', detail: 'Single API surface' },
          { title: 'Facade orchestrates', detail: 'Invoke underlying subsystem pieces' },
          { title: 'Return simplified result', detail: 'Caller never sees the internal complexity' }
        ]
      }
    },
    {
      name: 'Flyweight',
      intent: 'Share state efficiently between many fine-grained objects.',
      idea: 'Externalize unique data while pooling heavy intrinsic state.',
      visualization: {
        title: 'Shared core, unique tips',
        summary: 'Pool the heavy parts; pass in light extrinsic data.',
        type: 'timeline',
        stages: ['Request flyweight from pool', 'Reuse intrinsic shared state', 'Apply caller-provided extrinsic state']
      }
    },
    {
      name: 'Proxy',
      intent: 'Provide a surrogate to control access to another object.',
      idea: 'Interpose a stand-in to lazily load, secure, or cache the real subject.',
      visualization: {
        title: 'Controlled gateway',
        summary: 'Proxy vets requests before reaching the subject.',
        type: 'flow',
        stages: [
          { title: 'Client talks to proxy', detail: 'Proxy looks identical to the subject' },
          { title: 'Apply policy', detail: 'Authorize, cache, or defer creation' },
          { title: 'Forward to subject', detail: 'Real work executes behind the proxy' }
        ]
      }
    },
    {
      name: 'Chain of Responsibility',
      intent: 'Pass requests through a chain until one handles it.',
      idea: 'Link handlers so each can either process or forward the request.',
      visualization: {
        title: 'Linked handlers',
        summary: 'Request walks the chain until accepted.',
        type: 'flow',
        stages: [
          { title: 'Receive request', detail: 'Handler inspects the message' },
          { title: 'Handle or pass', detail: 'Process locally or forward to next link' },
          { title: 'Stop when handled', detail: 'Chain ends after a handler claims it' }
        ]
      }
    },
    {
      name: 'Command',
      intent: 'Encapsulate a request as an object for parameterization and logging.',
      idea: 'Package an action and its receiver into an invokable message.',
      visualization: {
        title: 'Action objects',
        summary: 'Commands queue, execute, and undo actions.',
        type: 'timeline',
        stages: ['Create command with receiver', 'Queue or log the request', 'Execute and optionally undo']
      }
    },
    {
      name: 'Interpreter',
      intent: 'Define a language grammar and interpret sentences.',
      idea: 'Model grammar rules as classes that evaluate an expression tree.',
      visualization: {
        title: 'Grammar walkthrough',
        summary: 'Tokens build an AST that is evaluated node by node.',
        type: 'timeline',
        stages: ['Tokenize input', 'Build parse tree', 'Evaluate expression nodes']
      }
    },
    {
      name: 'Iterator',
      intent: 'Access elements of an aggregate sequentially without exposing representation.',
      idea: 'Maintain traversal state externally so collections stay simple.',
      visualization: {
        title: 'Cursor over a collection',
        summary: 'Iterator steps through elements and signals completion.',
        type: 'flow',
        stages: [
          { title: 'Create iterator', detail: 'Initialize position before the first element' },
          { title: 'Advance cursor', detail: 'Move to next item and return it' },
          { title: 'Detect completion', detail: 'Stop when no elements remain' }
        ]
      }
    },
    {
      name: 'Mediator',
      intent: 'Centralize complex communication and control between objects.',
      idea: 'Colleagues talk only to the mediator, which coordinates reactions.',
      visualization: {
        title: 'Hub-and-spoke',
        summary: 'Mediator receives signals and routes updates.',
        type: 'flow',
        stages: [
          { title: 'Colleague notifies', detail: 'Send event to the mediator' },
          { title: 'Mediator decides', detail: 'Applies rules to determine responses' },
          { title: 'Broadcast updates', detail: 'Mediator calls other colleagues' }
        ]
      }
    },
    {
      name: 'Memento',
      intent: 'Capture and restore an object’s internal state without violating encapsulation.',
      idea: 'Snapshot current state into a token that can be stored externally.',
      visualization: {
        title: 'Save and rewind',
        summary: 'Originator issues snapshots and restores from them.',
        type: 'timeline',
        stages: ['Capture snapshot from originator', 'Mutate state safely', 'Restore from chosen memento']
      }
    },
    {
      name: 'Observer',
      intent: 'Define a one-to-many dependency for automatic updates.',
      idea: 'Subjects notify subscribed observers when something changes.',
      visualization: {
        title: 'Push updates',
        summary: 'Subjects broadcast changes to all observers.',
        type: 'flow',
        stages: [
          { title: 'Subject changes', detail: 'State mutates or event fires' },
          { title: 'Notify observers', detail: 'Loop through subscribers' },
          { title: 'Observers react', detail: 'Each listener updates itself' }
        ]
      }
    },
    {
      name: 'State',
      intent: 'Let an object alter behavior when its internal state changes.',
      idea: 'Swap the active state object to change behavior without conditionals.',
      visualization: {
        title: 'Context swaps brains',
        summary: 'Behavior routes to the active state object.',
        type: 'timeline',
        stages: ['Context holds a current state', 'Delegate behavior to that state', 'Transition swaps in a new state']
      }
    },
    {
      name: 'Strategy',
      intent: 'Define a family of algorithms and make them interchangeable.',
      idea: 'Inject different strategies to change the implementation behind the same API.',
      visualization: {
        title: 'Plug-in behaviors',
        summary: 'Context chooses which strategy to execute.',
        type: 'flow',
        stages: [
          { title: 'Select strategy', detail: 'Pick algorithm based on situation' },
          { title: 'Execute via context', detail: 'Context calls through the shared interface' },
          { title: 'Swap as needed', detail: 'Switch strategies without changing callers' }
        ]
      }
    },
    {
      name: 'Template Method',
      intent: 'Define skeleton of an algorithm with overridable steps.',
      idea: 'Base class outlines the steps; subclasses override hooks.',
      visualization: {
        title: 'Algorithm skeleton',
        summary: 'Fixed steps interleave with extension points.',
        type: 'timeline',
        stages: ['Run fixed pre-steps', 'Call hook for customization', 'Finish with fixed closing steps']
      }
    },
    {
      name: 'Visitor',
      intent: 'Represent operations to be performed on elements of an object structure.',
      idea: 'Visitors traverse elements and execute type-specific logic via double dispatch.',
      visualization: {
        title: 'Double dispatch tour',
        summary: 'Visitor walks the structure and calls back per concrete element.',
        type: 'flow',
        stages: [
          { title: 'Accept visitor', detail: 'Element hands control to visitor' },
          { title: 'Dispatch per type', detail: 'Visitor executes the matching overload' },
          { title: 'Accumulate result', detail: 'Visitor collects or applies side effects' }
        ]
      }
    }
  ],
  'Gang of Four'
);

export const mlAlgorithms: CatalogItem[] = normalizeItems(
  [
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
  ],
  'ML & AI'
);

export const allItems: CatalogItem[] = [...dsaAlgorithms, ...designPatterns, ...mlAlgorithms];
export const visualizedItems: CatalogItem[] = allItems.filter(item => Boolean(item.visualization));
export const pendingVisualizations: CatalogItem[] = allItems.filter(item => !item.visualization);
export { slugify };
