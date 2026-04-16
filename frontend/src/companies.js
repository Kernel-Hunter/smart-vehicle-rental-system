// ============================================================
// companies.js — Company data, CRUD, and registration
// ============================================================

import { load, save } from './storage.js'

const KEY = 'sr_companies'

const defaultCompanies = [
  {
    id: 1,
    username:     'autoplus',
    companyName:  'Auto Plus Tunis',
    email:        'contact@autoplus.tn',
    password:     'company123',
    role:         'COMPANY',
    city:         'Tunis',
    logo:         'AP',
    description:  'Premium vehicle rental since 2010',
    totalEarnings: 15420,
  },
  {
    id: 2,
    username:     'drivefast',
    companyName:  'DriveFast Rental',
    email:        'info@drivefast.tn',
    password:     'company123',
    role:         'COMPANY',
    city:         'Sousse',
    logo:         'DF',
    description:  'Fast. Reliable. Affordable.',
    totalEarnings: 8900,
  },
  {
    id: 3,
    username:     'luxauto',
    companyName:  'LuxAuto Premium',
    email:        'luxauto@premium.tn',
    password:     'company123',
    role:         'COMPANY',
    city:         'Sfax',
    logo:         'LA',
    description:  'Luxury fleet for business travel',
    totalEarnings: 22100,
  },
]

export function initCompanies() {
  if (!localStorage.getItem(KEY)) save(KEY, defaultCompanies)
}

export function getCompanies() {
  return load(KEY, defaultCompanies)
}

export function getCompanyById(id) {
  return getCompanies().find(c => c.id === Number(id))
}

export function saveCompanies(list) {
  save(KEY, list)
}

export function updateCompany(updated) {
  saveCompanies(getCompanies().map(c => c.id === updated.id ? updated : c))
}

export function registerCompany(username, companyName, email, password, city, description) {
  const companies = getCompanies()
  if (companies.find(c => c.username === username)) return null

  const newCompany = {
    id:            Math.max(...companies.map(c => c.id), 0) + 1,
    username,
    companyName,
    email,
    password,
    city,
    description,
    role:          'COMPANY',
    logo:          companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    totalEarnings: 0,
  }

  companies.push(newCompany)
  saveCompanies(companies)
  return newCompany
}
