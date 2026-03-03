import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import VehiclesView from '../views/VehiclesView.vue'
import RentalsView from '../views/RentalsView.vue'
import AdminView from '../views/AdminView.vue'
import HomeView from '../views/HomeView.vue'
import VehicleDetailView from '../views/VehicleDetailView.vue'
import ProfileView from '../views/ProfileView.vue'
import ContractDetailView from '../views/ContractDetailView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'
import AdminStatsView from '../views/AdminStatsView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import AboutView from '../views/AboutView.vue'
import RentalReceiptView from '../views/RentalReceiptView.vue'

const routes = [
  // Public routes
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/vehicles', component: VehiclesView },
  { path: '/about', component: AboutView },

  // Vehicle detail: /vehicles/1, /vehicles/2, etc.
  { path: '/vehicles/:id', component: VehicleDetailView },

  // Customer-only routes
  {
    path: '/rentals',
    component: RentalsView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login')
    }
  },
  {
    path: '/rentals/:id/receipt',
    component: RentalReceiptView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login')
    }
  },
  {
    path: '/rentals/:id/contract',
    component: ContractDetailView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login')
    }
  },
  {
    path: '/profile',
    component: ProfileView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login')
    }
  },

  // Admin-only routes
  {
    path: '/admin',
    component: AdminView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('role') === 'ADMIN' ? next() : next('/login')
    }
  },
  {
    path: '/admin/users',
    component: AdminUsersView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('role') === 'ADMIN' ? next() : next('/login')
    }
  },
  {
    path: '/admin/stats',
    component: AdminStatsView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('role') === 'ADMIN' ? next() : next('/login')
    }
  },

  // 404: catches all unknown routes — must be last
  { path: '/:pathMatch(.*)*', component: NotFoundView }
]

export default createRouter({ history: createWebHistory(), routes })
