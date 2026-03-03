// Vue Router: maps URL paths to Vue components
// Also has route guards to block unauthorized access
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import VehiclesView from '../views/VehiclesView.vue'
import RentalsView from '../views/RentalsView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  // Redirect root URL "/" to "/vehicles" automatically
  { path: '/', redirect: '/vehicles' },

  // Public: anyone can see login/register page
  { path: '/login', component: LoginView },

  // Public: anyone can browse vehicles (no login required)
  { path: '/vehicles', component: VehiclesView },

  {
    path: '/rentals',
    component: RentalsView,
    // Route guard: redirects to /login if no token found
    // Prevents unauthenticated users from accessing rental history
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login')
    }
  },

  {
    path: '/admin',
    component: AdminView,
    // Route guard: only allows ADMIN role to enter this page
    // Any other user (including logged-in customers) gets redirected to /login
    beforeEnter: (to, from, next) => {
      localStorage.getItem('role') === 'ADMIN' ? next() : next('/login')
    }
  }
]

export default createRouter({
  history: createWebHistory(), // Uses clean URLs like /vehicles (no # in URL)
  routes
})