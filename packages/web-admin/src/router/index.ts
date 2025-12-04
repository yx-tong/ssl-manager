import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'AdminLogin',
        component: () => import('@/views/Login.vue'),
        meta: { title: 'Admin Login', requiresGuest: true },
    },
    {
        path: '/dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: 'Dashboard', requiresAuth: true },
    },
    {
        path: '/domains',
        name: 'AdminDomains',
        component: () => import('@/views/Domains.vue'),
        meta: { title: 'Domains Management', requiresAuth: true },
    },
    {
        path: '/certificates',
        name: 'AdminCertificates',
        component: () => import('@/views/Certificates.vue'),
        meta: { title: 'Certificates Management', requiresAuth: true },
    },
    {
        path: '/users',
        name: 'AdminUsers',
        component: () => import('@/views/Users.vue'),
        meta: { title: 'Users Management', requiresAuth: true },
    },
    {
        path: '/settings',
        name: 'AdminSettings',
        component: () => import('@/views/Settings.vue'),
        meta: { title: 'Settings', requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('admin-token')

    if (to.meta.requiresAuth && !token) {
        // 需要认证但未登录，跳转到登录页
        next('/login')
    } else if (to.meta.requiresGuest && token) {
        // 已登录但访问访客页面，跳转到仪表板
        next('/dashboard')
    } else {
        next()
    }
})

export default router
