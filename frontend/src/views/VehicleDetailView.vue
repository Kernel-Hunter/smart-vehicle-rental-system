<!-- VehicleDetailView.vue -->
<template>
  <div style="max-width:1100px; margin:0 auto; padding:28px 32px;">
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/vehicles" class="mb-4 reveal">Back to Fleet</v-btn>

    <div v-if="!vehicle"><v-alert type="error" variant="tonal" rounded="xl">Vehicle not found.</v-alert></div>

    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="1" class="mb-4 reveal">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar :color="vehicle.color" size="48">
                <v-icon size="24" color="white">mdi-car</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-chip :color="statusColor(vehicle.status)" variant="tonal">{{ vehicle.status }}</v-chip>
            </template>
            <v-card-subtitle>#{{ vehicle.id }} · {{ vehicle.type }} · {{ vehicle.city }}</v-card-subtitle>
            <v-card-title class="text-h4 font-weight-bold" style="font-family:'Syne',sans-serif;">{{ vehicle.brand }} {{ vehicle.model }}</v-card-title>
          </v-card-item>
          <v-card-text>
            <v-row dense>
              <v-col cols="6" md="3"><v-list-item prepend-icon="mdi-timer-outline" :subtitle="vehicle.pricePerMinute + ' TND'" title="Per Minute" density="compact" /></v-col>
              <v-col cols="6" md="3"><v-list-item prepend-icon="mdi-calendar-range" :subtitle="vehicle.pricePerDay + ' TND'" title="Per Day" density="compact" /></v-col>
              <v-col cols="6" md="3"><v-list-item prepend-icon="mdi-map-marker" :subtitle="vehicle.city" title="Location" density="compact" /></v-col>
              <v-col cols="6" md="3"><v-list-item prepend-icon="mdi-domain" :subtitle="companyName" title="Company" density="compact" /></v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Price estimator -->
        <v-card rounded="xl" elevation="1" class="reveal reveal-delay-1">
          <v-card-title class="pa-5 pb-3"><v-icon color="primary" class="mr-2">mdi-calculator</v-icon>Price Estimator</v-card-title>
          <v-card-text class="px-5 pb-5">
            <v-row>
              <v-col cols="12" md="6">
                <p class="text-caption text-medium-emphasis mb-2">Instant Rental — {{ estMinutes }} minutes</p>
                <v-slider v-model="estMinutes" :min="1" :max="480" color="warning" thumb-label hide-details class="mb-3" />
                <v-alert color="warning" variant="tonal" density="compact" rounded="lg">
                  Estimated: <strong>{{ (estMinutes * vehicle.pricePerMinute).toFixed(2) }} TND</strong>
                </v-alert>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-caption text-medium-emphasis mb-2">Contract Rental — {{ estDays }} day(s)</p>
                <v-slider v-model="estDays" :min="1" :max="30" color="primary" thumb-label hide-details class="mb-3" />
                <v-alert color="primary" variant="tonal" density="compact" rounded="lg">
                  Estimated: <strong>{{ (estDays * vehicle.pricePerDay).toFixed(2) }} TND</strong>
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Action panel -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="1" class="position-sticky reveal reveal-delay-2" style="top:80px;">
          <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">Rent This Vehicle</v-card-title>
          <v-card-text class="px-5 pb-5">
            <div v-if="!currentUser">
              <p class="text-body-2 text-medium-emphasis mb-4">Login to rent this vehicle.</p>
              <v-btn color="primary" block to="/login" rounded="xl" elevation="0">Login to Rent</v-btn>
            </div>
            <div v-else-if="vehicle.status !== 'AVAILABLE'">
              <v-alert type="warning" variant="tonal" density="compact" rounded="lg">Not available right now.</v-alert>
            </div>
            <div v-else-if="currentUser.role !== 'CUSTOMER'">
              <v-alert type="info" variant="tonal" density="compact" rounded="lg">Switch to a customer account to rent.</v-alert>
            </div>
            <div v-else class="d-flex flex-column gap-3">
              <v-btn color="warning" block size="large" rounded="xl" prepend-icon="mdi-lightning-bolt" @click="startInstant" elevation="0">Start Instant</v-btn>
              <v-divider><span class="text-caption">or</span></v-divider>
              <p class="text-caption font-weight-bold text-medium-emphasis">CONTRACT RENTAL</p>
              <v-text-field v-model="form.startDate" label="Start Date" type="date" variant="outlined" density="comfortable" rounded="lg" />
              <v-text-field v-model="form.endDate" label="End Date" type="date" variant="outlined" density="comfortable" rounded="lg" />
              <v-text-field v-model="form.location" label="Delivery Location" prepend-inner-icon="mdi-map-marker" variant="outlined" density="comfortable" rounded="lg" />
              <v-btn color="primary" variant="tonal" block rounded="xl" prepend-icon="mdi-file-sign" @click="submitContract">Submit Request</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" rounded="lg">{{ snackbar.text }}</v-snackbar>
  </div>
</template>

<script>
import { getVehicleById, getCompanyById, startInstantRental, submitContractRental, getCurrentUser } from '../store/data.js'
import { useReveal } from '../composables/useReveal.js'
export default {
  name: 'VehicleDetailView',
  setup() { return useReveal() },
  data() {
    const v = getVehicleById(this.$route.params.id)
    return {
      vehicle: v, currentUser: getCurrentUser(),
      estMinutes: 30, estDays: 1,
      form: { startDate: '', endDate: '', location: '' },
      snackbar: { show: false, text: '', color: 'success' }
    }
  },
  computed: {
    companyName() { return getCompanyById(this.vehicle?.companyId)?.companyName || '—' },
  },
  mounted() { this.setupReveal() },
  methods: {
    statusColor(s) { return s === 'AVAILABLE' ? 'success' : s === 'RENTED' ? 'primary' : 'warning' },
    startInstant() {
      const r = startInstantRental(this.vehicle.id, this.currentUser.id)
      if (!r) { this.snackbar = { show: true, text: 'No longer available.', color: 'error' }; return }
      this.vehicle = getVehicleById(this.vehicle.id)
      this.snackbar = { show: true, text: 'Instant rental started!', color: 'success' }
    },
    submitContract() {
      if (!this.form.startDate || !this.form.endDate) { this.snackbar = { show: true, text: 'Fill in both dates.', color: 'error' }; return }
      submitContractRental(this.vehicle.id, this.currentUser.id, this.form.startDate, this.form.endDate, this.form.location)
      this.form = { startDate: '', endDate: '', location: '' }
      this.snackbar = { show: true, text: 'Contract request submitted!', color: 'success' }
    }
  }
}
</script>
