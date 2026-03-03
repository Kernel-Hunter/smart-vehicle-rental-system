<template>
  <div>
    <!-- ── Page header ── -->
    <div class="page-header">
      <div>
        <h2 class="page-title">My Rentals</h2>
        <p class="page-sub">Your complete rental history</p>
      </div>
      <button class="btn-refresh" @click="fetchRentals">↻ Refresh</button>
    </div>

    <p v-if="loading" class="status-text">Loading rentals...</p>
    <p v-if="error" class="msg-error">{{ error }}</p>

    <!-- ── Rentals table ── -->
    <div v-if="rentals.length" class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Status</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <!-- One row per rental -->
          <tr v-for="r in rentals" :key="r.id">
            <td class="id-cell">#{{ r.id }}</td>
            <td>{{ r.vehicle?.brand }} {{ r.vehicle?.model }}</td>
            <!-- Rental type badge: INSTANT or CONTRACT -->
            <td><span :class="['type-badge', r.rentalType === 'INSTANT' ? 'type-instant' : 'type-contract']">{{ r.rentalType }}</span></td>
            <!-- Status badge with dynamic color -->
            <td><span :class="['status-badge', statusClass(r.status)]">{{ r.status }}</span></td>
            <td class="time-cell">{{ r.startTime || '—' }}</td>
            <td class="time-cell">{{ r.endTime || '—' }}</td>
            <!-- Total price only appears after rental ends -->
            <td class="price-cell">{{ r.totalPrice != null ? r.totalPrice + ' DZD' : '—' }}</td>
            <td>
              <!-- End Rental button: only for ACTIVE INSTANT rentals -->
              <button
                v-if="r.status === 'ACTIVE' && r.rentalType === 'INSTANT'"
                class="btn-end"
                @click="endRental(r.id)"
              >
                End Rental
              </button>
              <span v-else class="no-action">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="!loading" class="status-text">You have no rentals yet.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RentalsView',
  data() {
    return {
      rentals: [],    // List of rentals belonging to the logged-in user
      loading: false,
      error: ''
    }
  },

  // Fetch rentals immediately when page loads
  mounted() { this.fetchRentals() },

  methods: {
    // Authorization header using JWT token from localStorage
    auth() {
      return { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    },

    // Returns CSS class name for coloring status badges
    statusClass(status) {
      if (status === 'ACTIVE')    return 'badge-green'
      if (status === 'PENDING')   return 'badge-yellow'
      if (status === 'COMPLETED') return 'badge-gray'
      return 'badge-red' // CANCELLED
    },

    // Fetches only the logged-in user's rentals
    // Backend reads the user identity from the JWT token
    async fetchRentals() {
      this.loading = true
      try {
        const res = await axios.get('http://localhost:8080/api/rentals/my', this.auth())
        this.rentals = res.data
      } catch {
        this.error = 'Failed to load rentals.'
      } finally {
        this.loading = false
      }
    },

    // Ends an active instant rental:
    // backend sets endTime, calculates totalPrice, sets vehicle back to AVAILABLE
    async endRental(id) {
      try {
        await axios.post(`http://localhost:8080/api/rentals/instant/end/${id}`, {}, this.auth())
        this.fetchRentals() // Refresh table to show COMPLETED status and final price
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to end rental.'
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

/* ── Table wrapper adds horizontal scroll on small screens ── */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #1e2535;
  border-radius: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

/* Table header */
.data-table thead tr {
  background: #0d0f14;
  border-bottom: 1px solid #1e2535;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  color: #475569;
  font-weight: 500;
  letter-spacing: 1px;
  font-size: 11px;
  white-space: nowrap;
}

/* Table body rows */
.data-table tbody tr {
  border-bottom: 1px solid #1a1e2a;
  transition: background 0.15s;
}
.data-table tbody tr:hover { background: #13161e; }
.data-table tbody tr:last-child { border-bottom: none; }

.data-table td {
  padding: 14px 16px;
  color: #94a3b8;
  vertical-align: middle;
}

/* Special cell styling */
.id-cell    { color: #3b82f6; font-size: 12px; }
.time-cell  { color: #64748b; font-size: 12px; }
.price-cell { color: #22c55e; font-weight: 500; }
.no-action  { color: #2a3548; }

/* Status badges */
.status-badge {
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 1px;
}
.badge-green  { background: #052e16; color: #22c55e; border: 1px solid #166534; }
.badge-yellow { background: #1c1500; color: #eab308; border: 1px solid #854d0e; }
.badge-gray   { background: #1a1e2a; color: #64748b; border: 1px solid #2a3548; }
.badge-red    { background: #1f0707; color: #ef4444; border: 1px solid #7f1d1d; }

/* Type badges */
.type-badge {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 1px;
}
.type-instant  { background: #0c1a3a; color: #60a5fa; border: 1px solid #1e3a5f; }
.type-contract { background: #1a0c3a; color: #a78bfa; border: 1px solid #3b1f7f; }

/* End rental button */
.btn-end {
  background: transparent;
  border: 1px solid #7f1d1d;
  color: #ef4444;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-end:hover { background: #1f0707; }

.msg-error  { color: #ef4444; font-size: 13px; margin-bottom: 16px; }
.status-text { color: #475569; font-size: 13px; }
</style>