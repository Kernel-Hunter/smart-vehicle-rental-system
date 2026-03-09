<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/rentals">
        Back to My Rentals
      </v-btn>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-printer" @click="printReceipt">
        Print Receipt
      </v-btn>
    </div>

    <div v-if="!rental || rental.status !== 'COMPLETED'">
      <v-alert type="warning" variant="tonal" rounded="xl">
        Receipt is only available for completed rentals.
        <v-btn variant="text" color="warning" to="/rentals" size="small">Back to Rentals</v-btn>
      </v-alert>
    </div>

    <v-row v-else justify="center">
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="2">
          <!-- Receipt header -->
          <v-card-item class="pa-6">
            <template v-slot:prepend>
              <v-icon color="success" size="40">mdi-receipt</v-icon>
            </template>
            <template v-slot:append>
              <v-chip color="success" variant="tonal">✓ COMPLETED</v-chip>
            </template>
            <v-card-title class="text-h5 font-weight-bold">Payment Receipt</v-card-title>
            <v-card-subtitle>Rental #{{ rental.id }}</v-card-subtitle>
          </v-card-item>

          <v-divider />

          <v-card-text class="pa-6">
            <!-- Vehicle info section -->
            <p class="text-overline text-medium-emphasis mb-2">Vehicle</p>
            <v-list density="compact" class="mb-4">
              <v-list-item title="Name"     :subtitle="vehicle?.brand + ' ' + vehicle?.model" />
              <v-list-item title="Type"     :subtitle="vehicle?.type" />
              <v-list-item title="Location" :subtitle="vehicle?.location" />
            </v-list>

            <v-divider class="mb-4" />

            <!-- Rental period section -->
            <p class="text-overline text-medium-emphasis mb-2">Rental Period</p>
            <v-list density="compact" class="mb-4">
              <v-list-item title="Type">
                <template v-slot:subtitle>
                  <v-chip :color="rental.rentalType === 'INSTANT' ? 'warning' : 'primary'" variant="tonal" size="x-small">
                    {{ rental.rentalType }}
                  </v-chip>
                </template>
              </v-list-item>
              <v-list-item title="Start"    :subtitle="new Date(rental.startTime).toLocaleString()" />
              <v-list-item title="End"      :subtitle="new Date(rental.endTime).toLocaleString()" />
              <v-list-item title="Duration" :subtitle="durationText" />
            </v-list>

            <v-divider class="mb-4" />

            <!-- Price breakdown -->
            <p class="text-overline text-medium-emphasis mb-2">Price Breakdown</p>
            <v-list density="compact" class="mb-4">
              <v-list-item
                title="Rate"
                :subtitle="rental.rentalType === 'INSTANT'
                  ? vehicle?.pricePerMinute + ' DZD/min'
                  : vehicle?.pricePerDay + ' DZD/day'"
              />
            </v-list>

            <!-- Total amount highlighted -->
            <v-card color="primary" variant="tonal" rounded="lg" class="pa-4 d-flex align-center justify-space-between">
              <span class="text-body-1 font-weight-medium">Total Amount</span>
              <span class="text-h5 font-weight-bold">{{ rental.totalPrice }} DZD</span>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getRentalById, getVehicleById } from '../store/data.js'

export default {
  name: 'RentalReceiptView',
  data() {
    const rental  = getRentalById(this.$route.params.id)
    const vehicle = rental ? getVehicleById(rental.vehicleId) : null
    return { rental, vehicle }
  },
  computed: {
    durationText() {
      if (!this.rental?.startTime || !this.rental?.endTime) return '—'
      if (this.rental.rentalType === 'INSTANT') {
        const mins = Math.ceil((new Date(this.rental.endTime) - new Date(this.rental.startTime)) / (1000 * 60))
        return `${mins} minute(s)`
      }
      const days = Math.ceil((new Date(this.rental.contract?.endDate) - new Date(this.rental.contract?.startDate)) / (1000 * 60 * 60 * 24))
      return `${days} day(s)`
    }
  },
  methods: {
    printReceipt() { window.print() }
  }
}
</script>
