<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
        <!-- User Profile Card -->
        <div class="sidebar-card user-profile">
            <div class="avatar-large">👨‍💻</div>
            <div class="profile-info">
                <h2>Pattern Architect</h2>
                <div class="level-pill">Level {{ level }}</div>
            </div>
        </div>

        <!-- Main Progress Widget -->
        <div class="sidebar-card">
            <div class="label-row">
                <span>Total Mastery</span>
                <span class="highlight">{{ Math.round((completedItems / totalItems) * 100) }}%</span>
            </div>
            <ProgressBar :total="totalItems" :completed="completedItems" />
        </div>

        <!-- Category Stats Widget -->
        <div class="sidebar-card">
            <h3>Breakdown</h3>
            <div class="stat-stack">
                <div class="stat-item">
                    <span class="stat-label">DS & Algos</span>
                    <ProgressBar :total="dsaStats.total" :completed="dsaStats.completed" color="#3b82f6" />
                </div>
                <div class="stat-item">
                    <span class="stat-label">Design Patterns</span>
                    <ProgressBar :total="patternStats.total" :completed="patternStats.completed" color="#8b5cf6" />
                </div>
                <div class="stat-item">
                    <span class="stat-label">ML & AI</span>
                    <ProgressBar :total="mlStats.total" :completed="mlStats.completed" color="#ec4899" />
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <RouterLink to="/playground" class="action-btn">
            👨‍💻 Open Code Playground
        </RouterLink>
    </aside>

    <div class="content-feed">
        <VisualizationChecklist :items="allItems" />

        <SectionGrid
            title="DS&A"
            subtitle="Algorithm cheat-sheets"
            description="Quick reminders of runtime and core ideas for classic interview-ready algorithms."
            :items="dsaAlgorithms"
        />

        <SectionGrid
            title="Gang of Four"
            subtitle="Design patterns"
            description="Capture each pattern's intent in a single card for rapid comparison."
            :items="designPatterns"
        />

        <SectionGrid
            title="ML & AI"
            subtitle="Model intuition"
            description="Anchor ML study sessions with concise mental models for common learners."
            :items="mlAlgorithms"
        />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SectionGrid from '../components/SectionGrid.vue';
import VisualizationChecklist from '../components/VisualizationChecklist.vue';
import ProgressBar from '../components/ProgressBar.vue';
import { allItems, dsaAlgorithms, designPatterns, mlAlgorithms } from '../assets/data/catalog';
import { useProgress } from '../composables/useProgress';

const { totalMastered, level, getCategoryProgress } = useProgress();

const totalItems = computed(() => allItems.length);
const completedItems = totalMastered;

const dsaStats = computed(() => getCategoryProgress(dsaAlgorithms));
const patternStats = computed(() => getCategoryProgress(designPatterns));
const mlStats = computed(() => getCategoryProgress(mlAlgorithms));
</script>

<style scoped>
.dashboard-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2.5rem;
    align-items: start;
}

.sidebar {
    position: sticky;
    top: 80px; /* Account for global header */
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.sidebar-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-card);
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
}

.user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, var(--card-bg) 0%, rgba(37, 99, 235, 0.03) 100%);
}

.avatar-large {
    font-size: 3.5rem;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-app);
    border-radius: 50%;
    border: 3px solid var(--primary);
    margin-bottom: 0.75rem;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.profile-info h2 {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
    color: var(--text-main);
}

.level-pill {
    background: linear-gradient(90deg, #f59e0b, #d97706);
    color: white;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    display: inline-block;
    box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.label-row {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.highlight {
    color: var(--primary);
    font-weight: 800;
}

h3 {
    font-size: 0.95rem;
    text-transform: uppercase;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    margin: 0 0 1rem 0;
}

.stat-stack {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.stat-label {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
}

.action-btn {
    background: var(--primary);
    color: white;
    text-align: center;
    padding: 1rem;
    border-radius: var(--radius-btn);
    font-weight: 700;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.4);
    text-decoration: none;
}

.content-feed {
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

@media (max-width: 900px) {
    .dashboard-layout {
        grid-template-columns: 1fr;
    }
    
    .sidebar {
        position: static;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
}
</style>
