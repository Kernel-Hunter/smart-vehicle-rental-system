// ============================================================
// store/index.js — Single entry point for the data store
//
// Every view imports from '../store/index.js' (or '../store/data.js'
// if kept for backwards compatibility).
// This file boots the store and re-exports every public function.
// ============================================================

import { resetIfOutdated } from './storage.js'
import { initCompanies } from './companies.js'
import { initCustomers } from './customers.js'
import { initVehicles }  from './vehicles.js'
import { initRentals }   from './rentals.js'

// ── Boot: wipe stale data if version changed, then seed defaults ──
resetIfOutdated()
initCompanies()
initCustomers()
initVehicles()
initRentals()

// ── Re-export everything so views don't need to know the file layout ──
export { getCompanies, getCompanyById, saveCompanies, updateCompany, registerCompany } from './companies.js'
export { getCustomers, getCustomerById, saveCustomers, updateCustomer, registerCustomer } from './customers.js'
export { getVehicles, getVehicleById, getVehiclesByCompany, saveVehicles, addVehicle, updateVehicle, deleteVehicle } from './vehicles.js'
export { getRentals, getRentalById, getRentalsByCustomer, getRentalsByCompany, saveRentals, addRental, updateRental, startInstantRental, endInstantRental, submitContractRental, approveContract } from './rentals.js'
export { getCurrentUser, setCurrentUser, clearCurrentUser, loginUser } from './auth.js'

// ── Platform-wide stats (uses multiple modules — lives here) ──
import { getVehicles } from './vehicles.js'
import { getRentals }  from './rentals.js'
import { getCompanies } from './companies.js'
import { getCustomers } from './customers.js'

export function getPlatformStats() {
  const vehicles  = getVehicles()
  const rentals   = getRentals()
  const companies = getCompanies()
  const customers = getCustomers()
  return {
    totalVehicles:     vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === 'AVAILABLE').length,
    totalRentals:      rentals.length,
    totalCompanies:    companies.length,
    totalCustomers:    customers.length,
    totalRevenue:      rentals.filter(r => r.totalPrice).reduce((s, r) => s + r.totalPrice, 0),
  }
}
