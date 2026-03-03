<template>
  <div>
    <router-link to="/rentals" class="back-link">← Back to My Rentals</router-link>

    <p v-if="loading" class="status-text">Loading contract...</p>
    <p v-if="error" class="msg-error">{{ error }}</p>

    <div v-if="rental" class="contract-layout">

      <!-- Header -->
      <div class="contract-header">
        <div>
          <p class="contract-id">CONTRACT #{{ rental.id }}</p>
          <h2 class="contract-title">
            {{ rental.vehicle?.brand }} {{ rental.vehicle?.model }}
          </h2>
        </div>
        <!-- Combined status badges -->
        <div class="badges">
          <span :class="['status-badge', statusClass(rental.status)]">{{ rental.status }}</span>
          <span class="type-badge">CONTRACT</span>
        </div>
      </div>

      <!-- Details grid -->
      <div class="details-grid">

        <!-- Vehicle info -->
        <div class="detail-card">
          <p class="card-label">VEHICLE INFO</p>
          <div class="detail-row">
            <span class="dr-key">Brand</span>
            <span class="dr-val">{{ rental.vehicle?.brand }}</span>
          </div>
          <div class="detail-row">
            <span class="dr-key">Model</span>
            <span class="dr-val">{{ rental.vehicle?.model }}</span>
          </div>
          <div class="detail-row">
            <span class="dr-key">Type</span>
            <span class="dr-val">{{ rental.vehicle?.type }}</span>
          </div>
          <div class="detail-row">
            <span class="dr-key">Price/Day</span>
            <span class="dr-val accent">{{ rental.vehicle?.pricePerDay }} DZD</span>
          </div>
        </div>

        <!-- Contract dates -->
        <div class="detail-card">
          <p class="card-label">CONTRACT DATES</p>
          <div class="detail-row">
            <span class="dr-key">Start Date</span>
            <span class="dr-val">{{ rental.contract?.startDate || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="dr-key">End Date</span>
            <span class="dr-val">{{ rental.contract?.endDate || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="dr-key">Duration</span>
            <span class="dr-val">{{ durationDays }} day(s)</span>
          </div>
          <div class="detail-row">
            <span class="dr-key">Delivery Location</span>
            <span class="dr-val">{{ rental.contract?.deliveryLocation || 'Not specified' }}</span>
          </div>
        </div>

        <!-- Payment info -->
        <div class="detail-card">
          <p class="card-label">PAYMENT</p>
          <div class="detail-row">
            <span class="dr-key">Approval Status</span>
            <!-- Green if approved, yellow if waiting -->
            <span :class="rental.contract?.approved ? 'val-green' : 'val-yellow'">
              {{ rental.contract?.approved ? 'Approved' : 'Pending Approval' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="dr-key">Rental Status</span>
            <span class="dr-val">{{ rental.status }}</span>
          </div>
          <div class="detail-row">
            <span class="dr-key">Total Price</span>
            <!-- Price shown in green once calculated, dash while pending -->
            <span class="dr-val accent">
              {{ rental.totalPrice != null ? rental.totalPrice + ' DZD' : 'To be calculated' }}
            </span>
          </div>
        </div>

      </div>

      <!-- Status timeline: shows current stage of the contract -->
      <div class="timeline">
        <p class="timeline-title">Contract Progress</p>
        <div class="timeline-steps">
          <div :class="['tstep', 'active']">
            <div class="tstep-dot"></div>
            <p class="tstep-label">Submitted</p>
          </div>
          <div class="tstep-line"></div>
          <div :class="['tstep', rental.contract?.approved ? 'active' : '']">
            <div class="tstep-dot"></div>
            <p class="tstep-label">Approved</p>
          </div>
          <div class="tstep-line"></div>
          <div :class="['tstep', rental.status === 'ACTIVE' ? 'active' : '']">
            <div class="tstep-dot"></div>
            <p class="tstep-label">Active</p>
          </div>
          <div class="tstep-line"></div>
          <div :class="['tstep', rental.status === 'COMPLETED' ? 'active' : '']">
            <div class="tstep-dot"></div>
            <p class="tstep-label">Completed</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ContractDetailView',

  data() {
    return {
      rental: null,   // Full rental object including nested contract and vehicle
      loading: false,
      error: ''
    }
  },

  computed: {
    // Calculates number of days between contract start and end dates
    durationDays() {
      if (!this.rental?.contract?.startDate || !this.rental?.contract?.endDate) return '-'
      const start = new Date(this.rental.contract.startDate)
      const end   = new Date(this.rental.contract.endDate)
      const diff  = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : '-'
    }
  },

  mounted() { this.fetchRental() },

  methods: {
    auth() {
      return { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    },

    statusClass(status) {
      if (status === 'ACTIVE')    return 'badge-green'
      if (status === 'PENDING')   return 'badge-yellow'
      if (status === 'COMPLETED') return 'badge-gray'
      return 'badge-red'
    },

    // Fetches a specific rental by ID from the URL
    async fetchRental() {
      this.loading = true
      try {
        const id = this.$route.params.id
        const res = await axios.get(`http://localhost:8080/api/rentals/${id}`, this.auth())
        this.rental = res.data
      } catch {
        this.error = 'Contract not found.'
      } finally {
        this.loading = false
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

.contract-layout { display: flex; flex-direction: column; gap: 24px; }

/* Header */
.contract-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 28px;
}

.contract-id { color: #3b82f6; font-size: 12px; letter-spacing: 2px; }

.contract-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #e2e8f0;
  margin-top: 4px;
}

.badges { display: flex; gap: 8px; align-items: center; }

.status-badge, .type-badge {
  padding: 4px 12px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 1px;
}
.badge-green  { background: #052e16; color: #22c55e; border: 1px solid #166534; }
.badge-yellow { background: #1c1500; color: #eab308; border: 1px solid #854d0e; }
.badge-gray   { background: #1a1e2a; color: #64748b; border: 1px solid #2a3548; }
.badge-red    { background: #1f0707; color: #ef4444; border: 1px solid #7f1d1d; }
.type-badge   { background: #1a0c3a; color: #a78bfa; border: 1px solid #3b1f7f; }

/* Details grid: 3 cards side by side */
.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.detail-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-label { color: #475569; font-size: 11px; letter-spacing: 2px; }

/* Each row inside a card: key on left, value on right */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1a1e2a;
  padding-bottom: 10px;
}
.detail-row:last-child { border-bottom: none; padding-bottom: 0; }

.dr-key  { color: #475569; font-size: 12px; }
.dr-val  { color: #94a3b8; font-size: 13px; }
.accent  { color: #3b82f6; font-weight: 500; }
.val-green  { color: #22c55e; font-size: 13px; }
.val-yellow { color: #eab308; font-size: 13px; }

/* Progress timeline */
.timeline {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
}

.timeline-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 20px;
}

.timeline-steps {
  display: flex;
  align-items: center;
}

.tstep { display: flex; flex-direction: column; align-items: center; gap: 8px; }

/* Dot: gray by default, blue when step is active */
.tstep-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2a3548;
  border: 2px solid #2a3548;
  transition: all 0.2s;
}
.tstep.active .tstep-dot {
  background: #3b82f6;
  border-color: #3b82f6;
}

.tstep-label { color: #475569; font-size: 11px; letter-spacing: 1px; white-space: nowrap; }
.tstep.active .tstep-label { color: #3b82f6; }

/* Horizontal line connecting steps */
.tstep-line {
  flex: 1;
  height: 2px;
  background: #1e2535;
  margin-bottom: 20px;
}

.msg-error   { color: #ef4444; font-size: 13px; }
.status-text { color: #475569; font-size: 13px; }
</style>
