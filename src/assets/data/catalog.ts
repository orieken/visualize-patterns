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
      category: 'Creational',
      intent: 'Ensure a class has a single instance and a global access point.',
      idea: 'Guard instantiation with a private constructor and hand out one shared object.',
      visualization: {
        type: 'timeline',
        title: 'One instance lifecycle',
        summary: 'Callers ask the class for the sole instance and reuse it everywhere.',
        stages: ['Call getInstance()', 'Create instance once', 'Reuse cached instance on every call']
      }
    },
    {
      name: 'Factory Method',
      category: 'Creational',
      intent: 'Create objects via subclass-chosen factories to decouple construction.',
      idea: 'Base class defines the creation hook, subclasses pick the concrete product.',
      visualization: {
        type: 'flow',
        title: 'Subclass chooses product',
        summary: 'Clients call creator, which defers concrete instantiation to subclasses.',
        stages: [
          { title: 'Creator defines factory()', detail: 'Abstract hook exposes product creation' },
          { title: 'Concrete creators override', detail: 'Each subclass returns its own product' },
          { title: 'Client uses interface', detail: 'Client only depends on the product contract' }
        ]
      }
    },
    {
      name: 'Abstract Factory',
      category: 'Creational',
      intent: 'Provide families of related objects without specifying concrete classes.',
      idea: 'Expose a suite of creation methods so variants stay consistent.',
      visualization: {
        type: 'flow',
        title: 'Families of products',
        summary: 'Factories output coordinated products for a single theme or platform.',
        stages: [
          { title: 'Client asks for family', detail: 'Requests come through the abstract factory' },
          { title: 'Concrete factory picked', detail: 'Implementation chosen by environment or config' },
          { title: 'Products stay compatible', detail: 'Widgets share style and work together' }
        ]
      }
    },
    {
      name: 'Builder',
      category: 'Creational',
      intent: 'Construct complex objects step by step while controlling representation.',
      idea: 'Directors orchestrate ordered steps while builders decide how parts materialize.',
      visualization: {
        type: 'timeline',
        title: 'Guided assembly',
        summary: 'Director issues steps; builder accumulates parts into the final product.',
        stages: ['Reset builder', 'Add parts via steps', 'Return assembled product']
      }
    },
    {
      name: 'Prototype',
      category: 'Creational',
      intent: 'Clone existing objects instead of instantiating new ones.',
      idea: 'Copy an initialized exemplar to skip repetitive setup.',
      visualization: {
        type: 'timeline',
        title: 'Clone the exemplar',
        summary: 'Requests duplicate the prototype, optionally tweaking shallow or deep state.',
        stages: ['Store configured prototype', 'Invoke clone()', 'Adjust copy if needed']
      }
    },
    {
      name: 'Adapter',
      category: 'Structural',
      intent: 'Convert one interface into another that clients expect.',
      idea: 'Wrap an incompatible object so its methods match the target contract.',
      visualization: {
        type: 'flow',
        title: 'Bridging interfaces',
        summary: 'Client talks to adapter which delegates to the adaptee.',
        stages: [
          { title: 'Client calls target API', detail: 'Only knows the expected interface' },
          { title: 'Adapter translates', detail: 'Converts parameters and forwards work' },
          { title: 'Adaptee executes', detail: 'Legacy or 3rd-party object performs the action' }
        ]
      }
    },
    {
      name: 'Bridge',
      category: 'Structural',
      intent: 'Decouple abstraction from implementation so both can vary independently.',
      idea: 'Split what you do (abstraction) from how it is done (implementor).',
      visualization: {
        type: 'flow',
        title: 'Two dimensions of change',
        summary: 'Abstractions forward to interchangeable implementors.',
        stages: [
          { title: 'Abstraction defines API', detail: 'Holds a reference to an implementor' },
          { title: 'Refined abstractions extend', detail: 'Feature variants add behavior without changing implementors' },
          { title: 'Implementors vary', detail: 'Concrete implementors supply platform-specific work' }
        ]
      }
    },
    {
      name: 'Composite',
      category: 'Structural',
      intent: 'Treat part-whole object hierarchies uniformly.',
      idea: 'Leaves and containers share the same interface so operations recurse naturally.',
      visualization: {
        type: 'timeline',
        title: 'Uniform operations',
        summary: 'Clients call one method; composites propagate to children and leaves execute.',
        stages: ['Client calls component', 'Composite forwards to children', 'Leaves perform the work']
      }
    },
    {
      name: 'Decorator',
      category: 'Structural',
      intent: 'Attach responsibilities dynamically without altering the original class.',
      idea: 'Wrap components in layers that add behavior before/after delegating.',
      visualization: {
        type: 'flow',
        title: 'Layered wrapping',
        summary: 'Each decorator holds a component reference and forwards the call.',
        stages: [
          { title: 'Client calls outermost', detail: 'Interface identical to component' },
          { title: 'Decorator adds behavior', detail: 'Pre/post processing around delegation' },
          { title: 'Core component runs', detail: 'Base behavior executes last' }
        ]
      }
    },
    {
      name: 'Facade',
      category: 'Structural',
      intent: 'Provide a simplified interface to a subsystem.',
      idea: 'One high-level API coordinates a set of complex or verbose calls.',
      visualization: {
        type: 'timeline',
        title: 'Subsystem shield',
        summary: 'Facade collects client calls and orchestrates the right subsystem steps.',
        stages: ['Client calls facade', 'Facade sequences subsystem objects', 'Client receives simplified result']
      }
    },
    {
      name: 'Flyweight',
      category: 'Structural',
      intent: 'Share state efficiently between many fine-grained objects.',
      idea: 'Cache intrinsic data and externalize context to reduce duplication.',
      visualization: {
        type: 'timeline',
        title: 'Pool shared state',
        summary: 'Factory reuses flyweights while callers pass extrinsic context.',
        stages: ['Request flyweight from pool', 'Reuse or create intrinsic state', 'Supply extrinsic data per call']
      }
    },
    {
      name: 'Proxy',
      category: 'Structural',
      intent: 'Provide a surrogate to control access to another object.',
      idea: 'Stand-in object manages access, caching, or remoting before touching the real subject.',
      visualization: {
        type: 'flow',
        title: 'Controlled access',
        summary: 'Proxy implements the same interface and decides when to reach the real subject.',
        stages: [
          { title: 'Client calls proxy', detail: 'Signature matches the subject' },
          { title: 'Proxy guards/optimizes', detail: 'Lazy-load, check permissions, or cache' },
          { title: 'Real subject invoked', detail: 'Proxy forwards the approved request' }
        ]
      }
    },
    {
      name: 'Chain of Responsibility',
      category: 'Behavioral',
      intent: 'Pass requests through a chain until one handles it.',
      idea: 'Handlers link together; each decides to process or forward.',
      visualization: {
        type: 'timeline',
        title: 'Linked handlers',
        summary: 'Request walks the chain until a handler claims it.',
        stages: ['Create handler chain', 'Send request to head', 'Stop when handler processes or chain ends']
      }
    },
    {
      name: 'Command',
      category: 'Behavioral',
      intent: 'Encapsulate a request as an object for parameterization and logging.',
      idea: 'Commands capture receiver and parameters so invokers can queue, undo, or log them.',
      visualization: {
        type: 'flow',
        title: 'Requests as objects',
        summary: 'Invoker triggers commands which call receivers.',
        stages: [
          { title: 'Create command', detail: 'Bind receiver + action' },
          { title: 'Invoker executes', detail: 'Invoker knows only the command interface' },
          { title: 'Receiver performs', detail: 'Actual work happens in receiver' }
        ]
      }
    },
    {
      name: 'Interpreter',
      category: 'Behavioral',
      intent: 'Define a language grammar and interpret sentences.',
      idea: 'Represent grammar rules as expression classes that evaluate recursively.',
      visualization: {
        type: 'timeline',
        title: 'Parse tree evaluation',
        summary: 'Expressions interpret input tokens and delegate to children.',
        stages: ['Tokenize input', 'Build expression tree', 'Evaluate tree nodes recursively']
      }
    },
    {
      name: 'Iterator',
      category: 'Behavioral',
      intent: 'Access elements of an aggregate sequentially without exposing representation.',
      idea: 'Expose a small cursor API so collections remain encapsulated.',
      visualization: {
        type: 'timeline',
        title: 'Cursor over a collection',
        summary: 'Iterators track position and yield elements in order.',
        stages: ['Initialize iterator at start', 'Check hasNext()', 'Return current item and advance']
      }
    },
    {
      name: 'Mediator',
      category: 'Behavioral',
      intent: 'Centralize complex communication and control between objects.',
      idea: 'Colleagues talk to a mediator instead of each other to reduce coupling.',
      visualization: {
        type: 'flow',
        title: 'Hub for colleagues',
        summary: 'Mediator routes messages and coordinates actions.',
        stages: [
          { title: 'Colleague notifies mediator', detail: 'Reports event or request' },
          { title: 'Mediator decides', detail: 'Determines which colleagues to notify' },
          { title: 'Mediator broadcasts', detail: 'Updates or commands other colleagues' }
        ]
      }
    },
    {
      name: 'Memento',
      category: 'Behavioral',
      intent: 'Capture and restore an object’s internal state without violating encapsulation.',
      idea: 'Snapshot state into a token managed by a caretaker for undo/restore.',
      visualization: {
        type: 'timeline',
        title: 'Snapshot and restore',
        summary: 'Originator exports mementos that caretakers store and reapply later.',
        stages: ['Originator creates memento', 'Caretaker stores history', 'Restore applies a chosen memento']
      }
    },
    {
      name: 'Observer',
      category: 'Behavioral',
      intent: 'Define a one-to-many dependency for automatic updates.',
      idea: 'Subjects notify subscribed observers when state changes.',
      visualization: {
        type: 'flow',
        title: 'Publish and subscribe',
        summary: 'Observers register once and receive updates on change events.',
        stages: [
          { title: 'Observers subscribe', detail: 'Attach to subject' },
          { title: 'Subject changes state', detail: 'Triggers notification' },
          { title: 'Observers react', detail: 'Update views or trigger side effects' }
        ]
      }
    },
    {
      name: 'State',
      category: 'Behavioral',
      intent: 'Let an object alter behavior when its internal state changes.',
      idea: 'State objects represent modes and handle events, swapping themselves as needed.',
      visualization: {
        type: 'timeline',
        title: 'Mode transitions',
        summary: 'Context delegates to current state object and switches as transitions occur.',
        stages: ['Context delegates request', 'State handles or transitions', 'Context swaps to new state when needed']
      }
    },
    {
      name: 'Strategy',
      category: 'Behavioral',
      intent: 'Define a family of algorithms and make them interchangeable.',
      idea: 'Encapsulate algorithms behind a shared interface and inject them at runtime.',
      visualization: {
        type: 'timeline',
        title: 'Plug-in algorithms',
        summary: 'Context selects a strategy and forwards requests without knowing details.',
        stages: ['Configure context with strategy', 'Context delegates calls', 'Swap strategy to change behavior']
      }
    },
    {
      name: 'Template Method',
      category: 'Behavioral',
      intent: 'Define skeleton of an algorithm with overridable steps.',
      idea: 'Base class locks in the order while subclasses override specific hooks.',
      visualization: {
        type: 'timeline',
        title: 'Skeleton algorithm',
        summary: 'Template runs invariant steps and optional hooks overridden by subclasses.',
        stages: ['Run fixed pre-steps', 'Call overridable hooks', 'Execute fixed cleanup']
      }
    },
    {
      name: 'Visitor',
      category: 'Behavioral',
      intent: 'Represent operations to be performed on elements of an object structure.',
      idea: 'Double dispatch lets new operations run across varied element types without editing them.',
      visualization: {
        type: 'flow',
        title: 'Double dispatch in action',
        summary: 'Visitor visits each element; element calls back with its concrete type.',
        stages: [
          { title: 'Elements accept visitor', detail: 'Each element invokes visitor.visit(this)' },
          { title: 'Visitor executes variant', detail: 'Method overload handles concrete element' },
          { title: 'New visitors add behavior', detail: 'Extend operations without altering elements' }
        ]
      }
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
