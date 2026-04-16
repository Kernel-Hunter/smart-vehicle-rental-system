// ============================================================
// vehicles.js — Vehicle data and CRUD operations
// ============================================================

import { load, save } from './storage.js'

const KEY = 'sr_vehicles'

const defaultVehicles = [
  { id: 1,  companyId: 1, brand: 'Toyota',   model: 'Corolla',  type: 'Sedan',    status: 'AVAILABLE',   pricePerMinute: 2.5, pricePerDay: 1500, city: 'Tunis',  mapX: 28, mapY: 35, color: '#0d9488' },
  { id: 2,  companyId: 1, brand: 'Renault',  model: 'Clio',     type: 'Hatchback',status: 'AVAILABLE',   pricePerMinute: 2.0, pricePerDay: 1200, city: 'Tunis',  mapX: 45, mapY: 22, color: '#0d9488' },
  { id: 3,  companyId: 1, brand: 'Peugeot',  model: '308',      type: 'Sedan',    status: 'RENTED',      pricePerMinute: 2.2, pricePerDay: 1300, city: 'Tunis',  mapX: 62, mapY: 48, color: '#0d9488' },
  { id: 4,  companyId: 2, brand: 'BMW',      model: 'X5',       type: 'SUV',      status: 'AVAILABLE',   pricePerMinute: 5.0, pricePerDay: 3500, city: 'Sousse', mapX: 35, mapY: 55, color: '#0891b2' },
  { id: 5,  companyId: 2, brand: 'Mercedes', model: 'C-Class',  type: 'Sedan',    status: 'MAINTENANCE', pricePerMinute: 4.5, pricePerDay: 3000, city: 'Sousse', mapX: 70, mapY: 30, color: '#0891b2' },
  { id: 6,  companyId: 2, brand: 'VW',       model: 'Golf',     type: 'Hatchback',status: 'AVAILABLE',   pricePerMinute: 2.3, pricePerDay: 1400, city: 'Sousse', mapX: 55, mapY: 65, color: '#0891b2' },
  { id: 7,  companyId: 3, brand: 'Hyundai',  model: 'Tucson',   type: 'SUV',      status: 'AVAILABLE',   pricePerMinute: 3.0, pricePerDay: 2000, city: 'Sfax',   mapX: 20, mapY: 70, color: '#06b6d4' },
  { id: 8,  companyId: 3, brand: 'Kia',      model: 'Sportage', type: 'SUV',      status: 'RENTED',      pricePerMinute: 3.2, pricePerDay: 2100, city: 'Sfax',   mapX: 75, mapY: 55, color: '#06b6d4' },
  { id: 9,  companyId: 3, brand: 'Audi',     model: 'A4',       type: 'Sedan',    status: 'AVAILABLE',   pricePerMinute: 4.0, pricePerDay: 2800, city: 'Sfax',   mapX: 40, mapY: 40, color: '#06b6d4' },
  { id: 10, companyId: 1, brand: 'Dacia',    model: 'Sandero',  type: 'Hatchback',status: 'AVAILABLE',   pricePerMinute: 1.8, pricePerDay: 1000, city: 'Tunis',  mapX: 58, mapY: 72, color: '#0d9488' },
]

export function initVehicles() {
  if (!localStorage.getItem(KEY)) save(KEY, defaultVehicles)
}

export function getVehicles() {
  return load(KEY, defaultVehicles)
}

export function getVehicleById(id) {
  return getVehicles().find(v => v.id === Number(id))
}

export function getVehiclesByCompany(companyId) {
  return getVehicles().filter(v => v.companyId === Number(companyId))
}

export function saveVehicles(list) {
  save(KEY, list)
}

export function addVehicle(vehicle) {
  const vehicles = getVehicles()
  vehicle.id   = Math.max(...vehicles.map(v => v.id), 0) + 1
  vehicle.mapX = Math.floor(Math.random() * 80) + 10
  vehicle.mapY = Math.floor(Math.random() * 80) + 10
  vehicles.push(vehicle)
  saveVehicles(vehicles)
  return vehicle
}

export function updateVehicle(updated) {
  saveVehicles(getVehicles().map(v => v.id === updated.id ? { ...v, ...updated } : v))
}

export function deleteVehicle(id) {
  saveVehicles(getVehicles().filter(v => v.id !== id))
}
