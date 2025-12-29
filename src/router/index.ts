import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DetailView from '../views/DetailView.vue';
import DsaView from '../views/DsaView.vue';
import PatternsView from '../views/PatternsView.vue';
import MlAiView from '../views/MlAiView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dsa',
    name: 'dsa',
    component: DsaView
  },
  {
    path: '/patterns',
    name: 'patterns',
    component: PatternsView
  },
  {
    path: '/ml-ai',
    name: 'ml-ai',
    component: MlAiView
  },
  {
    path: '/visualize/:slug',
    name: 'visualization',
    component: DetailView,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes
});

export default router;
