// ============================================================
// auth.js — Session management and login
// Uses sessionStorage so the session clears on tab close
// ============================================================

import { getCompanies } from './companies.js'
import { getCustomers } from './customers.js'

const SESSION_KEY = 'sr_user'

export function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

export function setCurrentUser(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearCurrentUser() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function loginUser(username, password, role) {
  if (role === 'COMPANY') {
    return getCompanies().find(c => c.username === username && c.password === password) || null
  }
  return getCustomers().find(u => u.username === username && u.password === password) || null
}
