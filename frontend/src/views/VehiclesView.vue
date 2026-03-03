<template>
  <div>
    <!-- ── Page header with title and refresh button ── -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Fleet Overview</h2>
        <p class="page-sub">Browse and rent available vehicles</p>
      </div>
      <button class="btn-refresh" @click="fetchVehicles">↻ Refresh</button>
    </div>

    <!-- Status messages -->
    <p v-if="loading" class="status-text">Loading vehicles...</p>
    <p v-if="error" class="msg-error">{{ error }}</p>
    <p v-if="actionMessage" class="msg-success">{{ actionMessage }}</p>

    <!-- ── Vehicle cards grid: one card per vehicle ── -->
    <div v-if="vehicles.length" class="vehicle-grid">
      <div v-for="v in vehicles" :key="v.id" class="vehicle-card">

        <!-- Card top: ID, name, and status badge -->
        <div class="card-top">
          <div>
            <p class="card-id">#{{ v.id }}</p>
            <h3 class="card-name">{{ v.brand }} {{ v.model }}</h3>
            <p class="card-type">{{ v.type }}</p>
          </div>
          <!-- Status badge color changes based on vehicle status -->
          <span :class="['status-badge', statusClass(v.status)]">{{ v.status }}</span>
        </div>

        <!-- Card pricing info -->
        <div class="card-prices">
          <div class="price-item">
            <span class="price-label">PER MINUTE</span>
            <span class="price-value">{{ v.pricePerMinute }} DZD</span>
          </div>
          <div class="price-divider"></div>
          <div class="price-item">
            <span class="price-label">PER DAY</span>
            <span class="price-value">{{ v.pricePerDay }} DZD</span>
          </div>
        </div>

        <!-- Location line -->
        <p class="card-location">◎ {{ v.location || 'No location set' }}</p>

        <!-- ── Action buttons: shown based on login state and vehicle availability ── -->
        <div class="card-actions">
          <!-- Not logged in -->
          <span v-if="!isLoggedIn" class="hint-text">Login to rent this vehicle</span>

          <!-- Logged in but vehicle not available -->
          <span v-else-if="v.status !== 'AVAILABLE'" class="hint-text">Vehicle not available</span>

          <!-- Available + logged in: show both rental options -->
          <div v-else class="action-btns">
            <!-- Instant rental: starts immediately, billed per minute -->
            <button class="btn-instant" @click="startInstant(v.id)">⚡ Instant Rental</button>
            <!-- Contract rental: opens form below for date range + admin approval -->
            <button class="btn-contract" @click="openContract(v)">📋 Request Contract</button>
          </div>
        </div>

      </div>
    </div>

    <p v-else-if="!loading" class="status-text">No vehicles found.</p>

    <!-- ── Contract rental form: appears when a vehicle is selected ── -->
    <div v-if="contractVehicle" class="contract-panel">
      <div class="panel-header">
        <h3 class="panel-title">Contract Rental Request</h3>
        <!-- X button to dismiss the form -->
        <button class="btn-close" @click="contractVehicle = null">✕</button>
      </div>

      <p class="panel-vehicle">{{ contractVehicle.brand }} {{ contractVehicle.model }}</p>

      <div class="form-grid">
        <div class="field">
          <label class="field-label">START DATE</label>
          <input v-model="contractForm.startDate" type="date" class="field-input" required />
        </div>
        <div class="field">
          <label class="field-label">END DATE</label>
          <input v-model="contractForm.endDate" type="date" class="field-input" required />
        </div>
      </div>

      <div class="field">
        <label class="field-label">DELIVERY LOCATION</label>
        <input v-model="contractForm.deliveryLocation" type="text" class="field-input" placeholder="Optional delivery address" />
      </div>

      <div class="panel-actions">
        <button class="btn-primary" @click="submitContract">Submit Request</button>
        <button class="btn-ghost" @click="contractVehicle = null">Cancel</button>
      </div>

      <p v-if="contractMessage" class="msg-success">{{ contractMessage }}</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VehiclesView',

  data() {
    return {
      vehicles: [],          // All vehicles returned by the backend
      loading: false,        // Controls the loading message
      error: '',             // Shown if vehicle fetch fails
      actionMessage: '',     // Shown after instant rental action
      contractVehicle: null, // The vehicle selected for contract (controls form visibility)
      contractForm: { startDate: '', endDate: '', deliveryLocation: '' },
      contractMessage: ''    // Shown after contract form submission
    }
  },

  computed: {
    // True if a JWT token exists — controls which buttons are visible
    isLoggedIn() { return !!localStorage.getItem('token') }
  },

  // Automatically fetch vehicles when this page loads
  mounted() { this.fetchVehicles() },

  methods: {
    // Returns the Authorization header for protected backend endpoints
    auth() {
      return { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    },

    // Returns a CSS class name based on vehicle status for badge coloring
    statusClass(status) {
      if (status === 'AVAILABLE') return 'badge-green'
      if (status === 'RENTED') return 'badge-blue'
      return 'badge-yellow' // MAINTENANCE
    },

    // Fetches all vehicles from the public endpoint (no auth required)
    async fetchVehicles() {
      this.loading = true
      this.error = ''
      try {
        const res = await axios.get('http://localhost:8080/api/vehicles')
        this.vehicles = res.data
      } catch {
        this.error = 'Failed to load vehicles.'
      } finally {
        this.loading = false
      }
    },

    // Starts an instant rental: backend sets rental ACTIVE, vehicle RENTED
    async startInstant(vehicleId) {
      this.actionMessage = ''
      try {
        await axios.post('http://localhost:8080/api/rentals/instant/start', { vehicleId }, this.auth())
        this.actionMessage = 'Instant rental started successfully!'
        this.fetchVehicles() // Refresh so the card shows RENTED status
      } catch (err) {
        this.actionMessage = err.response?.data?.message || 'Failed to start rental.'
      }
    },

    // Opens the contract form for the selected vehicle
    openContract(vehicle) {
      this.contractVehicle = vehicle
      this.contractForm = { startDate: '', endDate: '', deliveryLocation: '' }
      this.contractMessage = ''
    },

    // Submits contract rental: backend creates PENDING rental, admin must approve
    async submitContract() {
      this.contractMessage = ''
      try {
        await axios.post('http://localhost:8080/api/rentals/contract', {
          vehicleId: this.contractVehicle.id,
          ...this.contractForm // spreads startDate, endDate, deliveryLocation
        }, this.auth())
        this.contractMessage = 'Request submitted! Awaiting admin approval.'
        this.contractVehicle = null // Hide the form
      } catch (err) {
        this.contractMessage = err.response?.data?.message || 'Failed to submit request.'
      }
    }
  }
}
</script>

<style scoped>
/* ── Page header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.page-sub {
  color: #475569;
  font-size: 13px;
  margin-top: 4px;
}

.btn-refresh {
  background: transparent;
  border: 1px solid #1e2535;
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-refresh:hover { background: #0f1a2e; }

/* ── Vehicle grid ── */
.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* ── Vehicle card ── */
.vehicle-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.2s;
}
.vehicle-card:hover { border-color: #2a4a7f; }

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-id { color: #3b82f6; font-size: 11px; letter-spacing: 2px; }

.card-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #e2e8f0;
  margin-top: 2px;
}

.card-type { color: #475569; font-size: 12px; margin-top: 2px; }

/* Status badge with dynamic color class */
.status-badge {
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 1px;
  font-weight: 500;
}
.badge-green { background: #052e16; color: #22c55e; border: 1px solid #166534; }
.badge-blue  { background: #0c1a3a; color: #60a5fa; border: 1px solid #1e3a5f; }
.badge-yellow{ background: #1c1500; color: #eab308; border: 1px solid #854d0e; }

/* Pricing row */
.card-prices {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #0d0f14;
  border: 1px solid #1e2535;
  border-radius: 6px;
  padding: 12px 16px;
}

.price-item { display: flex; flex-direction: column; gap: 3px; }
.price-label { color: #475569; font-size: 10px; letter-spacing: 2px; }
.price-value { color: #3b82f6; font-size: 15px; font-weight: 500; }
.price-divider { width: 1px; height: 28px; background: #1e2535; }

.card-location { color: #475569; font-size: 12px; }

/* Action area */
.card-actions { margin-top: auto; }
.hint-text { color: #334155; font-size: 12px; }

.action-btns { display: flex; gap: 8px; flex-wrap: wrap; }

.btn-instant {
  flex: 1;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 9px 12px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  transition: background 0.2s;
}
.btn-instant:hover { background: #2563eb; }

.btn-contract {
  flex: 1;
  background: transparent;
  color: #3b82f6;
  border: 1px solid #1e3a5f;
  border-radius: 4px;
  padding: 9px 12px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  transition: all 0.2s;
}
.btn-contract:hover { background: #0f1a2e; }

/* ── Contract panel ── */
.contract-panel {
  margin-top: 36px;
  background: #13161e;
  border: 1px solid #1e3a5f;
  border-radius: 8px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 600px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}

.panel-vehicle { color: #3b82f6; font-size: 14px; }

.btn-close {
  background: transparent;
  border: none;
  color: #475569;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-close:hover { color: #ef4444; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Shared field styles (reused in all views) */
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; letter-spacing: 2px; color: #475569; }
.field-input {
  background: #0d0f14;
  border: 1px solid #1e2535;
  border-radius: 4px;
  padding: 10px 14px;
  color: #c8d0e0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.field-input:focus { border-color: #3b82f6; }

.panel-actions { display: flex; gap: 10px; }

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  transition: background 0.2s;
}
.btn-primary:hover { background: #2563eb; }

.btn-ghost {
  background: transparent;
  color: #475569;
  border: 1px solid #1e2535;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-ghost:hover { color: #94a3b8; border-color: #2a3548; }

/* Feedback messages */
.msg-error   { color: #ef4444; font-size: 13px; }
.msg-success { color: #22c55e; font-size: 13px; }
.status-text { color: #475569; font-size: 13px; }
</style>