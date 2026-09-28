import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/home-page.vue';
import NotFoundPage from './pages/not-found-page.vue';
import PreviewPage from './pages/preview-page.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/preview/:slug(.*)', component: PreviewPage, props: true },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
});
