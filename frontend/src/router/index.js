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
  },
  {
    path: '/termination',
    name: 'Termination',
    component: () => import('../views/Termination.vue')
  },
  {
    path: '/repair',
    name: 'Repair',
    component: () => import('../views/Repair.vue')
  },
  {
    path: '/invoice',
    name: 'Invoice',
    component: () => import('../views/Invoice.vue')
  },
  {
    path: '/order-detail',
    name: 'OrderDetail',
    component: () => import('../views/OrderDetail.vue')
  },
  {
    path: '/repair-detail',
    name: 'RepairDetail',
    component: () => import('../views/RepairDetail.vue')
  },
  {
    path: '/after-sales',
    name: 'AfterSalesList',
    component: () => import('../views/AfterSalesList.vue')
  },
  {
    path: '/after-sales-detail',
    name: 'AfterSalesDetail',
    component: () => import('../views/AfterSalesDetail.vue')
  },
  {
    path: '/after-sales-create',
    name: 'AfterSalesCreate',
    component: () => import('../views/AfterSalesCreate.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
