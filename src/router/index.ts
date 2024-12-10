import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import AdminView from '@/views/AdminView.vue';
import ClientsView from '@/views/ClientsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
      component: () => import('@/views/LoginView.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/components/login/Login.vue')
        },
        {
          path: 'confirmation',
          name: 'confirmaccount',
          component: () => import('@/components/login/ConfirmEmail.vue')
        },
        {
          path: 'recovery',
          name: 'recoveypass',
          component: () => import('@/components/login/Recovery.vue')
        },
        {
          path: 'verify',
          name: 'verifyaccount',
          component: () => import('@/components/login/Verify.vue')
        },
      ]
    },
    {
      path: '/admin',
      name: 'Administrador',
      redirect: '/admin/dashboard',
      component: () => import('@/views/AdminView.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'admin',
          component: () => import('@/components/admin/Dashboard.vue')
        },
        {
          path: 'clientes',
          name: 'clientes',
          component: () => import('@/components/admin/Clientes.vue')
        },
        {
          path: 'predios',
          name: 'predios',
          component: () => import('@/components/admin/Predios.vue')
        },
        {
          path: 'directores',
          name: 'directores',
          component: () => import('@/components/admin/Directores.vue')
        },
        {
          path: 'informes',
          name: 'informes',
          component: () => import('@/components/admin/Informes.vue')
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/components/shared/Blog.vue')
        },
      ]
    },
    {
      path: '/clients',
      name: 'Clientes',
      redirect: '/clients/main',
      component: () => import('@/views/ClientsView.vue'),
      children: [
        {
          path: 'main',
          name: 'clientsDashboard',
          component: () => import('@/components/clients/Dashboard.vue')
        },
        {
          path: 'payments',
          name: 'pagos',
          component: () => import('@/components/clients/Pagos.vue')
        },
        {
          path: 'media',
          name: 'multimedia',
          component: () => import('@/components/clients/Multimedia.vue')
        },
        {
          path: 'maps',
          name: 'mapa',
          component: () => import('@/components/clients/Mapa.vue')
        },
        {
          path: 'support',
          name: 'soporte',
          component: () => import('@/components/clients/Soporte.vue')
        },
        {
          path: 'blogClients',
          name: 'blogClients',
          component: () => import('@/components/shared/Blog.vue')
        },
      ]
    },
    {
      path: '/payment_epayco',
      name: 'payment_epayco',
      component: () => import('@/views/PaymentsView.vue')
    },
    {
      path: '/publicBlog',
      name: 'publicBlog',
      component: () => import('@/components/shared/BlogWeb.vue')
    }
    /* {
      path: '/:pathMatch(.*)*',
      redirect: () => {
        return '/login'
      }
    } */
  ]
})

export default router
