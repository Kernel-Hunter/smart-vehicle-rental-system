// ============================================================
// SmartRent — Central Data Store
// All data lives in localStorage. No backend needed.
// 3 roles: CUSTOMER, COMPANY, ADMIN
// ============================================================

// ── Default mock companies ──
const defaultCompanies = [
  { id: 1, username: 'autoplus',   companyName: 'Auto Plus Tunis',    email: 'contact@autoplus.tn',   password: 'company123', role: 'COMPANY', city: 'Tunis',    logo: 'AP', description: 'Premium vehicle rental since 2010', totalEarnings: 15420 },
  { id: 2, username: 'drivefast',  companyName: 'DriveFast Rental',   email: 'info@drivefast.tn',     password: 'company123', role: 'COMPANY', city: 'Sousse',   logo: 'DF', description: 'Fast. Reliable. Affordable.',       totalEarnings: 8900  },
  { id: 3, username: 'luxauto',    companyName: 'LuxAuto Premium',    email: 'luxauto@premium.tn',    password: 'company123', role: 'COMPANY', city: 'Sfax',     logo: 'LA', description: 'Luxury fleet for business travel',  totalEarnings: 22100 },
]

// ── Default mock customers ──
const defaultCustomers = [
  { id: 101, username: 'karim',  email: 'karim@email.com',  password: 'karim123',  role: 'CUSTOMER', fullName: 'Karim Masmoudi' },
  { id: 102, username: 'bilel',  email: 'bilel@email.com',  password: 'bilel123',  role: 'CUSTOMER', fullName: 'Bilel Didi'     },
  { id: 103, username: 'aziz',   email: 'aziz@email.com',   password: 'aziz123',   role: 'CUSTOMER', fullName: 'Aziz Zemzmi'   },
  { id: 104, username: 'ahmed',  email: 'ahmed@email.com',  password: 'ahmed123',  role: 'CUSTOMER', fullName: 'Ahmed Tahri'   },
]

// ── Default mock vehicles with map coordinates (fake city grid) ──
const defaultVehicles = [
  { id: 1,  companyId: 1, brand: 'Toyota',    model: 'Corolla',  type: 'Sedan',    status: 'AVAILABLE',   pricePerMinute: 2.5,  pricePerDay: 1500, city: 'Tunis',  mapX: 28, mapY: 35, color: '#5C6BC0' },
  { id: 2,  companyId: 1, brand: 'Renault',   model: 'Clio',     type: 'Hatchback',status: 'AVAILABLE',   pricePerMinute: 2.0,  pricePerDay: 1200, city: 'Tunis',  mapX: 45, mapY: 22, color: '#5C6BC0' },
  { id: 3,  companyId: 1, brand: 'Peugeot',   model: '308',      type: 'Sedan',    status: 'RENTED',      pricePerMinute: 2.2,  pricePerDay: 1300, city: 'Tunis',  mapX: 62, mapY: 48, color: '#5C6BC0' },
  { id: 4,  companyId: 2, brand: 'BMW',       model: 'X5',       type: 'SUV',      status: 'AVAILABLE',   pricePerMinute: 5.0,  pricePerDay: 3500, city: 'Sousse', mapX: 35, mapY: 55, color: '#7E57C2' },
  { id: 5,  companyId: 2, brand: 'Mercedes',  model: 'C-Class',  type: 'Sedan',    status: 'MAINTENANCE', pricePerMinute: 4.5,  pricePerDay: 3000, city: 'Sousse', mapX: 70, mapY: 30, color: '#7E57C2' },
  { id: 6,  companyId: 2, brand: 'VW',        model: 'Golf',     type: 'Hatchback',status: 'AVAILABLE',   pricePerMinute: 2.3,  pricePerDay: 1400, city: 'Sousse', mapX: 55, mapY: 65, color: '#7E57C2' },
  { id: 7,  companyId: 3, brand: 'Hyundai',   model: 'Tucson',   type: 'SUV',      status: 'AVAILABLE',   pricePerMinute: 3.0,  pricePerDay: 2000, city: 'Sfax',   mapX: 20, mapY: 70, color: '#9575CD' },
  { id: 8,  companyId: 3, brand: 'Kia',       model: 'Sportage', type: 'SUV',      status: 'RENTED',      pricePerMinute: 3.2,  pricePerDay: 2100, city: 'Sfax',   mapX: 75, mapY: 55, color: '#9575CD' },
  { id: 9,  companyId: 3, brand: 'Audi',      model: 'A4',       type: 'Sedan',    status: 'AVAILABLE',   pricePerMinute: 4.0,  pricePerDay: 2800, city: 'Sfax',   mapX: 40, mapY: 40, color: '#9575CD' },
  { id: 10, companyId: 1, brand: 'Dacia',     model: 'Sandero',  type: 'Hatchback',status: 'AVAILABLE',   pricePerMinute: 1.8,  pricePerDay: 1000, city: 'Tunis',  mapX: 58, mapY: 72, color: '#5C6BC0' },
]

// ── Default mock rentals ──
const defaultRentals = [
  { id: 1, customerId: 101, vehicleId: 3,  rentalType: 'INSTANT',  status: 'COMPLETED', startTime: '2025-06-01T10:00:00', endTime: '2025-06-01T11:30:00', totalPrice: 225,  contract: null },
  { id: 2, customerId: 102, vehicleId: 8,  rentalType: 'CONTRACT', status: 'ACTIVE',    startTime: '2025-06-05T09:00:00', endTime: null,                  totalPrice: 4200, contract: { startDate: '2025-06-05', endDate: '2025-06-07', deliveryLocation: 'La Marsa',   approved: true  } },
  { id: 3, customerId: 103, vehicleId: 1,  rentalType: 'CONTRACT', status: 'PENDING',   startTime: null,                  endTime: null,                  totalPrice: null, contract: { startDate: '2025-06-10', endDate: '2025-06-12', deliveryLocation: 'Sousse',     approved: false } },
  { id: 4, customerId: 101, vehicleId: 6,  rentalType: 'INSTANT',  status: 'ACTIVE',    startTime: '2025-06-08T14:00:00', endTime: null,                  totalPrice: null, contract: null },
  { id: 5, customerId: 104, vehicleId: 9,  rentalType: 'INSTANT',  status: 'COMPLETED', startTime: '2025-06-09T08:00:00', endTime: '2025-06-09T09:00:00', totalPrice: 240,  contract: null },
  { id: 6, customerId: 102, vehicleId: 2,  rentalType: 'CONTRACT', status: 'COMPLETED', startTime: '2025-06-03T00:00:00', endTime: '2025-06-05T00:00:00', totalPrice: 2400, contract: { startDate: '2025-06-03', endDate: '2025-06-05', deliveryLocation: 'Tunis',      approved: true  } },
]

// ── Helpers ──
function load(key, defaults) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaults
  } catch { return defaults }
}
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)) }

// Initialize on first run
if (!localStorage.getItem('sr_companies')) save('sr_companies', defaultCompanies)
if (!localStorage.getItem('sr_customers')) save('sr_customers', defaultCustomers)
if (!localStorage.getItem('sr_vehicles'))  save('sr_vehicles',  defaultVehicles)
if (!localStorage.getItem('sr_rentals'))   save('sr_rentals',   defaultRentals)

// ── COMPANIES ──
export function getCompanies()             { return load('sr_companies', defaultCompanies) }
export function getCompanyById(id)         { return getCompanies().find(c => c.id === Number(id)) }
export function saveCompanies(list)        { save('sr_companies', list) }
export function updateCompany(updated)     { saveCompanies(getCompanies().map(c => c.id === updated.id ? updated : c)) }

export function registerCompany(username, companyName, email, password, city, description) {
  const companies = getCompanies()
  if (companies.find(c => c.username === username)) return null
  const newCompany = {
    id: Math.max(...companies.map(c => c.id), 0) + 1,
    username, companyName, email, password, city, description,
    role: 'COMPANY',
    logo: companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    totalEarnings: 0
  }
  companies.push(newCompany)
  saveCompanies(companies)
  return newCompany
}

// ── CUSTOMERS ──
export function getCustomers()             { return load('sr_customers', defaultCustomers) }
export function getCustomerById(id)        { return getCustomers().find(u => u.id === Number(id)) }
export function saveCustomers(list)        { save('sr_customers', list) }
export function updateCustomer(updated)    { saveCustomers(getCustomers().map(u => u.id === updated.id ? updated : u)) }

export function registerCustomer(username, email, password, fullName) {
  const customers = getCustomers()
  if (customers.find(u => u.username === username)) return null
  const newCustomer = {
    id: Math.max(...customers.map(u => u.id), 0) + 1,
    username, email, password, fullName, role: 'CUSTOMER'
  }
  customers.push(newCustomer)
  saveCustomers(customers)
  return newCustomer
}

// ── VEHICLES ──
export function getVehicles()              { return load('sr_vehicles', defaultVehicles) }
export function getVehicleById(id)         { return getVehicles().find(v => v.id === Number(id)) }
export function getVehiclesByCompany(cid)  { return getVehicles().filter(v => v.companyId === Number(cid)) }
export function saveVehicles(list)         { save('sr_vehicles', list) }

export function addVehicle(vehicle) {
  const vehicles = getVehicles()
  vehicle.id   = Math.max(...vehicles.map(v => v.id), 0) + 1
  // Random map position for the new vehicle
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

// ── RENTALS ──
export function getRentals()               { return load('sr_rentals', defaultRentals) }
export function getRentalById(id)          { return getRentals().find(r => r.id === Number(id)) }
export function getRentalsByCustomer(cid)  { return getRentals().filter(r => r.customerId === Number(cid)) }
export function saveRentals(list)          { save('sr_rentals', list) }

export function getRentalsByCompany(companyId) {
  const companyVehicleIds = getVehiclesByCompany(companyId).map(v => v.id)
  return getRentals().filter(r => companyVehicleIds.includes(r.vehicleId))
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

export function startInstantRental(vehicleId, customerId) {
  const vehicles = getVehicles()
  const vehicle  = vehicles.find(v => v.id === vehicleId)
  if (!vehicle || vehicle.status !== 'AVAILABLE') return null
  vehicle.status = 'RENTED'
  saveVehicles(vehicles)
  return addRental({
    customerId, vehicleId,
    rentalType: 'INSTANT', status: 'ACTIVE',
    startTime: new Date().toISOString(), endTime: null, totalPrice: null, contract: null
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
  const vehicles = getVehicles()
  const v = vehicles.find(v => v.id === rental.vehicleId)
  if (v) { v.status = 'AVAILABLE'; saveVehicles(vehicles) }
  // Add earnings to company
  const companies = getCompanies()
  const company   = companies.find(c => c.id === vehicle.companyId)
  if (company) { company.totalEarnings = (company.totalEarnings || 0) + rental.totalPrice; saveCompanies(companies) }
}

export function submitContractRental(vehicleId, customerId, startDate, endDate, deliveryLocation) {
  return addRental({
    customerId, vehicleId,
    rentalType: 'CONTRACT', status: 'PENDING',
    startTime: null, endTime: null, totalPrice: null,
    contract: { startDate, endDate, deliveryLocation, approved: false }
  })
}

export function approveContract(rentalId) {
  const rentals = getRentals()
  const rental  = rentals.find(r => r.id === rentalId)
  if (!rental) return
  const vehicle = getVehicleById(rental.vehicleId)
  const days    = Math.max(1, Math.ceil((new Date(rental.contract.endDate) - new Date(rental.contract.startDate)) / (1000 * 60 * 60 * 24)))
  rental.contract.approved = true
  rental.status            = 'ACTIVE'
  rental.startTime         = rental.contract.startDate
  rental.totalPrice        = parseFloat((days * vehicle.pricePerDay).toFixed(2))
  saveRentals(rentals)
  const vehicles = getVehicles()
  const v = vehicles.find(v => v.id === rental.vehicleId)
  if (v) { v.status = 'RENTED'; saveVehicles(vehicles) }
  // Add earnings
  const companies = getCompanies()
  const company   = companies.find(c => c.id === vehicle.companyId)
  if (company) { company.totalEarnings = (company.totalEarnings || 0) + rental.totalPrice; saveCompanies(companies) }
}

// ── AUTH (sessionStorage — clears on tab close) ──
export function getCurrentUser()    { try { return JSON.parse(sessionStorage.getItem('sr_user')) } catch { return null } }
export function setCurrentUser(u)   { sessionStorage.setItem('sr_user', JSON.stringify(u)) }
export function clearCurrentUser()  { sessionStorage.removeItem('sr_user') }

export function loginUser(username, password, role) {
  if (role === 'COMPANY') {
    return getCompanies().find(c => c.username === username && c.password === password) || null
  }
  return getCustomers().find(u => u.username === username && u.password === password) || null
}

// ── STATS helpers ──
export function getPlatformStats() {
  return {
    totalVehicles:   getVehicles().length,
    availableVehicles: getVehicles().filter(v => v.status === 'AVAILABLE').length,
    totalRentals:    getRentals().length,
    totalCompanies:  getCompanies().length,
    totalCustomers:  getCustomers().length,
    totalRevenue:    getRentals().filter(r => r.totalPrice).reduce((s, r) => s + r.totalPrice, 0)
  }
}
