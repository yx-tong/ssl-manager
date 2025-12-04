import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Certificates from '@/views/Certificates.vue'
import Domains from '@/views/Domains.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/certificates',
      name: 'Certificates',
      component: Certificates
    },
    {
      path: '/domains',
      name: 'Domains',
      component: Domains
    }
  ]
})

export default router