// Vue Router: maps URL paths to Vue components
// Also contains route guards to block unauthorized access
import { createRouter, createWebHistory } from 'vue-router'

// ── Karim's views ──
import LoginView from '../views/LoginView.vue'
import VehiclesView from '../views/VehiclesView.vue'
import RentalsView from '../views/RentalsView.vue'
import AdminView from '../views/AdminView.vue'

// ── Bilel's views ──
import HomeView from '../views/HomeView.vue'
import VehicleDetailView from '../views/VehicleDetailView.vue'
import ProfileView from '../views/ProfileView.vue'

// ── Aziz's views ──
import ContractDetailView from '../views/ContractDetailView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'
import AdminStatsView from '../views/AdminStatsView.vue'

// ── Ahmed's views ──
import NotFoundView from '../views/NotFoundView.vue'
import AboutView from '../views/AboutView.vue'
import RentalReceiptView from '../views/RentalReceiptView.vue'

const routes = [

  // ── PUBLIC ROUTES: accessible by anyone ──

  // Home page: landing page with project overview
  { path: '/', component: HomeView },

  // Login and registration page
  { path: '/login', component: LoginView },

  // Browse all vehicles (no login required)
  { path: '/vehicles', component: VehiclesView },

  // Single vehicle detail page: /vehicles/1, /vehicles/2, etc.
  // :id is a dynamic route parameter read via this.$route.params.id
  { path: '/vehicles/:id', component: VehicleDetailView },

  // About page: project info, tech stack, team
  { path: '/about', component: AboutView },


  // ── CUSTOMER-ONLY ROUTES: require a valid JWT token ──

  {
    path: '/rentals',
    component: RentalsView,
    // Route guard: redirect to login if no token found in localStorage
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login')
    }
  },

  {
    // Receipt page for a completed rental: /rentals/5/receipt
    path: '/rentals/:id/receipt',
    component: RentalReceiptView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login')
    }
  },

  {
    // Contract detail page for a contract rental: /rentals/3/contract
    path: '/rentals/:id/contract',
    component: ContractDetailView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login')
    }
  },

  {
    // User profile: view and edit account info
    path: '/profile',
    component: ProfileView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login')
    }
  },


  // ── ADMIN-ONLY ROUTES: require role === 'ADMIN' ──

  {
    // Main admin dashboard: approve contracts, manage vehicles
    path: '/admin',
    component: AdminView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('role') === 'ADMIN' ? next() : next('/login')
    }
  },

  {
    // Admin user management: view all registered users
    path: '/admin/users',
    component: AdminUsersView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('role') === 'ADMIN' ? next() : next('/login')
    }
  },

  {
    // Admin statistics: rentals, revenue, fleet overview
    path: '/admin/stats',
    component: AdminStatsView,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('role') === 'ADMIN' ? next() : next('/login')
    }
  },


  // ── 404 CATCH-ALL: must always be the last route ──
  // Matches any URL that didn't match the routes above
  { path: '/:pathMatch(.*)*', component: NotFoundView }

]

export default createRouter({
  history: createWebHistory(), // Clean URLs without # (e.g. /vehicles not /#/vehicles)
  routes
})
