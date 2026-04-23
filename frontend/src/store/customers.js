// ============================================================
// customers.js — Customer data, CRUD, and registration
// ============================================================

import { load, save } from './storage.js'

const KEY = 'sr_customers'

const defaultCustomers = [
  { id: 101, username: 'karim', email: 'karim@email.com', password: 'karim123', role: 'CUSTOMER', fullName: 'Karim Masmoudi' },
  { id: 102, username: 'bilel', email: 'bilel@email.com', password: 'bilel123', role: 'CUSTOMER', fullName: 'Bilel Didi'     },
  { id: 103, username: 'aziz',  email: 'aziz@email.com',  password: 'aziz123',  role: 'CUSTOMER', fullName: 'Aziz Zemzmi'   },
  { id: 104, username: 'ahmed', email: 'ahmed@email.com', password: 'ahmed123', role: 'CUSTOMER', fullName: 'Ahmed Tahri'   },
]

export function initCustomers() {
  if (!localStorage.getItem(KEY)) save(KEY, defaultCustomers)
}

export function getCustomers() {
  return load(KEY, defaultCustomers)
}

export function getCustomerById(id) {
  return getCustomers().find(u => u.id === Number(id))
}

export function saveCustomers(list) {
  save(KEY, list)
}

export function updateCustomer(updated) {
  saveCustomers(getCustomers().map(u => u.id === updated.id ? updated : u))
}

export function registerCustomer(username, email, password, fullName) {
  const customers = getCustomers()
  if (customers.find(u => u.username === username)) return null

  const newCustomer = {
    id: Math.max(...customers.map(u => u.id), 0) + 1,
    username,
    email,
    password,
    fullName,
    role: 'CUSTOMER',
  }

  customers.push(newCustomer)
  saveCustomers(customers)
  return newCustomer
}
