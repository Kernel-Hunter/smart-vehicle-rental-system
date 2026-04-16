// ============================================================
// storage.js — localStorage helpers & data version management
// ============================================================

// Bump this string whenever the data schema changes.
// It forces a full localStorage wipe so stale old data never breaks the app.
export const DATA_VERSION = 'v3-cities'

export function load(key, defaults) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaults
  } catch {
    return defaults
  }
}

export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function resetIfOutdated() {
  if (localStorage.getItem('sr_data_version') !== DATA_VERSION) {
    localStorage.removeItem('sr_companies')
    localStorage.removeItem('sr_customers')
    localStorage.removeItem('sr_vehicles')
    localStorage.removeItem('sr_rentals')
    localStorage.setItem('sr_data_version', DATA_VERSION)
  }
}
