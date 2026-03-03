<template>
  <div>
    <router-link to="/rentals" class="back-link">← Back to My Rentals</router-link>

    <p v-if="loading" class="status-text">Loading receipt...</p>
    <p v-if="error" class="msg-error">{{ error }}</p>

    <div v-if="rental && rental.status === 'COMPLETED'" class="receipt-wrapper">

      <!-- Receipt card -->
      <div class="receipt-card">

        <!-- Receipt header -->
        <div class="receipt-header">
          <div>
            <p class="receipt-tag">◈ RENTAL RECEIPT</p>
            <h2 class="receipt-title">Payment Summary</h2>
          </div>
          <!-- Completed badge -->
          <span class="badge-completed">✓ COMPLETED</span>
        </div>

        <div class="receipt-divider"></div>

        <!-- Vehicle info -->
        <div class="receipt-section">
          <p class="section-label">VEHICLE</p>
          <div class="receipt-row">
            <span class="rr-key">Name</span>
            <span class="rr-val">{{ rental.vehicle?.brand }} {{ rental.vehicle?.model }}</span>
          </div>
          <div class="receipt-row">
            <span class="rr-key">Type</span>
            <span class="rr-val">{{ rental.vehicle?.type }}</span>
          </div>
          <div class="receipt-row">
            <span class="rr-key">Location</span>
            <span class="rr-val">{{ rental.vehicle?.location || '—' }}</span>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <!-- Rental duration info -->
        <div class="receipt-section">
          <p class="section-label">RENTAL PERIOD</p>
          <div class="receipt-row">
            <span class="rr-key">Type</span>
            <span :class="['type-tag', rental.rentalType === 'INSTANT' ? 'type-instant' : 'type-contract']">
              {{ rental.rentalType }}
            </span>
          </div>
          <div class="receipt-row">
            <span class="rr-key">Start</span>
            <span class="rr-val">{{ rental.startTime || '—' }}</span>
          </div>
          <div class="receipt-row">
            <span class="rr-key">End</span>
            <span class="rr-val">{{ rental.endTime || '—' }}</span>
          </div>
          <!-- Show duration in minutes for instant, days for contract -->
          <div class="receipt-row" v-if="rental.rentalType === 'INSTANT'">
            <span class="rr-key">Duration</span>
            <span class="rr-val">{{ durationMinutes }} minute(s)</span>
          </div>
          <div class="receipt-row" v-else>
            <span class="rr-key">Duration</span>
            <span class="rr-val">{{ durationDays }} day(s)</span>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <!-- Price breakdown -->
        <div class="receipt-section">
          <p class="section-label">PRICE BREAKDOWN</p>
          <div class="receipt-row" v-if="rental.rentalType === 'INSTANT'">
            <span class="rr-key">Rate</span>
            <span class="rr-val">{{ rental.vehicle?.pricePerMinute }} DZD / min</span>
          </div>
          <div class="receipt-row" v-else>
            <span class="rr-key">Rate</span>
            <span class="rr-val">{{ rental.vehicle?.pricePerDay }} DZD / day</span>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <!-- Total amount (highlighted) -->
        <div class="receipt-total">
          <span class="total-label">TOTAL AMOUNT</span>
          <span class="total-value">{{ rental.totalPrice }} DZD</span>
        </div>

        <!-- Print button -->
        <button class="btn-print" @click="printReceipt">🖨 Print Receipt</button>

      </div>
    </div>

    <!-- If rental is not completed yet: show message -->
    <div v-else-if="rental && rental.status !== 'COMPLETED'" class="not-completed">
      <p class="nc-icon">⏳</p>
      <p class="nc-title">Receipt Not Available</p>
      <p class="nc-desc">
        This rental is currently <strong>{{ rental.status }}</strong>.
        A receipt is only available for completed rentals.
      </p>
      <router-link to="/rentals" class="btn-primary">Back to Rentals</router-link>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RentalReceiptView',

  data() {
    return {
      rental: null,   // Full rental object including vehicle info
      loading: false,
      error: ''
    }
  },

  computed: {
    // Duration in minutes for instant rentals
    durationMinutes() {
      if (!this.rental?.startTime || !this.rental?.endTime) return '—'
      const start = new Date(this.rental.startTime)
      const end   = new Date(this.rental.endTime)
      return Math.ceil((end - start) / (1000 * 60))
    },

    // Duration in days for contract rentals
    durationDays() {
      if (!this.rental?.contract?.startDate || !this.rental?.contract?.endDate) return '—'
      const start = new Date(this.rental.contract.startDate)
      const end   = new Date(this.rental.contract.endDate)
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    }
  },

  mounted() { this.fetchRental() },

  methods: {
    auth() {
      return { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    },

    // Fetches rental by ID from URL params
    async fetchRental() {
      this.loading = true
      try {
        const id = this.$route.params.id
        const res = await axios.get(`http://localhost:8080/api/rentals/${id}`, this.auth())
        this.rental = res.data
      } catch {
        this.error = 'Receipt not found.'
      } finally {
        this.loading = false
      }
    },

    // Triggers the browser's native print dialog
    printReceipt() {
      window.print()
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

/* Center the receipt card */
.receipt-wrapper {
  display: flex;
  justify-content: center;
}

.receipt-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.receipt-tag { color: #3b82f6; font-size: 11px; letter-spacing: 3px; margin-bottom: 6px; }

.receipt-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}

.badge-completed {
  background: #052e16;
  color: #22c55e;
  border: 1px solid #166534;
  padding: 4px 12px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 1px;
}

/* Dashed divider between sections */
.receipt-divider {
  height: 1px;
  border-top: 1px dashed #1e2535;
}

.receipt-section { display: flex; flex-direction: column; gap: 12px; }

.section-label { color: #475569; font-size: 11px; letter-spacing: 2px; }

/* Each key-value row */
.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rr-key { color: #475569; font-size: 13px; }
.rr-val { color: #94a3b8; font-size: 13px; }

.type-tag { padding: 2px 8px; border-radius: 3px; font-size: 11px; letter-spacing: 1px; }
.type-instant  { background: #0c1a3a; color: #60a5fa; border: 1px solid #1e3a5f; }
.type-contract { background: #1a0c3a; color: #a78bfa; border: 1px solid #3b1f7f; }

/* Total row: highlighted in blue */
.receipt-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0f1a2e;
  border: 1px solid #1e3a5f;
  border-radius: 6px;
  padding: 18px 20px;
}

.total-label { color: #94a3b8; font-size: 13px; letter-spacing: 1px; }

.total-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
}

.btn-print {
  background: transparent;
  border: 1px solid #1e2535;
  color: #64748b;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  transition: all 0.2s;
  text-align: center;
}
.btn-print:hover { border-color: #3b82f6; color: #3b82f6; }

/* Not completed state */
.not-completed {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.nc-icon  { font-size: 40px; }
.nc-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #e2e8f0;
}
.nc-desc  { color: #475569; font-size: 13px; line-height: 1.7; }

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 11px 28px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  margin-top: 8px;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-primary:hover { background: #2563eb; }

.msg-error   { color: #ef4444; font-size: 13px; }
.status-text { color: #475569; font-size: 13px; }
</style>
