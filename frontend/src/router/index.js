import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/renewal'
  },
  {
    path: '/renewal',
    name: 'Renewal',
    component: () => import('../views/Renewal.vue')
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../views/Payment.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
