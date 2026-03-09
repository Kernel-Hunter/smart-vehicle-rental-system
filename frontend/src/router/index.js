import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from '../store/data.js'

// Import all 13 views
import HomeView            from '../views/HomeView.vue'
import LoginView           from '../views/LoginView.vue'
import VehiclesView        from '../views/VehiclesView.vue'
import VehicleDetailView   from '../views/VehicleDetailView.vue'
import RentalsView         from '../views/RentalsView.vue'
import ProfileView         from '../views/ProfileView.vue'
import ContractDetailView  from '../views/ContractDetailView.vue'
import RentalReceiptView   from '../views/RentalReceiptView.vue'
import AdminView           from '../views/AdminView.vue'
import AdminUsersView      from '../views/AdminUsersView.vue'
import AdminStatsView      from '../views/AdminStatsView.vue'
import AboutView           from '../views/AboutView.vue'
import NotFoundView        from '../views/NotFoundView.vue'

const routes = [
  // ── Public routes ──
  { path: '/',              component: HomeView },
  { path: '/login',         component: LoginView },
  { path: '/vehicles',      component: VehiclesView },
  { path: '/vehicles/:id',  component: VehicleDetailView },
  { path: '/about',         component: AboutView },

  // ── Customer routes: require login ──
  {
    path: '/rentals',
    component: RentalsView,
    beforeEnter: (to, from, next) => {
      getCurrentUser() ? next() : next('/login')
    }
  },
  {
    path: '/rentals/:id/receipt',
    component: RentalReceiptView,
    beforeEnter: (to, from, next) => {
      getCurrentUser() ? next() : next('/login')
    }
  },
  {
    path: '/rentals/:id/contract',
    component: ContractDetailView,
    beforeEnter: (to, from, next) => {
      getCurrentUser() ? next() : next('/login')
    }
  },
  {
    path: '/profile',
    component: ProfileView,
    beforeEnter: (to, from, next) => {
      getCurrentUser() ? next() : next('/login')
    }
  },

  // ── Admin routes: require ADMIN role ──
  {
    path: '/admin',
    component: AdminView,
    beforeEnter: (to, from, next) => {
      const user = getCurrentUser()
      user?.role === 'ADMIN' ? next() : next('/login')
    }
  },
  {
    path: '/admin/users',
    component: AdminUsersView,
    beforeEnter: (to, from, next) => {
      const user = getCurrentUser()
      user?.role === 'ADMIN' ? next() : next('/login')
    }
  },
  {
    path: '/admin/stats',
    component: AdminStatsView,
    beforeEnter: (to, from, next) => {
      const user = getCurrentUser()
      user?.role === 'ADMIN' ? next() : next('/login')
    }
  },

  // ── 404 catch-all: must be last ──
  { path: '/:pathMatch(.*)*', component: NotFoundView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
