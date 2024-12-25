import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/index.vue'
import DefaultView from '@/views/default.vue'
import GuideView from '@/views/guide.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'guide',
      component: GuideView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/default',
      name: 'default',
      component: DefaultView,
    },
  ],
})
console.log('createRouter')
export default router
