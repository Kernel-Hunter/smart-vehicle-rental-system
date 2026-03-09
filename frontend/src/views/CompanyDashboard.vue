<template>
  <div class="company-dash" style="max-width:1200px; margin:0 auto; padding:28px 32px;">

    <!-- Header -->
    <div class="dash-header reveal">
      <div class="d-flex align-center gap-3">
        <v-avatar color="secondary" size="52">
          <span class="text-h6 font-weight-bold text-white">{{ company?.logo }}</span>
        </v-avatar>
        <div>
          <h2 class="dash-title">{{ company?.companyName }}</h2>
          <p class="dash-sub">{{ company?.city }} · {{ company?.description }}</p>
        </div>
      </div>
      <v-chip color="secondary" variant="tonal" prepend-icon="mdi-domain">Company Account</v-chip>
    </div>

    <!-- KPI cards with animated counters -->
    <v-row class="mt-6">
      <v-col v-for="(kpi, i) in kpis" :key="kpi.label" cols="6" md="3">
        <div :class="['kpi-card hover-lift reveal', `reveal-delay-${i+1}`]">
          <div class="kpi-icon-wrap" :style="`background: rgba(var(--v-theme-${kpi.color}-rgb, 92,107,192), 0.1)`">
            <v-icon :color="kpi.color" size="22">{{ kpi.icon }}</v-icon>
          </div>
          <div class="kpi-value" :style="`color: rgb(var(--v-theme-${kpi.color}))`">
            {{ kpi.animated }}<span class="kpi-suffix">{{ kpi.suffix }}</span>
          </div>
          <div class="kpi-label">{{ kpi.label }}</div>
        </div>
      </v-col>
    </v-row>

    <!-- Quick actions -->
    <v-row class="mt-6">
      <v-col cols="12" md="4">
        <v-card
          class="quick-action hover-lift reveal reveal-delay-1"
          rounded="xl"
          elevation="0"
          to="/company/vehicles"
        >
          <v-card-text class="pa-6">
            <v-icon color="secondary" size="32" class="mb-3">mdi-car-multiple</v-icon>
            <h3 class="qa-title">Manage Fleet</h3>
            <p class="qa-desc">Add, edit or remove vehicles from your fleet.</p>
            <v-btn variant="tonal" color="secondary" size="small" rounded="lg" class="mt-3">Go to Fleet →</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card
          class="quick-action hover-lift reveal reveal-delay-2"
          rounded="xl"
          elevation="0"
          to="/company/rentals"
        >
          <v-card-text class="pa-6">
            <v-icon color="primary" size="32" class="mb-3">mdi-clipboard-list</v-icon>
            <h3 class="qa-title">View Rentals</h3>
            <p class="qa-desc">See all rentals for your vehicles and approve contracts.</p>
            <v-btn variant="tonal" color="primary" size="small" rounded="lg" class="mt-3">Go to Rentals →</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <div class="earnings-card hover-lift reveal reveal-delay-3">
          <div class="earnings-label">Total Earnings</div>
          <div class="earnings-amount">{{ animatedEarnings }} <span class="earnings-currency">TND</span></div>
          <v-progress-linear
            :model-value="earningsPercent"
            color="secondary"
            rounded
            height="6"
            bg-color="rgba(126,87,194,0.15)"
            class="mt-3"
          />
          <div class="earnings-sub">{{ completedRentals }} completed rentals</div>
        </div>
      </v-col>
    </v-row>

    <!-- Fleet status breakdown -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1" class="reveal reveal-delay-1">
          <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">Fleet Status</v-card-title>
          <v-card-text class="px-5 pb-5">
            <div v-for="item in fleetBreakdown" :key="item.label" class="mb-4">
              <div class="d-flex justify-space-between text-body-2 mb-1">
                <span>{{ item.label }}</span>
                <span class="font-weight-bold">{{ item.count }} vehicles</span>
              </div>
              <v-progress-linear
                :model-value="myVehicles.length ? (item.count / myVehicles.length) * 100 : 0"
                :color="item.color"
                rounded
                height="8"
                bg-color="surface-variant"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1" class="reveal reveal-delay-2">
          <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">Recent Rentals</v-card-title>
          <v-list density="compact" class="px-2 pb-3">
            <v-list-item
              v-for="r in recentRentals"
              :key="r.id"
              :subtitle="vehicleName(r.vehicleId) + ' · ' + formatDate(r.startTime)"
              rounded="lg"
              class="mb-1"
            >
              <template v-slot:title>
                <span class="text-body-2 font-weight-medium">Rental #{{ r.id }}</span>
              </template>
              <template v-slot:append>
                <v-chip :color="statusColor(r.status)" variant="tonal" size="x-small">{{ r.status }}</v-chip>
              </template>
            </v-list-item>
            <v-list-item v-if="recentRentals.length === 0">
              <template v-slot:title>
                <span class="text-caption text-medium-emphasis">No rentals yet</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import { getCurrentUser, getVehiclesByCompany, getRentalsByCompany, getVehicleById } from '../store/data.js'
import { useReveal } from '../composables/useReveal.js'

export default {
  name: 'CompanyDashboard',
  setup() { return useReveal() },
  data() {
    const company    = getCurrentUser()
    const vehicles   = getVehiclesByCompany(company.id)
    const rentals    = getRentalsByCompany(company.id)
    const completed  = rentals.filter(r => r.status === 'COMPLETED')
    const earnings   = completed.reduce((s, r) => s + (r.totalPrice || 0), 0)
    return {
      company,
      myVehicles:  vehicles,
      myRentals:   rentals,
      animatedEarnings: 0,
      kpis: [
        { icon: 'mdi-car-multiple',  color: 'secondary', label: 'My Vehicles',  raw: vehicles.length,                                          animated: 0, suffix: '' },
        { icon: 'mdi-clipboard-list',color: 'primary',   label: 'Total Rentals',raw: rentals.length,                                           animated: 0, suffix: '' },
        { icon: 'mdi-clock-check',   color: 'success',   label: 'Completed',    raw: completed.length,                                         animated: 0, suffix: '' },
        { icon: 'mdi-clock-alert',   color: 'warning',   label: 'Pending',      raw: rentals.filter(r => r.status === 'PENDING').length,       animated: 0, suffix: '' },
      ],
      earningsTarget: earnings,
    }
  },

  computed: {
    completedRentals() { return this.myRentals.filter(r => r.status === 'COMPLETED').length },
    earningsPercent()  { return this.earningsTarget > 0 ? Math.min((this.earningsTarget / 50000) * 100, 100) : 0 },
    fleetBreakdown() {
      return [
        { label: 'Available',   count: this.myVehicles.filter(v => v.status === 'AVAILABLE').length,   color: 'success'   },
        { label: 'Rented',      count: this.myVehicles.filter(v => v.status === 'RENTED').length,      color: 'primary'   },
        { label: 'Maintenance', count: this.myVehicles.filter(v => v.status === 'MAINTENANCE').length, color: 'warning'   },
      ]
    },
    recentRentals() {
      return [...this.myRentals].sort((a, b) => b.id - a.id).slice(0, 5)
    }
  },

  mounted() {
    this.setupReveal()
    this.animateAll()
  },

  methods: {
    animateAll() {
      // Animate KPI counters
      this.kpis.forEach((kpi, i) => {
        const steps = 50
        const step  = kpi.raw / steps
        let cur = 0
        setTimeout(() => {
          const t = setInterval(() => {
            cur = Math.min(cur + step, kpi.raw)
            this.kpis[i].animated = Math.floor(cur)
            if (cur >= kpi.raw) clearInterval(t)
          }, 1200 / steps)
        }, 200 + i * 100)
      })
      // Animate earnings
      const steps = 60
      const step  = this.earningsTarget / steps
      let cur = 0
      setTimeout(() => {
        const t = setInterval(() => {
          cur = Math.min(cur + step, this.earningsTarget)
          this.animatedEarnings = Math.floor(cur).toLocaleString()
          if (cur >= this.earningsTarget) clearInterval(t)
        }, 1500 / steps)
      }, 400)
    },

    vehicleName(vid) {
      const v = getVehicleById(vid)
      return v ? `${v.brand} ${v.model}` : '—'
    },

    formatDate(dt) {
      if (!dt) return '—'
      return new Date(dt).toLocaleDateString()
    },

    statusColor(s) {
      if (s === 'ACTIVE')    return 'success'
      if (s === 'PENDING')   return 'warning'
      if (s === 'COMPLETED') return 'primary'
      return 'error'
    }
  }
}
</script>

<style scoped>
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
}

.dash-title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}
.dash-sub { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); margin-top: 2px; }

/* KPI Cards */
.kpi-card {
  background: rgb(var(--v-theme-surface));
  border: 1.5px solid #b8c4d4;
  border-radius: 18px;
  padding: 20px;
}
.v-theme--dark .kpi-card { border-color: rgba(255,255,255,0.08); }

.kpi-icon-wrap {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.kpi-value {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}
.kpi-suffix { font-size: 18px; }
.kpi-label  { font-size: 12px; color: rgb(var(--v-theme-on-surface-variant)); font-weight: 500; }

/* Quick actions */
.quick-action {
  border: 1.5px solid #b8c4d4 !important;
  height: 100%;
  text-decoration: none;
}
.v-theme--dark .quick-action { border-color: rgba(255,255,255,0.08) !important; }
.qa-title { font-family: 'Cabinet Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: rgb(var(--v-theme-on-surface)); margin-bottom: 6px; }
.qa-desc  { font-size: 13px; line-height: 1.6; color: rgb(var(--v-theme-on-surface-variant)); }

/* Earnings card — always white text since it has gradient bg */
.earnings-card {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  border-radius: 18px;
  padding: 24px;
  height: 100%;
  color: #FFFFFF;
}

.earnings-label   { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); margin-bottom: 8px; }
.earnings-amount  { font-family: 'Cabinet Grotesk', sans-serif; font-size: 32px; font-weight: 800; line-height: 1; color: #FFFFFF; }
.earnings-currency{ font-size: 16px; color: rgba(255,255,255,0.7); }
.earnings-sub     { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 8px; }
</style>
