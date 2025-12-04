import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
    },
    {
        path: '/domains',
        name: 'Domains',
        component: () => import('@/views/Domains.vue'),
    },
    {
        path: '/certificates',
        name: 'Certificates',
        component: () => import('@/views/Certificates.vue'),
    },
    {
        path: '/domain/:id',
        name: 'DomainDetail',
        component: () => import('@/views/DomainDetail.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
