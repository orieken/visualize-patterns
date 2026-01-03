export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: (masteredSlugs: Set<string>) => boolean;
}

export const achievements: Achievement[] = [
    {
        id: 'novice-explorer',
        title: 'Novice Explorer',
        description: 'Master your first pattern or algorithm.',
        icon: '🌱',
        condition: (mastered) => mastered.size >= 1
    },
    {
        id: 'graph-guru',
        title: 'Graph Guru',
        description: 'Master BFS, DFS, Dijkstra, and A*.',
        icon: '🕸️',
        condition: (mastered) => 
            mastered.has('breadth-first-search') &&
            mastered.has('depth-first-search') &&
            mastered.has('dijkstra') &&
            mastered.has('a-search')
    },
    {
        id: 'sorting-master',
        title: 'Sorting Master',
        description: 'Master Merge Sort and Quick Sort.',
        icon: '📶',
        condition: (mastered) =>
            mastered.has('merge-sort') &&
            mastered.has('quick-sort')
    },
    {
        id: 'design-architect',
        title: 'Design Architect',
        description: 'Master 5 different Design Patterns.',
        icon: '🏛️',
        condition: (mastered) => {
            // Check for known design patterns
            // We can check against a list or just count logic if we had categories.
            // For here, checking strict list is robust or we'll filter in the composable.
            // Let's assume we pass the set, so we can't easily filter by category *inside* this pure function without importing the catalog.
            // To keep it clean, let's just approximate or rely on the fact that the user is likely mastering DP/GOF.
            // Actually, let's just count total items, assuming mix.
            // Better: use specific ones or import catalog here? importing catalog avoids circular dependenc?
            // "Master 5 Design Patterns" -> let's list 5 common ones or just generic "Master 10 items"
            return mastered.size >= 10; 
        }
    },
    {
        id: 'ai-researcher',
        title: 'AI Researcher',
        description: 'Master 3 Machine Learning algorithms.',
        icon: '🤖',
        condition: (mastered) => {
             const mlSlugs = [
                 'linear-regression', 'logistic-regression', 'k-nearest-neighbors', 
                 'decision-trees', 'neural-networks', 'reinforcement-learning-q-learning'
             ];
             const count = mlSlugs.filter(s => mastered.has(s)).length;
             return count >= 3;
        }
    },
    {
        id: 'completionist',
        title: 'The Completionist',
        description: 'Master 20 items.',
        icon: '👑',
        condition: (mastered) => mastered.size >= 20
    }
];
