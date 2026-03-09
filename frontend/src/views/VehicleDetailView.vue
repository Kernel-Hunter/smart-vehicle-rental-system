<template>
  <div>
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/vehicles" class="mb-4">
      Back to Fleet
    </v-btn>

    <div v-if="!vehicle">
      <v-alert type="error" variant="tonal">Vehicle not found.</v-alert>
    </div>

    <v-row v-else>
      <!-- LEFT: Vehicle info -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="1" class="mb-4">
          <v-card-item>
            <template v-slot:append>
              <v-chip :color="statusColor(vehicle.status)" variant="tonal">{{ vehicle.status }}</v-chip>
            </template>
            <v-card-subtitle>#{{ vehicle.id }} · {{ vehicle.type }}</v-card-subtitle>
            <v-card-title class="text-h4 font-weight-bold">{{ vehicle.brand }} {{ vehicle.model }}</v-card-title>
          </v-card-item>
          <v-card-text>
            <v-row dense>
              <v-col cols="6" md="3">
                <v-list-item prepend-icon="mdi-map-marker" :subtitle="vehicle.location" title="Location" density="compact" />
              </v-col>
              <v-col cols="6" md="3">
                <v-list-item prepend-icon="mdi-car" :subtitle="vehicle.type" title="Type" density="compact" />
              </v-col>
              <v-col cols="6" md="3">
                <v-list-item prepend-icon="mdi-timer-outline" :subtitle="vehicle.pricePerMinute + ' DZD/min'" title="Instant Rate" density="compact" />
              </v-col>
              <v-col cols="6" md="3">
                <v-list-item prepend-icon="mdi-calendar" :subtitle="vehicle.pricePerDay + ' DZD/day'" title="Contract Rate" density="compact" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Price estimator -->
        <v-card rounded="xl" elevation="1">
          <v-card-title class="pa-4 pb-2">
            <v-icon color="primary" class="mr-2">mdi-calculator</v-icon>
            Price Estimator
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <p class="text-caption text-medium-emphasis mb-2">Instant Rental (minutes)</p>
                <v-slider v-model="estMinutes" :min="1" :max="480" :step="1" color="warning" thumb-label />
                <v-alert color="warning" variant="tonal" density="compact">
                  {{ estMinutes }} min → <strong>{{ (estMinutes * vehicle.pricePerMinute).toFixed(2) }} DZD</strong>
                </v-alert>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-caption text-medium-emphasis mb-2">Contract Rental (days)</p>
                <v-slider v-model="estDays" :min="1" :max="30" :step="1" color="primary" thumb-label />
                <v-alert color="primary" variant="tonal" density="compact">
                  {{ estDays }} day(s) → <strong>{{ (estDays * vehicle.pricePerDay).toFixed(2) }} DZD</strong>
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- RIGHT: Rent actions -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="1" class="position-sticky" style="top: 80px;">
          <v-card-title class="pa-4 pb-2">Rent This Vehicle</v-card-title>
          <v-card-text>
            <div v-if="!currentUser">
              <p class="text-body-2 text-medium-emphasis mb-4">Login to rent this vehicle.</p>
              <v-btn color="primary" block to="/login" rounded="lg">Login</v-btn>
            </div>
            <div v-else-if="vehicle.status !== 'AVAILABLE'">
              <v-alert type="warning" variant="tonal" density="compact">
                This vehicle is currently unavailable.
              </v-alert>
            </div>
            <div v-else class="d-flex flex-column gap-3">
              <v-btn color="warning" block size="large" rounded="lg" prepend-icon="mdi-lightning-bolt" @click="startInstant">
                Start Instant Rental
              </v-btn>

              <v-divider>
                <span class="text-caption text-medium-emphasis">or</span>
              </v-divider>

              <p class="text-caption font-weight-bold text-medium-emphasis">CONTRACT RENTAL</p>
              <v-text-field v-model="contractForm.startDate" label="Start Date" type="date" variant="outlined" density="comfortable" />
              <v-text-field v-model="contractForm.endDate" label="End Date" type="date" variant="outlined" density="comfortable" />
              <v-text-field v-model="contractForm.deliveryLocation" label="Delivery Location" prepend-inner-icon="mdi-map-marker" variant="outlined" density="comfortable" />
              <v-btn color="primary" variant="tonal" block rounded="lg" prepend-icon="mdi-file-document-outline" @click="submitContract">
                Submit Request
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { getVehicleById, startInstantRental, submitContractRental, getCurrentUser } from '../store/data.js'

export default {
  name: 'VehicleDetailView',
  data() {
    return {
      vehicle:      null,
      currentUser:  getCurrentUser(),
      estMinutes:   30,
      estDays:      1,
      contractForm: { startDate: '', endDate: '', deliveryLocation: '' },
      snackbar:     { show: false, text: '', color: 'success' }
    }
  },
  mounted() {
    this.vehicle = getVehicleById(this.$route.params.id)
  },
  methods: {
    statusColor(status) {
      if (status === 'AVAILABLE') return 'success'
      if (status === 'RENTED')    return 'primary'
      return 'warning'
    },
    startInstant() {
      const rental = startInstantRental(this.vehicle.id, this.currentUser.id)
      if (!rental) { this.snackbar = { show: true, text: 'Could not start rental.', color: 'error' }; return }
      this.vehicle = getVehicleById(this.vehicle.id)
      this.snackbar = { show: true, text: 'Instant rental started!', color: 'success' }
    },
    submitContract() {
      if (!this.contractForm.startDate || !this.contractForm.endDate) {
        this.snackbar = { show: true, text: 'Please fill in both dates.', color: 'error' }
        return
      }
      submitContractRental(this.vehicle.id, this.currentUser.id, this.contractForm.startDate, this.contractForm.endDate, this.contractForm.deliveryLocation)
      this.snackbar = { show: true, text: 'Contract request submitted!', color: 'success' }
      this.contractForm = { startDate: '', endDate: '', deliveryLocation: '' }
    }
  }
}
</script>
