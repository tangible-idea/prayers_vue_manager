import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const routes = [
  {
    path: '/:roomTag',
    component: App,
    props: true
  },
  {
    path: '/',
    redirect: '/default'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
