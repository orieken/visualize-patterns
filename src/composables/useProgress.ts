import { ref, computed } from 'vue';

const STORAGE_KEY = 'pattern-mastery-v1';

const masteredItems = ref<Set<string>>(new Set());

// Initialize from local storage
const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                masteredItems.value = new Set(parsed);
            }
        } catch (e) {
            console.error('Failed to load mastery', e);
        }
    }
};

const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(masteredItems.value)));
};

export function useProgress() {
    // Ensure we are initialized (idempotent)
    if (masteredItems.value.size === 0) {
        init();
    }

    const toggleMastery = (slug: string) => {
        if (masteredItems.value.has(slug)) {
            masteredItems.value.delete(slug);
        } else {
            masteredItems.value.add(slug);
        }
        save();
    };

    const isMastered = (slug: string) => masteredItems.value.has(slug);
    
    const totalMastered = computed(() => masteredItems.value.size);
    
    // Calculate level based on mastered count (e.g. 5 items per level)
    const level = computed(() => {
        // Base level 1, +1 for every 5 items
        return 1 + Math.floor(masteredItems.value.size / 5);
    });
    const getCategoryProgress = (items: { slug?: string }[]) => {
        const total = items.length;
        const validSlugs = items.map(i => i.slug).filter((s): s is string => !!s);
        const completed = validSlugs.filter(slug => masteredItems.value.has(slug)).length;
        return {
            total,
            completed,
            percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
        };
    };

    return {
        masteredItems,
        toggleMastery,
        isMastered,
        totalMastered,
        level,
        getCategoryProgress
    };
}
