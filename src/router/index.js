import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/pages/auth/Login.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/home',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/Users.vue'),
                    meta: { requiresAuth: true }
                },
            ]
        },
    
    ]
});

export default router;
