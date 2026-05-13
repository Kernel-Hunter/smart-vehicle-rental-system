import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from '../store/index.js'

import HomeView           from '../views/HomeView.vue'
import LoginView          from '../views/LoginView.vue'
import MapView            from '../views/MapView.vue'
import VehiclesView       from '../views/VehiclesView.vue'
import VehicleDetailView  from '../views/VehicleDetailView.vue'
import RentalsView        from '../views/RentalsView.vue'
import ProfileView        from '../views/ProfileView.vue'
import ContractDetailView from '../views/ContractDetailView.vue'
import RentalReceiptView  from '../views/RentalReceiptView.vue'
import CompanyDashboard   from '../views/CompanyDashboard.vue'
import CompanyVehicles    from '../views/CompanyVehicles.vue'
import CompanyRentals     from '../views/CompanyRentals.vue'
import AboutView          from '../views/AboutView.vue'
import NotFoundView       from '../views/NotFoundView.vue'

// Guard helpers
const requireLogin  = (to, from, next) => getCurrentUser() ? next() : next('/login')
const requireCompany = (to, from, next) => getCurrentUser()?.role === 'COMPANY' ? next() : next('/login')

const routes = [
  // Public
  { path: '/',             component: HomeView },
  { path: '/login',        component: LoginView },
  { path: '/map',          component: MapView },
  { path: '/vehicles',     component: VehiclesView },
  { path: '/vehicles/:id', component: VehicleDetailView },
  { path: '/about',        component: AboutView },

  // Customer
  { path: '/rentals',                  component: RentalsView,       beforeEnter: requireLogin },
  { path: '/rentals/:id/receipt',      component: RentalReceiptView, beforeEnter: requireLogin },
  { path: '/rentals/:id/contract',     component: ContractDetailView,beforeEnter: requireLogin },
  { path: '/profile',                  component: ProfileView,       beforeEnter: requireLogin },

  // Company
  { path: '/company',          component: CompanyDashboard, beforeEnter: requireCompany },
  { path: '/company/vehicles', component: CompanyVehicles,  beforeEnter: requireCompany },
  { path: '/company/rentals',  component: CompanyRentals,   beforeEnter: requireCompany },

  // 404
  { path: '/:pathMatch(.*)*', component: NotFoundView }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  // Scroll to top on every navigation
  scrollBehavior() { return { top: 0, behavior: 'smooth' } }
})
