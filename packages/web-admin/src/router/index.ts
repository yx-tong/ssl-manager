import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: 'Dashboard' }
  },
  {
    path: '/domains',
    name: 'AdminDomains',
    component: () => import('@/views/Domains.vue'),
    meta: { title: 'Domains Management' }
  },
  {
    path: '/certificates',
    name: 'AdminCertificates',
    component: () => import('@/views/Certificates.vue'),
    meta: { title: 'Certificates Management' }
  },
  {
    path: '/users',
    name: 'AdminUsers',
    component: () => import('@/views/Users.vue'),
    meta: { title: 'Users Management' }
  },
  {
    path: '/settings',
    name: 'AdminSettings',
    component: () => import('@/views/Settings.vue'),
    meta: { title: 'Settings' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router