<template>
  <div>
    <!-- Back navigation -->
    <router-link to="/vehicles" class="back-link">← Back to Fleet</router-link>

    <!-- Loading and error states -->
    <p v-if="loading" class="status-text">Loading vehicle...</p>
    <p v-if="error" class="msg-error">{{ error }}</p>

    <!-- Main vehicle detail card -->
    <div v-if="vehicle" class="detail-layout">

      <!-- LEFT: Vehicle info -->
      <div class="detail-main">
        <div class="detail-header">
          <div>
            <p class="detail-id">#{{ vehicle.id }}</p>
            <h1 class="detail-name">{{ vehicle.brand }} {{ vehicle.model }}</h1>
            <p class="detail-type">{{ vehicle.type }}</p>
          </div>
          <!-- Status badge -->
          <span :class="['status-badge', statusClass(vehicle.status)]">
            {{ vehicle.status }}
          </span>
        </div>

        <!-- Info grid: key vehicle details -->
        <div class="info-grid">
          <div class="info-item">
            <p class="info-label">LOCATION</p>
            <p class="info-value">◎ {{ vehicle.location || 'Not set' }}</p>
          </div>
          <div class="info-item">
            <p class="info-label">VEHICLE TYPE</p>
            <p class="info-value">{{ vehicle.type }}</p>
          </div>
          <div class="info-item">
            <p class="info-label">PRICE PER MINUTE</p>
            <p class="info-value accent">{{ vehicle.pricePerMinute }} DZD</p>
          </div>
          <div class="info-item">
            <p class="info-label">PRICE PER DAY</p>
            <p class="info-value accent">{{ vehicle.pricePerDay }} DZD</p>
          </div>
        </div>

        <!-- Price estimator -->
        <div class="estimator">
          <p class="estimator-title">Price Estimator</p>
          <div class="estimator-row">
            <div class="est-item">
              <label class="field-label">DURATION (minutes)</label>
              <input v-model.number="estMinutes" type="number" min="1" class="field-input" placeholder="e.g. 30" />
              <p class="est-result">≈ {{ (estMinutes * vehicle.pricePerMinute).toFixed(2) }} DZD</p>
            </div>
            <div class="est-divider"></div>
            <div class="est-item">
              <label class="field-label">DURATION (days)</label>
              <input v-model.number="estDays" type="number" min="1" class="field-input" placeholder="e.g. 3" />
              <p class="est-result">≈ {{ (estDays * vehicle.pricePerDay).toFixed(2) }} DZD</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Rental actions panel -->
      <div class="action-panel">
        <p class="panel-title">Rent This Vehicle</p>

        <!-- Not logged in -->
        <div v-if="!isLoggedIn" class="panel-section">
          <p class="hint-text">You must be logged in to rent this vehicle.</p>
          <router-link to="/login" class="btn-primary full-width">Login to Rent</router-link>
        </div>

        <!-- Vehicle not available -->
        <div v-else-if="vehicle.status !== 'AVAILABLE'" class="panel-section">
          <p class="hint-text">This vehicle is currently not available for rental.</p>
        </div>

        <!-- Available actions -->
        <div v-else class="panel-section">
          <!-- Instant rental action -->
          <div class="action-block">
            <p class="action-title">⚡ Instant Rental</p>
            <p class="action-desc">Start immediately. Billed per minute when you end.</p>
            <button class="btn-primary full-width" @click="startInstant">Start Now</button>
          </div>

          <div class="action-separator">or</div>

          <!-- Contract rental form -->
          <div class="action-block">
            <p class="action-title">📋 Contract Rental</p>
            <p class="action-desc">Choose dates. Admin approves. Billed per day.</p>
            <div class="field">
              <label class="field-label">START DATE</label>
              <input v-model="contractForm.startDate" type="date" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">END DATE</label>
              <input v-model="contractForm.endDate" type="date" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">DELIVERY LOCATION</label>
              <input v-model="contractForm.deliveryLocation" type="text" class="field-input" placeholder="Optional" />
            </div>
            <button class="btn-outline full-width" @click="submitContract">Submit Request</button>
          </div>
        </div>

        <!-- Feedback messages -->
        <p v-if="actionMessage" class="msg-success">{{ actionMessage }}</p>
        <p v-if="actionError" class="msg-error">{{ actionError }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VehicleDetailView',

  data() {
    return {
      vehicle: null,    // Vehicle data loaded from backend
      loading: false,
      error: '',
      estMinutes: 30,   // Default estimator value for minutes
      estDays: 1,       // Default estimator value for days
      contractForm: { startDate: '', endDate: '', deliveryLocation: '' },
      actionMessage: '',
      actionError: ''
    }
  },

  computed: {
    isLoggedIn() { return !!localStorage.getItem('token') }
  },

  // Fetch vehicle when page loads using the ID from the URL
  mounted() { this.fetchVehicle() },

  methods: {
    auth() {
      return { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    },

    // Returns CSS badge class based on vehicle status
    statusClass(status) {
      if (status === 'AVAILABLE') return 'badge-green'
      if (status === 'RENTED')    return 'badge-blue'
      return 'badge-yellow'
    },

    // Fetches the vehicle by ID from the URL parameter
    async fetchVehicle() {
      this.loading = true
      try {
        const id = this.$route.params.id
        const res = await axios.get(`http://localhost:8080/api/vehicles/${id}`)
        this.vehicle = res.data
      } catch {
        this.error = 'Vehicle not found.'
      } finally {
        this.loading = false
      }
    },

    // Starts an instant rental for this vehicle
    async startInstant() {
      this.actionMessage = ''
      this.actionError = ''
      try {
        await axios.post('http://localhost:8080/api/rentals/instant/start',
          { vehicleId: this.vehicle.id }, this.auth())
        this.actionMessage = 'Instant rental started!'
        this.fetchVehicle() // Refresh to show RENTED status
      } catch (err) {
        this.actionError = err.response?.data?.message || 'Failed to start rental.'
      }
    },

    // Submits a contract rental request for this vehicle
    async submitContract() {
      this.actionMessage = ''
      this.actionError = ''
      try {
        await axios.post('http://localhost:8080/api/rentals/contract', {
          vehicleId: this.vehicle.id,
          ...this.contractForm
        }, this.auth())
        this.actionMessage = 'Contract request submitted. Awaiting admin approval.'
        this.contractForm = { startDate: '', endDate: '', deliveryLocation: '' }
      } catch (err) {
        this.actionError = err.response?.data?.message || 'Failed to submit request.'
      }
    }
  }
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  color: #3b82f6;
  font-size: 13px;
  margin-bottom: 28px;
  transition: opacity 0.2s;
}
.back-link:hover { opacity: 0.7; }

/* Two-column layout: info on left, actions on right */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: flex-start;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 28px;
}

.detail-id { color: #3b82f6; font-size: 12px; letter-spacing: 2px; }

.detail-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #e2e8f0;
  margin-top: 4px;
}

.detail-type { color: #475569; font-size: 13px; margin-top: 4px; }

/* Status badges */
.status-badge { padding: 4px 12px; border-radius: 3px; font-size: 12px; letter-spacing: 1px; }
.badge-green  { background: #052e16; color: #22c55e; border: 1px solid #166534; }
.badge-blue   { background: #0c1a3a; color: #60a5fa; border: 1px solid #1e3a5f; }
.badge-yellow { background: #1c1500; color: #eab308; border: 1px solid #854d0e; }

/* Info grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 6px;
  padding: 18px;
}

.info-label { color: #475569; font-size: 11px; letter-spacing: 2px; }
.info-value { color: #c8d0e0; font-size: 16px; margin-top: 6px; }
.accent     { color: #3b82f6; }

/* Price estimator */
.estimator {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
}

.estimator-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.estimator-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.est-item { flex: 1; display: flex; flex-direction: column; gap: 8px; }

.est-result { color: #22c55e; font-size: 15px; font-weight: 500; margin-top: 4px; }

.est-divider { width: 1px; background: #1e2535; align-self: stretch; }

/* Action panel */
.action-panel {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 80px; /* Sticks below the topbar */
}

.panel-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}

.panel-section { display: flex; flex-direction: column; gap: 16px; }

.action-block { display: flex; flex-direction: column; gap: 12px; }

.action-title { color: #e2e8f0; font-size: 14px; font-weight: 500; }
.action-desc  { color: #475569; font-size: 12px; }

.action-separator {
  text-align: center;
  color: #2a3548;
  font-size: 12px;
  letter-spacing: 2px;
  position: relative;
}

/* Shared field/input styles */
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; letter-spacing: 2px; color: #475569; }
.field-input {
  background: #0d0f14;
  border: 1px solid #1e2535;
  border-radius: 4px;
  padding: 9px 12px;
  color: #c8d0e0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
.field-input:focus { border-color: #3b82f6; }

.full-width { width: 100%; text-align: center; }

.btn-primary {
  display: block;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 11px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  transition: background 0.2s;
  text-decoration: none;
}
.btn-primary:hover { background: #2563eb; }

.btn-outline {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #1e3a5f;
  border-radius: 4px;
  padding: 11px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-outline:hover { background: #0f1a2e; }

.hint-text   { color: #475569; font-size: 13px; }
.msg-success { color: #22c55e; font-size: 13px; }
.msg-error   { color: #ef4444; font-size: 13px; }
.status-text { color: #475569; font-size: 13px; }
</style>
