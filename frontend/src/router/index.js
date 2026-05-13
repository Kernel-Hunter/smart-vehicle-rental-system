import { createRouter, createWebHistory } from 'vue-router'

import MapView from '../views/MapView.vue'

const routes = [
  {
    path: '/',
    redirect: '/map'
  },
  {
    path: '/map',
    name: 'map',
    component: MapView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
