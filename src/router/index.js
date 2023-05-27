import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // {
    //   path: '/admin/timepunch',
    //   name: 'timepunch',
    //   component: () => import('../views/TimePunch.vue')
    // },
    // {
    //   path: '/admin/profile',
    //   name: 'profile',
    //   component: () => import('../views/Profile.vue')
    // }
  ]
})

export default router
