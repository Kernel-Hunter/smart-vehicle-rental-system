// store/data.js
// Compatibility shim — all views import from here.
// Actual logic lives in the split modules: storage.js, companies.js,
// customers.js, vehicles.js, rentals.js, auth.js
// This file just boots the store and re-exports everything.
export * from './index.js'
