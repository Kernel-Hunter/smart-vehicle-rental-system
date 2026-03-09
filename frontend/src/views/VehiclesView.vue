<template>
  <div>
    <!-- Page header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">Fleet Overview</h2>
        <p class="text-medium-emphasis text-body-2 mt-1">Browse and rent available vehicles</p>
      </div>
      <!-- Status filter chips -->
      <div class="d-flex gap-2">
        <v-chip
          v-for="f in filters"
          :key="f.value"
          :color="activeFilter === f.value ? 'primary' : undefined"
          :variant="activeFilter === f.value ? 'tonal' : 'outlined'"
          @click="activeFilter = f.value"
          class="cursor-pointer"
        >
          {{ f.label }}
        </v-chip>
      </div>
    </div>

    <!-- Vehicle cards grid -->
    <v-row>
      <v-col
        v-for="v in filteredVehicles"
        :key="v.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card rounded="xl" elevation="1" height="100%" class="d-flex flex-column">
          <!-- Card header: status chip top right -->
          <v-card-item>
            <template v-slot:append>
              <v-chip :color="statusColor(v.status)" variant="tonal" size="small">
                {{ v.status }}
              </v-chip>
            </template>
            <v-card-subtitle class="text-caption">#{{ v.id }} · {{ v.type }}</v-card-subtitle>
            <v-card-title class="text-h6">{{ v.brand }} {{ v.model }}</v-card-title>
          </v-card-item>

          <!-- Pricing -->
          <v-card-text class="flex-grow-1">
            <v-row dense>
              <v-col cols="6">
                <div class="text-caption text-medium-emphasis">Per Minute</div>
                <div class="text-body-1 font-weight-bold text-primary">{{ v.pricePerMinute }} DZD</div>
              </v-col>
              <v-col cols="6">
                <div class="text-caption text-medium-emphasis">Per Day</div>
                <div class="text-body-1 font-weight-bold text-primary">{{ v.pricePerDay }} DZD</div>
              </v-col>
            </v-row>
            <div class="d-flex align-center mt-3 text-caption text-medium-emphasis">
              <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
              {{ v.location }}
            </div>
          </v-card-text>

          <v-divider />

          <!-- Action buttons -->
          <v-card-actions class="pa-3 flex-column gap-2">
            <template v-if="!currentUser">
              <v-btn variant="tonal" color="primary" block to="/login" rounded="lg">
                Login to Rent
              </v-btn>
            </template>
            <template v-else-if="v.status !== 'AVAILABLE'">
              <v-btn disabled block variant="tonal" rounded="lg">Not Available</v-btn>
            </template>
            <template v-else>
              <!-- More info button -->
              <v-btn
                variant="outlined"
                color="primary"
                block
                rounded="lg"
                :to="`/vehicles/${v.id}`"
                prepend-icon="mdi-information-outline"
              >
                View Details
              </v-btn>
              <v-btn
                color="warning"
                block
                rounded="lg"
                prepend-icon="mdi-lightning-bolt"
                @click="startInstant(v)"
              >
                Instant Rental
              </v-btn>
              <v-btn
                color="primary"
                variant="tonal"
                block
                rounded="lg"
                prepend-icon="mdi-file-document-outline"
                @click="openContractDialog(v)"
              >
                Request Contract
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="filteredVehicles.length === 0" type="info" variant="tonal" class="mt-4">
      No vehicles match the selected filter.
    </v-alert>

    <!-- ── Contract Request Dialog ── -->
    <v-dialog v-model="contractDialog" max-width="500" rounded="xl">
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-2">
          <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
          Contract Rental Request
        </v-card-title>
        <v-card-subtitle class="px-6">
          {{ selectedVehicle?.brand }} {{ selectedVehicle?.model }}
        </v-card-subtitle>

        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="contractForm.startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                density="comfortable"
                required
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="contractForm.endDate"
                label="End Date"
                type="date"
                variant="outlined"
                density="comfortable"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="contractForm.deliveryLocation"
                label="Delivery Location (optional)"
                prepend-inner-icon="mdi-map-marker"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <!-- Price estimate -->
          <v-alert v-if="contractEstimate" color="primary" variant="tonal" density="compact">
            Estimated total: <strong>{{ contractEstimate }} DZD</strong>
            ({{ contractDays }} day(s) × {{ selectedVehicle?.pricePerDay }} DZD/day)
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="contractDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" @click="submitContract" rounded="lg">
            Submit Request
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Snackbar feedback ── -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { getVehicles, startInstantRental, submitContractRental, getCurrentUser } from '../store/data.js'

export default {
  name: 'VehiclesView',
  data() {
    return {
      vehicles:        [],
      currentUser:     getCurrentUser(),
      activeFilter:    'ALL',
      contractDialog:  false,
      selectedVehicle: null,
      contractForm:    { startDate: '', endDate: '', deliveryLocation: '' },
      snackbar:        { show: false, text: '', color: 'success' },
      filters: [
        { label: 'All',         value: 'ALL' },
        { label: 'Available',   value: 'AVAILABLE' },
        { label: 'Rented',      value: 'RENTED' },
        { label: 'Maintenance', value: 'MAINTENANCE' },
      ]
    }
  },

  computed: {
    // Filter vehicles based on selected status chip
    filteredVehicles() {
      if (this.activeFilter === 'ALL') return this.vehicles
      return this.vehicles.filter(v => v.status === this.activeFilter)
    },

    // Number of days between selected contract dates
    contractDays() {
      if (!this.contractForm.startDate || !this.contractForm.endDate) return 0
      const start = new Date(this.contractForm.startDate)
      const end   = new Date(this.contractForm.endDate)
      return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    },

    // Estimated price shown in the contract dialog
    contractEstimate() {
      if (!this.contractDays || !this.selectedVehicle) return null
      return (this.contractDays * this.selectedVehicle.pricePerDay).toFixed(2)
    }
  },

  mounted() { this.vehicles = getVehicles() },

  methods: {
    // Returns Vuetify color name for vehicle status
    statusColor(status) {
      if (status === 'AVAILABLE')   return 'success'
      if (status === 'RENTED')      return 'primary'
      return 'warning'
    },

    // Start an instant rental immediately
    startInstant(vehicle) {
      const rental = startInstantRental(vehicle.id, this.currentUser.id)
      if (!rental) {
        this.notify('Could not start rental. Vehicle may no longer be available.', 'error')
        return
      }
      this.vehicles = getVehicles() // Refresh vehicle list
      this.notify(`Instant rental started for ${vehicle.brand} ${vehicle.model}!`, 'success')
    },

    // Open contract dialog for selected vehicle
    openContractDialog(vehicle) {
      this.selectedVehicle = vehicle
      this.contractForm    = { startDate: '', endDate: '', deliveryLocation: '' }
      this.contractDialog  = true
    },

    // Submit contract rental request
    submitContract() {
      if (!this.contractForm.startDate || !this.contractForm.endDate) {
        this.notify('Please fill in both dates.', 'error')
        return
      }
      submitContractRental(
        this.selectedVehicle.id,
        this.currentUser.id,
        this.contractForm.startDate,
        this.contractForm.endDate,
        this.contractForm.deliveryLocation
      )
      this.contractDialog = false
      this.notify('Contract request submitted! Awaiting admin approval.', 'success')
    },

    notify(text, color = 'success') {
      this.snackbar = { show: true, text, color }
    }
  }
}
</script>
