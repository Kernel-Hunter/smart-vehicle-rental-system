<template>
  <div>
    <!-- Page header -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Platform Statistics</h2>
        <p class="page-sub">Overview of rentals, fleet and revenue</p>
      </div>
      <button class="btn-refresh" @click="fetchData">↻ Refresh</button>
    </div>

    <p v-if="loading" class="status-text">Loading statistics...</p>
    <p v-if="error" class="msg-error">{{ error }}</p>

    <div v-if="!loading">

      <!-- ── TOP STATS GRID ── -->
      <div class="stats-grid">
        <div class="stat-card" v-for="s in topStats" :key="s.label">
          <p class="stat-icon">{{ s.icon }}</p>
          <p class="stat-value">{{ s.value }}</p>
          <p class="stat-label">{{ s.label }}</p>
        </div>
      </div>

      <!-- ── RENTAL BREAKDOWN ── -->
      <div class="row-grid">

        <!-- Rentals by status -->
        <div class="breakdown-card">
          <p class="card-title">Rentals by Status</p>
          <div class="bar-item" v-for="item in rentalsByStatus" :key="item.label">
            <div class="bar-meta">
              <span class="bar-label">{{ item.label }}</span>
              <span class="bar-count">{{ item.count }}</span>
            </div>
            <!-- Width of the bar is proportional to the total rentals -->
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: totalRentals ? (item.count / totalRentals * 100) + '%' : '0%',
                          background: item.color }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Rentals by type -->
        <div class="breakdown-card">
          <p class="card-title">Rentals by Type</p>
          <div class="bar-item" v-for="item in rentalsByType" :key="item.label">
            <div class="bar-meta">
              <span class="bar-label">{{ item.label }}</span>
              <span class="bar-count">{{ item.count }}</span>
            </div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: totalRentals ? (item.count / totalRentals * 100) + '%' : '0%',
                          background: item.color }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Vehicle fleet status -->
        <div class="breakdown-card">
          <p class="card-title">Fleet Status</p>
          <div class="bar-item" v-for="item in fleetByStatus" :key="item.label">
            <div class="bar-meta">
              <span class="bar-label">{{ item.label }}</span>
              <span class="bar-count">{{ item.count }}</span>
            </div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: totalVehicles ? (item.count / totalVehicles * 100) + '%' : '0%',
                          background: item.color }"
              ></div>
            </div>
          </div>
        </div>

      </div>

      <!-- ── RECENT RENTALS TABLE ── -->
      <div class="recent-section">
        <p class="card-title">Recent Rentals</p>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th><th>User</th><th>Vehicle</th>
                <th>Type</th><th>Status</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              <!-- Show only the 5 most recent rentals -->
              <tr v-for="r in recentRentals" :key="r.id">
                <td class="id-cell">#{{ r.id }}</td>
                <td>{{ r.user?.username }}</td>
                <td>{{ r.vehicle?.brand }} {{ r.vehicle?.model }}</td>
                <td>
                  <span :class="['type-badge', r.rentalType === 'INSTANT' ? 'type-instant' : 'type-contract']">
                    {{ r.rentalType }}
                  </span>
                </td>
                <td>
                  <span :class="['status-badge', statusClass(r.status)]">{{ r.status }}</span>
                </td>
                <td class="price-cell">
                  {{ r.totalPrice != null ? r.totalPrice + ' DZD' : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AdminStatsView',

  data() {
    return {
      rentals: [],    // All rentals — used to compute all rental stats
      vehicles: [],   // All vehicles — used to compute fleet stats
      loading: false,
      error: ''
    }
  },

  computed: {
    totalRentals()  { return this.rentals.length },
    totalVehicles() { return this.vehicles.length },

    // Total revenue: sum of all completed rental prices
    totalRevenue() {
      return this.rentals
        .filter(r => r.totalPrice != null)
        .reduce((sum, r) => sum + r.totalPrice, 0)
        .toFixed(2)
    },

    // Pending contracts waiting for admin approval
    pendingContracts() {
      return this.rentals.filter(r => r.status === 'PENDING' && r.rentalType === 'CONTRACT').length
    },

    // Top summary stat cards
    topStats() {
      return [
        { icon: '📋', value: this.totalRentals,    label: 'TOTAL RENTALS' },
        { icon: '🚗', value: this.totalVehicles,   label: 'TOTAL VEHICLES' },
        { icon: '💰', value: this.totalRevenue + ' DZD', label: 'TOTAL REVENUE' },
        { icon: '⏳', value: this.pendingContracts, label: 'PENDING CONTRACTS' }
      ]
    },

    // Breakdown of rentals by status for the bar chart
    rentalsByStatus() {
      const statuses = ['ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED']
      const colors   = { ACTIVE: '#22c55e', PENDING: '#eab308', COMPLETED: '#3b82f6', CANCELLED: '#ef4444' }
      return statuses.map(s => ({
        label: s,
        count: this.rentals.filter(r => r.status === s).length,
        color: colors[s]
      }))
    },

    // Breakdown of rentals by type
    rentalsByType() {
      return [
        { label: 'INSTANT',  count: this.rentals.filter(r => r.rentalType === 'INSTANT').length,  color: '#60a5fa' },
        { label: 'CONTRACT', count: this.rentals.filter(r => r.rentalType === 'CONTRACT').length, color: '#a78bfa' }
      ]
    },

    // Fleet broken down by vehicle status
    fleetByStatus() {
      return [
        { label: 'AVAILABLE',   count: this.vehicles.filter(v => v.status === 'AVAILABLE').length,   color: '#22c55e' },
        { label: 'RENTED',      count: this.vehicles.filter(v => v.status === 'RENTED').length,      color: '#60a5fa' },
        { label: 'MAINTENANCE', count: this.vehicles.filter(v => v.status === 'MAINTENANCE').length, color: '#eab308' }
      ]
    },

    // Last 5 rentals sorted by ID descending
    recentRentals() {
      return [...this.rentals].sort((a, b) => b.id - a.id).slice(0, 5)
    }
  },

  mounted() { this.fetchData() },

  methods: {
    auth() {
      return { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    },

    statusClass(status) {
      if (status === 'ACTIVE')    return 'badge-green'
      if (status === 'PENDING')   return 'badge-yellow'
      if (status === 'COMPLETED') return 'badge-blue'
      return 'badge-red'
    },

    // Fetches both rentals and vehicles in parallel for stats computation
    async fetchData() {
      this.loading = true
      this.error = ''
      try {
        const [rentalsRes, vehiclesRes] = await Promise.all([
          axios.get('http://localhost:8080/api/rentals', this.auth()),
          axios.get('http://localhost:8080/api/vehicles', this.auth())
        ])
        this.rentals  = rentalsRes.data
        this.vehicles = vehiclesRes.data
      } catch {
        this.error = 'Failed to load statistics.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}
.page-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}
.page-sub { color: #475569; font-size: 13px; margin-top: 4px; }

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

/* Top stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat-icon  { font-size: 24px; }
.stat-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
}
.stat-label { color: #475569; font-size: 11px; letter-spacing: 2px; }

/* Breakdown row: 3 bar charts side by side */
.row-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.breakdown-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

/* Bar chart item */
.bar-item { display: flex; flex-direction: column; gap: 6px; }

.bar-meta {
  display: flex;
  justify-content: space-between;
}
.bar-label { color: #64748b; font-size: 12px; letter-spacing: 1px; }
.bar-count { color: #94a3b8; font-size: 12px; }

.bar-track {
  height: 6px;
  background: #1e2535;
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
  min-width: 4px;
}

/* Recent rentals */
.recent-section {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-wrapper { overflow-x: auto; border: 1px solid #1e2535; border-radius: 6px; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table thead tr { background: #0d0f14; border-bottom: 1px solid #1e2535; }
.data-table th { padding: 10px 14px; text-align: left; color: #475569; font-size: 11px; letter-spacing: 1px; }
.data-table tbody tr { border-bottom: 1px solid #1a1e2a; transition: background 0.15s; }
.data-table tbody tr:hover { background: #0f1218; }
.data-table tbody tr:last-child { border-bottom: none; }
.data-table td { padding: 12px 14px; color: #94a3b8; vertical-align: middle; }

.id-cell    { color: #3b82f6; font-size: 12px; }
.price-cell { color: #22c55e; }

.status-badge, .type-badge { padding: 3px 10px; border-radius: 3px; font-size: 11px; letter-spacing: 1px; }
.badge-green  { background: #052e16; color: #22c55e; border: 1px solid #166534; }
.badge-yellow { background: #1c1500; color: #eab308; border: 1px solid #854d0e; }
.badge-blue   { background: #0c1a3a; color: #60a5fa; border: 1px solid #1e3a5f; }
.badge-red    { background: #1f0707; color: #ef4444; border: 1px solid #7f1d1d; }
.type-instant  { background: #0c1a3a; color: #60a5fa; border: 1px solid #1e3a5f; }
.type-contract { background: #1a0c3a; color: #a78bfa; border: 1px solid #3b1f7f; }

.msg-error   { color: #ef4444; font-size: 13px; }
.status-text { color: #475569; font-size: 13px; }
</style>
