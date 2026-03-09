<template>
  <div style="max-width:1280px; margin:0 auto; padding:28px 32px;">

    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 reveal">
      <div>
        <h2 class="page-title">Vehicle Fleet</h2>
        <p class="page-sub">{{ filteredVehicles.length }} vehicles available to rent</p>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <v-chip
          v-for="f in filters"
          :key="f.value"
          :color="activeFilter === f.value ? 'primary' : undefined"
          :variant="activeFilter === f.value ? 'tonal' : 'outlined'"
          size="small"
          @click="activeFilter = f.value"
          class="cursor-pointer"
        >{{ f.label }}</v-chip>
      </div>
    </div>

    <!-- Skeleton loading -->
    <v-row v-if="loading">
      <v-col v-for="i in 8" :key="i" cols="12" sm="6" md="4" lg="3">
        <v-card rounded="xl" elevation="1" class="skeleton">
          <v-card-text class="pa-5">
            <div style="height:18px; background:rgba(92,107,192,0.1); border-radius:8px; margin-bottom:12px; width:70%;" />
            <div style="height:12px; background:rgba(92,107,192,0.07); border-radius:6px; margin-bottom:8px;" />
            <div style="height:12px; background:rgba(92,107,192,0.07); border-radius:6px; width:50%;" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Vehicle grid -->
    <v-row v-else>
      <v-col
        v-for="(v, i) in filteredVehicles"
        :key="v.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card :class="`hover-lift reveal reveal-delay-${(i % 4) + 1} fade-up-${(i % 4) + 1}`" rounded="xl" elevation="1" height="100%" class="d-flex flex-column">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar :color="v.color" size="36">
                <v-icon size="18" color="white">mdi-car</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-chip :color="statusColor(v.status)" variant="tonal" size="x-small">{{ v.status }}</v-chip>
            </template>
            <v-card-subtitle class="text-caption">{{ v.type }}</v-card-subtitle>
            <v-card-title class="text-body-1 font-weight-bold">{{ v.brand }} {{ v.model }}</v-card-title>
          </v-card-item>

          <v-card-text class="flex-grow-1 pt-0">
            <v-row dense class="mb-2">
              <v-col cols="6">
                <div class="price-label">Per Minute</div>
                <div class="price-val" style="color: rgb(var(--v-theme-warning))">{{ v.pricePerMinute }} TND</div>
              </v-col>
              <v-col cols="6">
                <div class="price-label">Per Day</div>
                <div class="price-val" style="color: rgb(var(--v-theme-primary))">{{ v.pricePerDay }} TND</div>
              </v-col>
            </v-row>
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <v-icon size="12" class="mr-1">mdi-map-marker</v-icon> {{ v.city }}
            </div>
            <!-- Company badge -->
            <div class="company-mini mt-2">
              <v-avatar :color="v.color" size="18">
                <span style="font-size:8px; font-weight:700; color:white;">{{ getCompanyLogo(v.companyId) }}</span>
              </v-avatar>
              <span class="text-caption text-medium-emphasis ml-1">{{ getCompanyName(v.companyId) }}</span>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-3 flex-column gap-1">
            <v-btn variant="outlined" color="primary" block rounded="lg" size="small" :to="`/vehicles/${v.id}`" prepend-icon="mdi-eye">
              View Details
            </v-btn>
            <template v-if="v.status === 'AVAILABLE' && currentUser?.role === 'CUSTOMER'">
              <v-btn color="warning" block rounded="lg" size="small" prepend-icon="mdi-lightning-bolt" @click="startInstant(v)" elevation="0">
                Instant
              </v-btn>
              <v-btn color="primary" variant="tonal" block rounded="lg" size="small" prepend-icon="mdi-file-sign" @click="openContract(v)">
                Contract
              </v-btn>
            </template>
            <template v-else-if="!currentUser">
              <v-btn color="primary" variant="tonal" block rounded="lg" size="small" to="/login">Login to Rent</v-btn>
            </template>
            <template v-else-if="v.status !== 'AVAILABLE'">
              <v-btn disabled block rounded="lg" size="small">Unavailable</v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Contract dialog -->
    <v-dialog v-model="contractDialog" max-width="460" rounded="xl">
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-2">Contract Request — {{ selectedVehicle?.brand }} {{ selectedVehicle?.model }}</v-card-title>
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="6"><v-text-field v-model="form.startDate" label="Start Date" type="date" variant="outlined" density="comfortable" rounded="lg" /></v-col>
            <v-col cols="6"><v-text-field v-model="form.endDate" label="End Date" type="date" variant="outlined" density="comfortable" rounded="lg" /></v-col>
            <v-col cols="12"><v-text-field v-model="form.location" label="Delivery Location" prepend-inner-icon="mdi-map-marker" variant="outlined" density="comfortable" rounded="lg" /></v-col>
          </v-row>
          <v-alert v-if="contractDays" color="primary" variant="tonal" density="compact" rounded="lg">
            Estimated: <strong>{{ (contractDays * selectedVehicle?.pricePerDay).toFixed(2) }} TND</strong> ({{ contractDays }} days)
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="contractDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" rounded="lg" @click="submitContract">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" rounded="lg">{{ snackbar.text }}</v-snackbar>
  </div>
</template>

<script>
import { getVehicles, getCompanyById, startInstantRental, submitContractRental, getCurrentUser } from '../store/data.js'
import { useReveal } from '../composables/useReveal.js'

export default {
  name: 'VehiclesView',
  setup() { return useReveal() },
  data() {
    return {
      vehicles: [], loading: true, currentUser: getCurrentUser(),
      activeFilter: 'ALL', contractDialog: false, selectedVehicle: null,
      form: { startDate: '', endDate: '', location: '' },
      snackbar: { show: false, text: '', color: 'success' },
      filters: [
        { label: 'All', value: 'ALL' }, { label: 'Available', value: 'AVAILABLE' },
        { label: 'Rented', value: 'RENTED' }, { label: 'Maintenance', value: 'MAINTENANCE' }
      ]
    }
  },
  computed: {
    filteredVehicles() {
      if (this.activeFilter === 'ALL') return this.vehicles
      return this.vehicles.filter(v => v.status === this.activeFilter)
    },
    contractDays() {
      if (!this.form.startDate || !this.form.endDate) return 0
      return Math.max(0, Math.ceil((new Date(this.form.endDate) - new Date(this.form.startDate)) / 86400000))
    }
  },
  mounted() {
    setTimeout(() => {
      this.vehicles = getVehicles()
      this.loading  = false
      this.$nextTick(() => this.setupReveal())
    }, 500)
  },
  methods: {
    statusColor(s) { return s === 'AVAILABLE' ? 'success' : s === 'RENTED' ? 'primary' : 'warning' },
    getCompanyLogo(cid) { return getCompanyById(cid)?.logo || '?' },
    getCompanyName(cid) { return getCompanyById(cid)?.companyName || '—' },
    startInstant(v) {
      const r = startInstantRental(v.id, this.currentUser.id)
      if (!r) { this.snackbar = { show: true, text: 'Vehicle no longer available.', color: 'error' }; return }
      this.vehicles = getVehicles()
      this.snackbar = { show: true, text: 'Instant rental started!', color: 'success' }
    },
    openContract(v) { this.selectedVehicle = v; this.form = { startDate: '', endDate: '', location: '' }; this.contractDialog = true },
    submitContract() {
      if (!this.form.startDate || !this.form.endDate) { this.snackbar = { show: true, text: 'Fill in both dates.', color: 'error' }; return }
      submitContractRental(this.selectedVehicle.id, this.currentUser.id, this.form.startDate, this.form.endDate, this.form.location)
      this.contractDialog = false
      this.snackbar = { show: true, text: 'Contract request submitted!', color: 'success' }
    }
  }
}
</script>

<style scoped>
.page-title  { font-family: 'Cabinet Grotesk', sans-serif; font-size: 24px; font-weight: 700; }
.page-sub    { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); margin-top: 2px; }
.price-label { font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); margin-bottom: 2px; }
.price-val   { font-size: 15px; font-weight: 700; }
.company-mini { display: flex; align-items: center; }
</style>
