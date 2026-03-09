<template>
  <div>
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/rentals" class="mb-4">
      Back to My Rentals
    </v-btn>

    <div v-if="!rental">
      <v-alert type="error" variant="tonal">Contract not found.</v-alert>
    </div>

    <div v-else>
      <!-- Header -->
      <v-card rounded="xl" elevation="1" class="mb-4">
        <v-card-item>
          <template v-slot:append>
            <div class="d-flex gap-2">
              <v-chip :color="statusColor(rental.status)" variant="tonal">{{ rental.status }}</v-chip>
              <v-chip color="secondary" variant="tonal">CONTRACT</v-chip>
            </div>
          </template>
          <v-card-subtitle>Contract #{{ rental.id }}</v-card-subtitle>
          <v-card-title class="text-h5 font-weight-bold">
            {{ vehicle?.brand }} {{ vehicle?.model }}
          </v-card-title>
        </v-card-item>
      </v-card>

      <!-- Detail cards row -->
      <v-row class="mb-4">
        <!-- Vehicle info -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="1" height="100%">
            <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">Vehicle Info</v-card-title>
            <v-list density="compact" class="px-2">
              <v-list-item title="Brand"    :subtitle="vehicle?.brand" />
              <v-list-item title="Model"    :subtitle="vehicle?.model" />
              <v-list-item title="Type"     :subtitle="vehicle?.type" />
              <v-list-item title="Rate"     :subtitle="vehicle?.pricePerDay + ' DZD/day'" />
            </v-list>
          </v-card>
        </v-col>

        <!-- Contract dates -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="1" height="100%">
            <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">Contract Dates</v-card-title>
            <v-list density="compact" class="px-2">
              <v-list-item title="Start Date"         :subtitle="rental.contract?.startDate || '—'" />
              <v-list-item title="End Date"           :subtitle="rental.contract?.endDate || '—'" />
              <v-list-item title="Duration"           :subtitle="durationDays + ' day(s)'" />
              <v-list-item title="Delivery Location"  :subtitle="rental.contract?.deliveryLocation || 'Not specified'" />
            </v-list>
          </v-card>
        </v-col>

        <!-- Payment -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="1" height="100%">
            <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">Payment</v-card-title>
            <v-list density="compact" class="px-2">
              <v-list-item title="Approval">
                <template v-slot:subtitle>
                  <v-chip :color="rental.contract?.approved ? 'success' : 'warning'" variant="tonal" size="x-small">
                    {{ rental.contract?.approved ? 'Approved' : 'Pending' }}
                  </v-chip>
                </template>
              </v-list-item>
              <v-list-item title="Rental Status" :subtitle="rental.status" />
              <v-list-item title="Total Price"   :subtitle="rental.totalPrice ? rental.totalPrice + ' DZD' : 'To be calculated'" />
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <!-- Progress stepper -->
      <v-card rounded="xl" elevation="1">
        <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">Contract Progress</v-card-title>
        <v-card-text>
          <v-stepper
            :model-value="currentStep"
            alt-labels
            flat
            :items="['Submitted', 'Approved', 'Active', 'Completed']"
            color="primary"
          />
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { getRentalById, getVehicleById } from '../store/data.js'

export default {
  name: 'ContractDetailView',
  data() {
    const rental  = getRentalById(this.$route.params.id)
    const vehicle = rental ? getVehicleById(rental.vehicleId) : null
    return { rental, vehicle }
  },
  computed: {
    durationDays() {
      if (!this.rental?.contract?.startDate || !this.rental?.contract?.endDate) return '—'
      const start = new Date(this.rental.contract.startDate)
      const end   = new Date(this.rental.contract.endDate)
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    },
    // Maps rental state to stepper step number
    currentStep() {
      if (this.rental?.status === 'COMPLETED') return 4
      if (this.rental?.status === 'ACTIVE')    return 3
      if (this.rental?.contract?.approved)     return 2
      return 1
    }
  },
  methods: {
    statusColor(status) {
      if (status === 'ACTIVE')    return 'success'
      if (status === 'PENDING')   return 'warning'
      if (status === 'COMPLETED') return 'primary'
      return 'error'
    }
  }
}
</script>
