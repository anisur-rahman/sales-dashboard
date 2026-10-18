import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView, meta: { title: 'Dashboard' } },
    {
      path: '/products',
      name: 'products',
      // Lazy loading: this page's code is downloaded only when visited.
      component: () => import('@/views/ProductsView.vue'),
      meta: { title: 'Products' }
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/views/ProductDetailView.vue'),
      props: true, // passes :id to the component as a prop
      meta: { title: 'Product' }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/AnalyticsView.vue'),
      meta: { title: 'Analytics (Tableau)' }
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'App'} · Sales Dashboard`
})

export default router
