// Central data store using localStorage
// All views import from here — no backend needed
// Mock data is loaded on first run, then localStorage takes over

// ── Default mock vehicles ──
const defaultVehicles = [
  { id: 1, brand: 'Toyota',   model: 'Corolla',  type: 'Sedan',   status: 'AVAILABLE',   pricePerMinute: 2.5,  pricePerDay: 1500, location: 'Tunis Center' },
  { id: 2, brand: 'Renault',  model: 'Clio',     type: 'Hatchback',status: 'AVAILABLE',  pricePerMinute: 2.0,  pricePerDay: 1200, location: 'La Marsa' },
  { id: 3, brand: 'Peugeot',  model: '308',      type: 'Sedan',   status: 'RENTED',      pricePerMinute: 2.2,  pricePerDay: 1300, location: 'Sousse' },
  { id: 4, brand: 'BMW',      model: 'X5',       type: 'SUV',     status: 'AVAILABLE',   pricePerMinute: 5.0,  pricePerDay: 3500, location: 'Sfax' },
  { id: 5, brand: 'Mercedes', model: 'C-Class',  type: 'Sedan',   status: 'MAINTENANCE', pricePerMinute: 4.5,  pricePerDay: 3000, location: 'Bizerte' },
  { id: 6, brand: 'Volkswagen',model: 'Golf',    type: 'Hatchback',status: 'AVAILABLE',  pricePerMinute: 2.3,  pricePerDay: 1400, location: 'Tunis Center' },
  { id: 7, brand: 'Hyundai',  model: 'Tucson',   type: 'SUV',     status: 'AVAILABLE',   pricePerMinute: 3.0,  pricePerDay: 2000, location: 'Monastir' },
  { id: 8, brand: 'Kia',      model: 'Sportage', type: 'SUV',     status: 'RENTED',      pricePerMinute: 3.2,  pricePerDay: 2100, location: 'Hammamet' },
]

// ── Default mock users ──
const defaultUsers = [
  { id: 1, username: 'admin',  email: 'admin@smartrent.com',  password: 'admin123',  role: 'ADMIN' },
  { id: 2, username: 'karim',  email: 'karim@email.com',      password: 'karim123',  role: 'CUSTOMER' },
  { id: 3, username: 'bilel',  email: 'bilel@email.com',      password: 'bilel123',  role: 'CUSTOMER' },
  { id: 4, username: 'aziz',   email: 'aziz@email.com',       password: 'aziz123',   role: 'CUSTOMER' },
  { id: 5, username: 'ahmed',  email: 'ahmed@email.com',      password: 'ahmed123',  role: 'CUSTOMER' },
]

// ── Default mock rentals ──
const defaultRentals = [
  {
    id: 1, userId: 2, vehicleId: 3,
    rentalType: 'INSTANT', status: 'COMPLETED',
    startTime: '2025-06-01T10:00:00', endTime: '2025-06-01T11:30:00',
    totalPrice: 225, contract: null
  },
  {
    id: 2, userId: 3, vehicleId: 8,
    rentalType: 'CONTRACT', status: 'ACTIVE',
    startTime: '2025-06-05T09:00:00', endTime: null,
    totalPrice: 4200,
    contract: { startDate: '2025-06-05', endDate: '2025-06-07', deliveryLocation: 'La Marsa', approved: true }
  },
  {
    id: 3, userId: 4, vehicleId: 1,
    rentalType: 'CONTRACT', status: 'PENDING',
    startTime: null, endTime: null, totalPrice: null,
    contract: { startDate: '2025-06-10', endDate: '2025-06-12', deliveryLocation: 'Sousse', approved: false }
  },
  {
    id: 4, userId: 2, vehicleId: 6,
    rentalType: 'INSTANT', status: 'ACTIVE',
    startTime: '2025-06-08T14:00:00', endTime: null,
    totalPrice: null, contract: null
  },
]

// ── Helper: load from localStorage or fall back to defaults ──
function load(key, defaults) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaults
  } catch {
    return defaults
  }
}

// ── Helper: save to localStorage ──
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ── Initialize localStorage with defaults on first run ──
if (!localStorage.getItem('sr_vehicles')) save('sr_vehicles', defaultVehicles)
if (!localStorage.getItem('sr_users'))    save('sr_users',    defaultUsers)
if (!localStorage.getItem('sr_rentals'))  save('sr_rentals',  defaultRentals)

// ── Exported functions used by all views ──

// VEHICLES
export function getVehicles()          { return load('sr_vehicles', defaultVehicles) }
export function getVehicleById(id)     { return getVehicles().find(v => v.id === Number(id)) }
export function saveVehicles(vehicles) { save('sr_vehicles', vehicles) }

export function addVehicle(vehicle) {
  const vehicles = getVehicles()
  // Auto-increment ID based on highest existing ID
  vehicle.id = vehicles.length ? Math.max(...vehicles.map(v => v.id)) + 1 : 1
  vehicles.push(vehicle)
  saveVehicles(vehicles)
  return vehicle
}

export function updateVehicle(updated) {
  const vehicles = getVehicles().map(v => v.id === updated.id ? updated : v)
  saveVehicles(vehicles)
}

export function deleteVehicle(id) {
  saveVehicles(getVehicles().filter(v => v.id !== id))
}

// USERS
export function getUsers()        { return load('sr_users', defaultUsers) }
export function saveUsers(users)  { save('sr_users', users) }

export function getUserById(id)   { return getUsers().find(u => u.id === Number(id)) }

export function loginUser(username, password) {
  // Find user matching both username and password
  return getUsers().find(u => u.username === username && u.password === password) || null
}

export function updateUser(updated) {
  const users = getUsers().map(u => u.id === updated.id ? updated : u)
  saveUsers(users)
}

export function registerUser(username, email, password) {
  const users = getUsers()
  // Check if username already taken
  if (users.find(u => u.username === username)) return null
  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username, email, password, role: 'CUSTOMER'
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

// RENTALS
export function getRentals()          { return load('sr_rentals', defaultRentals) }
export function saveRentals(rentals)  { save('sr_rentals', rentals) }
export function getRentalById(id)     { return getRentals().find(r => r.id === Number(id)) }

export function getRentalsByUser(userId) {
  return getRentals().filter(r => r.userId === Number(userId))
}

export function addRental(rental) {
  const rentals = getRentals()
  rental.id = rentals.length ? Math.max(...rentals.map(r => r.id)) + 1 : 1
  rentals.push(rental)
  saveRentals(rentals)
  return rental
}

export function updateRental(updated) {
  saveRentals(getRentals().map(r => r.id === updated.id ? updated : r))
}

// Start instant rental: set vehicle to RENTED, rental to ACTIVE
export function startInstantRental(vehicleId, userId) {
  const vehicles = getVehicles()
  const vehicle  = vehicles.find(v => v.id === vehicleId)
  if (!vehicle || vehicle.status !== 'AVAILABLE') return null

  // Mark vehicle as rented
  vehicle.status = 'RENTED'
  saveVehicles(vehicles)

  // Create the rental record
  return addRental({
    userId, vehicleId,
    rentalType: 'INSTANT',
    status:     'ACTIVE',
    startTime:  new Date().toISOString(),
    endTime:    null,
    totalPrice: null,
    contract:   null
  })
}

// End instant rental: calculate price, set vehicle back to AVAILABLE
export function endInstantRental(rentalId) {
  const rentals = getRentals()
  const rental  = rentals.find(r => r.id === rentalId)
  if (!rental) return

  const vehicle   = getVehicleById(rental.vehicleId)
  const endTime   = new Date()
  const startTime = new Date(rental.startTime)
  const minutes   = Math.ceil((endTime - startTime) / (1000 * 60))

  rental.endTime    = endTime.toISOString()
  rental.status     = 'COMPLETED'
  rental.totalPrice = parseFloat((minutes * vehicle.pricePerMinute).toFixed(2))
  saveRentals(rentals)

  // Free the vehicle
  const vehicles = getVehicles()
  const v = vehicles.find(v => v.id === rental.vehicleId)
  if (v) { v.status = 'AVAILABLE'; saveVehicles(vehicles) }
}

// Submit contract rental request
export function submitContractRental(vehicleId, userId, startDate, endDate, deliveryLocation) {
  return addRental({
    userId, vehicleId,
    rentalType: 'CONTRACT',
    status:     'PENDING',
    startTime:  null,
    endTime:    null,
    totalPrice: null,
    contract:   { startDate, endDate, deliveryLocation, approved: false }
  })
}

// Admin approves a contract rental
export function approveContract(rentalId) {
  const rentals = getRentals()
  const rental  = rentals.find(r => r.id === rentalId)
  if (!rental) return

  const vehicle = getVehicleById(rental.vehicleId)
  const start   = new Date(rental.contract.startDate)
  const end     = new Date(rental.contract.endDate)
  const days    = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

  rental.contract.approved = true
  rental.status            = 'ACTIVE'
  rental.startTime         = rental.contract.startDate
  rental.totalPrice        = parseFloat((days * vehicle.pricePerDay).toFixed(2))
  saveRentals(rentals)

  // Mark vehicle as rented
  const vehicles = getVehicles()
  const v = vehicles.find(v => v.id === rental.vehicleId)
  if (v) { v.status = 'RENTED'; saveVehicles(vehicles) }
}

// AUTH helpers (stored in sessionStorage so logout clears it)
export function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem('sr_current_user')) } catch { return null }
}
export function setCurrentUser(user) {
  sessionStorage.setItem('sr_current_user', JSON.stringify(user))
}
export function clearCurrentUser() {
  sessionStorage.removeItem('sr_current_user')
}
