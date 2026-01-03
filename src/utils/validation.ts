export const getCodeSuggestions = (slug: string, code: string): string[] => {
    const suggestions: string[] = [];
    const lowerCode = code.toLowerCase();

    // General Checks
    if (code.trim().length < 50) {
        suggestions.push("Your code seems very short. Did you implement the full solution?");
    }

    // Specific Heuristics
    switch (slug) {
        case 'breadth-first-search':
            if (!lowerCode.includes('shift') && !lowerCode.includes('dequeue')) {
                suggestions.push("💡 Tip: BFS typically uses a Queue. Are you using 'shift()' or a queue structure?");
            }
            if (!lowerCode.includes('push') && !lowerCode.includes('enqueue')) {
                suggestions.push("💡 Tip: You'll need to add neighbors to your queue.");
            }
            break;
            
        case 'depth-first-search':
            if (!lowerCode.includes('pop') && !lowerCode.includes('recursion') && !lowerCode.includes('recursive')) {
                suggestions.push("💡 Tip: DFS usually involves a Stack ('pop()') or Recursion.");
            }
            break;

        case 'dijkstra':
        case 'a-search':
            if (!lowerCode.includes('priority') && !lowerCode.includes('sort') && !lowerCode.includes('min')) {
                suggestions.push("💡 Tip: Pathfinding often needs a Priority Queue or sorting to find the closest node.");
            }
            break;

        case 'singleton':
            if (!lowerCode.includes('static instance')) {
                suggestions.push("💡 Pattern Check: Singleton usually holds a 'private static instance'.");
            }
            if (!lowerCode.includes('private constructor')) {
                suggestions.push("💡 Pattern Check: Make sure your constructor is 'private' to prevent direct instantiation.");
            }
            break;

        case 'observer':
            if (!lowerCode.includes('notify') && !lowerCode.includes('update')) {
                suggestions.push("💡 Pattern Check: Observers need a way to 'notify' subscribers.");
            }
            break;
            
        case 'iterator':
            if (!lowerCode.includes('next') || !lowerCode.includes('hasnext')) {
                suggestions.push("💡 Pattern Check: Iterators typically implement 'next()' and 'hasNext()'.");
            }
            break;
    }

    return suggestions;
};
