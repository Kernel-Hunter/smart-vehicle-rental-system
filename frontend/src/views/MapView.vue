<template>
  <div class="map-page">

    <!-- ── Header ── -->
    <div class="map-header reveal">
      <div>
        <h2 class="map-title">
          <v-icon color="primary" class="mr-2">mdi-map-marker-radius</v-icon>
          Vehicle Map
        </h2>
        <p class="map-sub">{{ availableVehicles.length }} vehicles available near you</p>
      </div>

      <!-- City filter -->
      <div class="city-filters">
        <v-chip
          v-for="city in cities"
          :key="city"
          :color="selectedCity === city ? 'primary' : undefined"
          :variant="selectedCity === city ? 'tonal' : 'outlined'"
          @click="selectedCity = city"
          class="cursor-pointer"
          size="small"
        >
          {{ city }}
        </v-chip>
      </div>
    </div>

    <!-- ── Map + Sidebar layout ── -->
    <div class="map-layout">

      <!-- LEFT: Interactive map -->
      <div class="map-container reveal">

        <!-- Map legend -->
        <div class="map-legend">
          <div class="legend-item">
            <div class="legend-dot dot-available" />
            <span>Available</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot dot-rented" />
            <span>Rented</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot dot-maintenance" />
            <span>Maintenance</span>
          </div>
        </div>

        <!-- City label -->
        <div class="city-label">{{ selectedCity }}</div>

        <!-- SVG map background (fake city grid) -->
        <svg class="map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <!-- City blocks -->
          <rect x="5"  y="5"  width="25" height="18" rx="1" class="city-block" />
          <rect x="35" y="5"  width="30" height="12" rx="1" class="city-block" />
          <rect x="70" y="5"  width="25" height="18" rx="1" class="city-block" />
          <rect x="5"  y="30" width="18" height="25" rx="1" class="city-block" />
          <rect x="28" y="28" width="20" height="15" rx="1" class="city-block" />
          <rect x="53" y="25" width="22" height="20" rx="1" class="city-block" />
          <rect x="80" y="28" width="15" height="22" rx="1" class="city-block" />
          <rect x="5"  y="62" width="30" height="20" rx="1" class="city-block" />
          <rect x="40" y="55" width="25" height="25" rx="1" class="city-block" />
          <rect x="70" y="60" width="25" height="18" rx="1" class="city-block" />
          <rect x="15" y="88" width="70" height="8"  rx="1" class="city-block" />

          <!-- Roads -->
          <line x1="0" y1="25" x2="100" y2="25" class="road road-h" />
          <line x1="0" y1="52" x2="100" y2="52" class="road road-h" />
          <line x1="0" y1="82" x2="100" y2="82" class="road road-h" />
          <line x1="25" y1="0" x2="25" y2="100" class="road road-v" />
          <line x1="52" y1="0" x2="52" y2="100" class="road road-v" />
          <line x1="78" y1="0" x2="78" y2="100" class="road road-v" />

          <!-- Park area -->
          <rect x="30" y="55" width="8" height="8" rx="2" class="park-block" />
        </svg>

        <!-- Vehicle markers (overlaid on SVG) -->
        <div
          v-for="v in filteredMapVehicles"
          :key="v.id"
          class="vehicle-marker"
          :class="{
            'marker-available':   v.status === 'AVAILABLE',
            'marker-rented':      v.status === 'RENTED',
            'marker-maintenance': v.status === 'MAINTENANCE',
            'marker-selected':    selectedVehicle?.id === v.id
          }"
          :style="{ left: v.mapX + '%', top: v.mapY + '%' }"
          @click="selectVehicle(v)"
        >
          <div class="marker-icon">
            <v-icon size="14">mdi-car</v-icon>
          </div>
          <div class="marker-ring" v-if="v.status === 'AVAILABLE'" />

          <!-- Tooltip on hover -->
          <div class="marker-tooltip">
            <strong>{{ v.brand }} {{ v.model }}</strong>
            <span>{{ v.pricePerMinute }} TND/min</span>
          </div>
        </div>

        <!-- "You are here" marker -->
        <div class="you-marker" style="left: 50%; top: 50%">
          <v-icon size="20" color="primary">mdi-account-circle</v-icon>
          <div class="you-label">You</div>
        </div>

      </div>

      <!-- RIGHT: Vehicle list / detail panel -->
      <div class="map-sidebar">

        <!-- If a vehicle is selected: show detail -->
        <template v-if="selectedVehicle">
          <div class="sidebar-detail">
            <div class="detail-header">
              <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="selectedVehicle = null" />
              <span class="detail-back-label">Back to list</span>
            </div>

            <v-chip
              :color="statusColor(selectedVehicle.status)"
              variant="tonal"
              size="small"
              class="mb-3"
            >
              {{ selectedVehicle.status }}
            </v-chip>

            <h3 class="vehicle-detail-name">
              {{ selectedVehicle.brand }} {{ selectedVehicle.model }}
            </h3>

            <div class="vehicle-detail-meta">
              <div class="meta-row">
                <v-icon size="15" class="mr-1">mdi-car-info</v-icon>
                {{ selectedVehicle.type }}
              </div>
              <div class="meta-row">
                <v-icon size="15" class="mr-1">mdi-map-marker</v-icon>
                {{ selectedVehicle.city }}
              </div>
            </div>

            <div class="pricing-row">
              <div class="price-box">
                <span class="price-amount">{{ selectedVehicle.pricePerMinute }}</span>
                <span class="price-unit">TND/min</span>
              </div>
              <div class="price-divider" />
              <div class="price-box">
                <span class="price-amount">{{ selectedVehicle.pricePerDay }}</span>
                <span class="price-unit">TND/day</span>
              </div>
            </div>

            <!-- Company info -->
            <div class="company-badge">
              <v-avatar :color="selectedVehicle.color" size="28">
                <span class="text-caption text-white font-weight-bold">{{ companyLogo }}</span>
              </v-avatar>
              <span class="company-name-text">{{ companyName }}</span>
            </div>

            <!-- Actions -->
            <div class="detail-actions" v-if="selectedVehicle.status === 'AVAILABLE'">
              <template v-if="!currentUser">
                <v-btn color="primary" block rounded="xl" to="/login" elevation="0">
                  Login to Rent
                </v-btn>
              </template>
              <template v-else-if="currentUser.role === 'CUSTOMER'">
                <v-btn
                  color="warning"
                  block
                  rounded="xl"
                  prepend-icon="mdi-lightning-bolt"
                  @click="startInstant"
                  elevation="0"
                  class="mb-2"
                >
                  Instant Rental
                </v-btn>
                <v-btn
                  color="primary"
                  variant="tonal"
                  block
                  rounded="xl"
                  prepend-icon="mdi-file-sign"
                  @click="contractDialog = true"
                >
                  Request Contract
                </v-btn>
              </template>
              <template v-else>
                <v-alert type="info" variant="tonal" density="compact" rounded="lg">
                  Switch to a customer account to rent.
                </v-alert>
              </template>
            </div>
            <v-alert v-else type="warning" variant="tonal" density="compact" rounded="lg" class="mt-3">
              This vehicle is not currently available.
            </v-alert>
          </div>
        </template>

        <!-- Vehicle list -->
        <template v-else>
          <div class="sidebar-list">
            <p class="sidebar-title">Nearby Vehicles</p>
            <div
              v-for="v in filteredMapVehicles"
              :key="v.id"
              class="sidebar-vehicle-card hover-lift"
              @click="selectVehicle(v)"
            >
              <div class="svc-left">
                <v-avatar :color="v.color" size="36">
                  <v-icon size="18" color="white">mdi-car</v-icon>
                </v-avatar>
                <div>
                  <div class="svc-name">{{ v.brand }} {{ v.model }}</div>
                  <div class="svc-type">{{ v.type }}</div>
                </div>
              </div>
              <div class="svc-right">
                <v-chip :color="statusColor(v.status)" variant="tonal" size="x-small">
                  {{ v.status }}
                </v-chip>
                <div class="svc-price">{{ v.pricePerMinute }} TND/min</div>
              </div>
            </div>
            <p v-if="filteredMapVehicles.length === 0" class="no-vehicles">
              No vehicles in {{ selectedCity }}
            </p>
          </div>
        </template>
      </div>
    </div>

    <!-- Contract dialog -->
    <v-dialog v-model="contractDialog" max-width="460" rounded="xl">
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-2">
          <v-icon color="primary" class="mr-2">mdi-file-sign</v-icon>
          Contract Request
        </v-card-title>
        <v-card-subtitle class="px-6">
          {{ selectedVehicle?.brand }} {{ selectedVehicle?.model }}
        </v-card-subtitle>
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="6">
              <v-text-field v-model="contractForm.startDate" label="Start Date" type="date" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="contractForm.endDate" label="End Date" type="date" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="contractForm.deliveryLocation" label="Delivery Location" prepend-inner-icon="mdi-map-marker" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>
          <v-alert v-if="contractEstimate" color="primary" variant="tonal" density="compact" rounded="lg">
            Estimated: <strong>{{ contractEstimate }} TND</strong> ({{ contractDays }} day(s))
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="contractDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" rounded="lg" @click="submitContract">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" rounded="lg">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { getVehicles, getCompanyById, startInstantRental, submitContractRental, getCurrentUser } from '../store/data.js'
import { useReveal } from '../composables/useReveal.js'

export default {
  name: 'MapView',
  setup() { return useReveal() },
  data() {
    return {
      vehicles:        getVehicles(),
      currentUser:     getCurrentUser(),
      selectedCity:    'Tunis',
      selectedVehicle: null,
      contractDialog:  false,
      contractForm:    { startDate: '', endDate: '', deliveryLocation: '' },
      snackbar:        { show: false, text: '', color: 'success' },
      cities:          ['Tunis', 'Sousse', 'Sfax']
    }
  },

  computed: {
    filteredMapVehicles() {
      return this.vehicles.filter(v => v.city === this.selectedCity)
    },
    availableVehicles() {
      return this.vehicles.filter(v => v.status === 'AVAILABLE')
    },
    companyLogo() {
      if (!this.selectedVehicle) return ''
      return getCompanyById(this.selectedVehicle.companyId)?.logo || '?'
    },
    companyName() {
      if (!this.selectedVehicle) return ''
      return getCompanyById(this.selectedVehicle.companyId)?.companyName || 'Unknown'
    },
    contractDays() {
      if (!this.contractForm.startDate || !this.contractForm.endDate) return 0
      return Math.max(0, Math.ceil((new Date(this.contractForm.endDate) - new Date(this.contractForm.startDate)) / 86400000))
    },
    contractEstimate() {
      if (!this.contractDays || !this.selectedVehicle) return null
      return (this.contractDays * this.selectedVehicle.pricePerDay).toFixed(2)
    }
  },

  mounted() { this.setupReveal() },

  methods: {
    statusColor(s) {
      if (s === 'AVAILABLE')   return 'success'
      if (s === 'RENTED')      return 'primary'
      return 'warning'
    },
    selectVehicle(v) {
      this.selectedVehicle = v
      // On mobile, scroll the sidebar panel into view after selecting
      this.$nextTick(() => {
        const sidebar = document.querySelector('.map-sidebar')
        if (sidebar) sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    startInstant() {
      const rental = startInstantRental(this.selectedVehicle.id, this.currentUser.id)
      if (!rental) { this.snackbar = { show: true, text: 'Vehicle no longer available.', color: 'error' }; return }
      this.vehicles = getVehicles()
      const v = this.vehicles.find(v => v.id === this.selectedVehicle.id)
      this.selectedVehicle = v
      this.snackbar = { show: true, text: 'Rental started! Go to My Rentals to track it.', color: 'success' }
    },
    submitContract() {
      if (!this.contractForm.startDate || !this.contractForm.endDate) {
        this.snackbar = { show: true, text: 'Please fill in both dates.', color: 'error' }
        return
      }
      submitContractRental(this.selectedVehicle.id, this.currentUser.id, this.contractForm.startDate, this.contractForm.endDate, this.contractForm.deliveryLocation)
      this.contractDialog = false
      this.snackbar = { show: true, text: 'Contract request submitted!', color: 'success' }
      this.contractForm = { startDate: '', endDate: '', deliveryLocation: '' }
    }
  }
}
</script>

<style scoped>
.map-page {
  padding: 28px 32px;
  max-width: 1280px;
  margin: 0 auto;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.map-title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-background));
}
.map-sub { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); margin-top: 2px; }

.city-filters { display: flex; gap: 8px; }

/* ── Map layout ── */
.map-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  height: 580px;
}

/* Mobile: stack vertically, map on top, list below */
@media (max-width: 900px) {
  .map-page { padding: 16px; }
  .map-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 360px auto;
    height: auto;
  }
  .map-container { height: 360px; }
  .map-sidebar {
    height: auto;
    max-height: 420px;
    overflow-y: auto;
  }
}

/* ── Map container ── */
.map-container {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1.5px solid #b8c4d4;
}

/* Light: real slate-blue map background so everything inside is visible */
.v-theme--light .map-container { background: #e8eef6; border-color: #94a3b8; }
/* Dark: keep deep navy */
.v-theme--dark  .map-container { background: #0d1526; border-color: rgba(255,255,255,0.1); }

.map-svg { width: 100%; height: 100%; display: block; }

/* Light map: city blocks are clearly visible slate tiles */
.v-theme--light .city-block { fill: #d0daea; stroke: #94a3b8; stroke-width: 0.4; }
/* Dark map: teal-tinted blocks */
.v-theme--dark  .city-block { fill: rgba(45,212,191,0.07); stroke: rgba(45,212,191,0.18); stroke-width: 0.4; }
/* Park is green in both */
.park-block { fill: rgba(16,185,129,0.18); stroke: rgba(16,185,129,0.4); stroke-width: 0.4; }
/* Roads: clearly visible in light, subtle in dark */
.v-theme--light .road { stroke: #b0bec9; stroke-width: 1.8; }
.v-theme--dark  .road { stroke: rgba(45,212,191,0.14); stroke-width: 1.8; }

/* ── Markers ── */
@keyframes marker-drop {
  0%   { opacity: 0; transform: translate(-50%, -80%); }
  60%  { transform: translate(-50%, -45%); }
  80%  { transform: translate(-50%, -52%); }
  100% { opacity: 1; transform: translate(-50%, -50%); }
}

.vehicle-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
  animation: marker-drop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
}

.marker-icon {
  width: 30px; height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  z-index: 1;
  background: rgb(var(--v-theme-error));
}

.marker-available   .marker-icon { background: rgb(var(--v-theme-success)); }
.marker-rented      .marker-icon { background: rgb(var(--v-theme-primary)); }
.marker-maintenance .marker-icon { background: rgb(var(--v-theme-warning)); }

.vehicle-marker:hover .marker-icon,
.marker-selected .marker-icon {
  transform: scale(1.3);
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
}

.marker-ring {
  position: absolute;
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(22, 163, 74, 0.4);
  top: 0; left: 0;
  animation: ring-pulse 2s ease-out infinite;
}

@keyframes ring-pulse {
  0%   { transform: scale(1); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* Marker tooltip */
.marker-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: #F9FAFB;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 20;
}

.vehicle-marker:hover .marker-tooltip { opacity: 1; }

/* You are here marker */
.you-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.you-label {
  font-size: 10px;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-top: 2px;
  padding: 1px 5px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.v-theme--light .you-label { background: #ffffff; border: 1px solid #94a3b8; }
.v-theme--dark  .you-label { background: rgb(var(--v-theme-surface)); }

/* ── Legend ── */
.map-legend {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgb(var(--v-theme-surface));
  border: 1.5px solid #b8c4d4;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 20;
  font-size: 11px;
  color: rgb(var(--v-theme-on-surface));
}
.v-theme--dark .map-legend { border-color: rgba(255,255,255,0.08); }
.legend-item { display: flex; align-items: center; gap: 6px; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.dot-available   { background: rgb(var(--v-theme-success)); }
.dot-rented      { background: rgb(var(--v-theme-primary)); }
.dot-maintenance { background: rgb(var(--v-theme-warning)); }

.city-label {
  position: absolute;
  bottom: 14px;
  right: 14px;
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  z-index: 5;
}
.v-theme--light .city-label { color: rgba(71,85,105,0.6); }
.v-theme--dark  .city-label { color: rgba(45,212,191,0.35); }

/* ── Sidebar ── */
.map-sidebar {
  background: rgb(var(--v-theme-surface));
  border: 1.5px solid #b8c4d4;
  border-radius: 20px;
  overflow-y: auto;
  padding: 16px;
}
.v-theme--dark .map-sidebar { border-color: rgba(255,255,255,0.08); }

.sidebar-title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 12px;
  padding: 0 4px;
}

.sidebar-vehicle-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 8px;
  border: 1.5px solid #b8c4d4;
  transition: background 0.15s, transform 0.2s, box-shadow 0.2s;
}
.v-theme--dark  .sidebar-vehicle-card { border-color: rgba(255,255,255,0.06); }
.v-theme--light .sidebar-vehicle-card:hover { background: rgba(13,148,136,0.04); }
.v-theme--dark  .sidebar-vehicle-card:hover { background: rgba(45,212,191,0.06); }

.svc-left  { display: flex; align-items: center; gap: 10px; }
.svc-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }

.svc-name  { font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-on-surface)); }
.svc-type  { font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); }
.svc-price { font-size: 11px; font-weight: 600; color: rgb(var(--v-theme-primary)); }

.no-vehicles { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); text-align: center; padding: 20px; }

/* ── Sidebar detail ── */
.sidebar-detail { padding: 4px; }

.detail-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}
.detail-back-label { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); }

.vehicle-detail-name {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 12px;
}

.vehicle-detail-meta { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.meta-row { display: flex; align-items: center; font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); }

.pricing-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(13, 148, 136, 0.06);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 16px;
}
.v-theme--dark .pricing-row { background: rgba(45,212,191,0.08); }
.price-box    { display: flex; flex-direction: column; align-items: center; flex: 1; }
.price-amount { font-family: 'Cabinet Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: rgb(var(--v-theme-primary)); }
.price-unit   { font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); }
.price-divider { width: 1px; height: 36px; background: rgba(13,148,136,0.15); }

.company-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1.5px solid #b8c4d4;
  border-radius: 10px;
  margin-bottom: 16px;
}
.v-theme--dark .company-badge { border-color: rgba(255,255,255,0.07); }
.company-name-text { font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-on-surface)); }

.detail-actions { display: flex; flex-direction: column; gap: 8px; }
</style>
