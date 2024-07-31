import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import Login from '@/views/pages/auth/Login.vue';
import { authService } from '@/service/AuthService'; // Asegúrate de importar tu servicio de autenticación

const routes = [
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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Route guard to check authentication
router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = !!authService.getToken(); // Check if token exists

    if (requiresAuth && !isAuthenticated) {
        // Redirect to login if not authenticated and route requires authentication
        next('/');
    } else {
        // Proceed to route
        next();
    }
});

export default router;
