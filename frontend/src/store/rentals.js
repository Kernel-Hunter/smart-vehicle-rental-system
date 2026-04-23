// ============================================================
// rentals.js — Rental data and business logic
// ============================================================

import { load, save } from './storage.js'
import { getVehicleById, getVehiclesByCompany, getVehicles, saveVehicles } from './vehicles.js'
import { getCompanies, saveCompanies } from './companies.js'

const KEY = 'sr_rentals'

const defaultRentals = [
  {
    id: 1, customerId: 101, vehicleId: 3,
    rentalType: 'INSTANT',  status: 'COMPLETED',
    startTime: '2025-06-01T10:00:00', endTime: '2025-06-01T11:30:00',
    totalPrice: 225, contract: null,
  },
  {
    id: 2, customerId: 102, vehicleId: 8,
    rentalType: 'CONTRACT', status: 'ACTIVE',
    startTime: '2025-06-05T09:00:00', endTime: null,
    totalPrice: 4200,
    contract: { startDate: '2025-06-05', endDate: '2025-06-07', deliveryLocation: 'La Marsa', approved: true },
  },
  {
    id: 3, customerId: 103, vehicleId: 1,
    rentalType: 'CONTRACT', status: 'PENDING',
    startTime: null, endTime: null, totalPrice: null,
    contract: { startDate: '2025-06-10', endDate: '2025-06-12', deliveryLocation: 'Sousse', approved: false },
  },
  {
    id: 4, customerId: 101, vehicleId: 6,
    rentalType: 'INSTANT', status: 'ACTIVE',
    startTime: '2025-06-08T14:00:00', endTime: null,
    totalPrice: null, contract: null,
  },
  {
    id: 5, customerId: 104, vehicleId: 9,
    rentalType: 'INSTANT', status: 'COMPLETED',
    startTime: '2025-06-09T08:00:00', endTime: '2025-06-09T09:00:00',
    totalPrice: 240, contract: null,
  },
  {
    id: 6, customerId: 102, vehicleId: 2,
    rentalType: 'CONTRACT', status: 'COMPLETED',
    startTime: '2025-06-03T00:00:00', endTime: '2025-06-05T00:00:00',
    totalPrice: 2400,
    contract: { startDate: '2025-06-03', endDate: '2025-06-05', deliveryLocation: 'Tunis', approved: true },
  },
]

export function initRentals() {
  if (!localStorage.getItem(KEY)) save(KEY, defaultRentals)
}

// ── Basic CRUD ──

export function getRentals() {
  return load(KEY, defaultRentals)
}

export function getRentalById(id) {
  return getRentals().find(r => r.id === Number(id))
}

export function getRentalsByCustomer(customerId) {
  return getRentals().filter(r => r.customerId === Number(customerId))
}

export function getRentalsByCompany(companyId) {
  const companyVehicleIds = getVehiclesByCompany(companyId).map(v => v.id)
  return getRentals().filter(r => companyVehicleIds.includes(r.vehicleId))
}

export function saveRentals(list) {
  save(KEY, list)
}

export function addRental(rental) {
  const rentals = getRentals()
  rental.id = Math.max(...rentals.map(r => r.id), 0) + 1
  rentals.push(rental)
  saveRentals(rentals)
  return rental
}

export function updateRental(updated) {
  saveRentals(getRentals().map(r => r.id === updated.id ? updated : r))
}

// ── Business Logic ──

export function startInstantRental(vehicleId, customerId) {
  const vehicles = getVehicles()
  const vehicle  = vehicles.find(v => v.id === vehicleId)
  if (!vehicle || vehicle.status !== 'AVAILABLE') return null

  vehicle.status = 'RENTED'
  saveVehicles(vehicles)

  return addRental({
    customerId,
    vehicleId,
    rentalType: 'INSTANT',
    status:     'ACTIVE',
    startTime:  new Date().toISOString(),
    endTime:    null,
    totalPrice: null,
    contract:   null,
  })
}

export function endInstantRental(rentalId) {
  const rentals = getRentals()
  const rental  = rentals.find(r => r.id === rentalId)
  if (!rental) return

  const vehicle  = getVehicleById(rental.vehicleId)
  const endTime  = new Date()
  const minutes  = Math.max(1, Math.ceil((endTime - new Date(rental.startTime)) / (1000 * 60)))

  rental.endTime    = endTime.toISOString()
  rental.status     = 'COMPLETED'
  rental.totalPrice = parseFloat((minutes * vehicle.pricePerMinute).toFixed(2))
  saveRentals(rentals)

  // Free the vehicle
  const vehicles = getVehicles()
  const v = vehicles.find(v => v.id === rental.vehicleId)
  if (v) { v.status = 'AVAILABLE'; saveVehicles(vehicles) }

  // Credit earnings to the company
  const companies = getCompanies()
  const company   = companies.find(c => c.id === vehicle.companyId)
  if (company) {
    company.totalEarnings = (company.totalEarnings || 0) + rental.totalPrice
    saveCompanies(companies)
  }
}

export function submitContractRental(vehicleId, customerId, startDate, endDate, deliveryLocation) {
  return addRental({
    customerId,
    vehicleId,
    rentalType: 'CONTRACT',
    status:     'PENDING',
    startTime:  null,
    endTime:    null,
    totalPrice: null,
    contract:   { startDate, endDate, deliveryLocation, approved: false },
  })
}

export function approveContract(rentalId) {
  const rentals = getRentals()
  const rental  = rentals.find(r => r.id === rentalId)
  if (!rental) return

  const vehicle = getVehicleById(rental.vehicleId)
  const days    = Math.max(1, Math.ceil(
    (new Date(rental.contract.endDate) - new Date(rental.contract.startDate)) / (1000 * 60 * 60 * 24)
  ))

  rental.contract.approved = true
  rental.status            = 'ACTIVE'
  rental.startTime         = rental.contract.startDate
  rental.totalPrice        = parseFloat((days * vehicle.pricePerDay).toFixed(2))
  saveRentals(rentals)

  // Mark vehicle as rented
  const vehicles = getVehicles()
  const v = vehicles.find(v => v.id === rental.vehicleId)
  if (v) { v.status = 'RENTED'; saveVehicles(vehicles) }

  // Credit earnings
  const companies = getCompanies()
  const company   = companies.find(c => c.id === vehicle.companyId)
  if (company) {
    company.totalEarnings = (company.totalEarnings || 0) + rental.totalPrice
    saveCompanies(companies)
  }
}
