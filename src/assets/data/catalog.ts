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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      explanation: "The Singleton pattern ensures that a class has only one instance and provides a global point of access to it. It's like a government registry or a printer spooler—you don't want multiple conflicting copies running around; you need exactly one source of truth.\n\nIn code, this is achieved by:\n1. Making the constructor private so no one can simply say `new Singleton()`.\n2. Creating a static method (often named `getInstance()`) that acts as the gatekeeper.\n3. Storing the single instance in a private static variable.\n\nWhen `getInstance()` is called, it checks if the instance already exists. If not, it creates it. If it does, it simply returns the existing one. This 'lazy initialization' saves resources if the object is never needed.",
      visualization: {
        type: 'interactive',
        component: 'SingletonInteractive',
        title: 'Interactive Singleton Lifecycle',
        summary: 'Click to see how the instance is lazily created and reused.'
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
