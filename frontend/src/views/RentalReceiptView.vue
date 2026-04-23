<template>
  <div style="max-width:600px; margin:0 auto; padding:28px 32px;">
    <div class="d-flex align-center justify-space-between mb-4">
      <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/rentals">Back</v-btn>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-printer" @click="window.print()" rounded="lg">Print</v-btn>
    </div>

    <div v-if="!rental || rental.status !== 'COMPLETED'">
      <v-alert type="warning" variant="tonal" rounded="xl">Receipt only available for completed rentals.</v-alert>
    </div>

    <v-card v-else rounded="xl" elevation="2" class="">
      <v-card-item class="pa-6">
        <template v-slot:prepend><v-icon color="success" size="40">mdi-receipt-text</v-icon></template>
        <template v-slot:append><v-chip color="success" variant="tonal">✓ PAID</v-chip></template>
        <v-card-title class="text-h5 font-weight-bold" style="font-family:'Cabinet Grotesk','Instrument Sans',sans-serif;">Payment Receipt</v-card-title>
        <v-card-subtitle>Rental #{{ rental.id }}</v-card-subtitle>
      </v-card-item>

      <v-divider />

      <v-card-text class="pa-6">
        <p class="text-overline text-medium-emphasis mb-2">Vehicle</p>
        <v-list density="compact" class="mb-4">
          <v-list-item title="Name"     :subtitle="vehicle?.brand+' '+vehicle?.model" />
          <v-list-item title="Type"     :subtitle="vehicle?.type" />
          <v-list-item title="Location" :subtitle="vehicle?.city" />
        </v-list>
        <v-divider class="mb-4" />
        <p class="text-overline text-medium-emphasis mb-2">Rental Period</p>
        <v-list density="compact" class="mb-4">
          <v-list-item title="Type">
            <template v-slot:subtitle>
              <v-chip :color="rental.rentalType==='INSTANT'?'warning':'primary'" variant="tonal" size="x-small">{{ rental.rentalType }}</v-chip>
            </template>
          </v-list-item>
          <v-list-item title="Start"    :subtitle="new Date(rental.startTime).toLocaleString()" />
          <v-list-item title="End"      :subtitle="new Date(rental.endTime).toLocaleString()" />
          <v-list-item title="Duration" :subtitle="duration" />
        </v-list>
        <v-divider class="mb-4" />
        <v-card color="success" variant="tonal" rounded="xl" class="pa-5 d-flex align-center justify-space-between">
          <span class="text-body-1 font-weight-medium">Total Amount</span>
          <span style="font-family:'Cabinet Grotesk','Instrument Sans',sans-serif;font-size:28px;font-weight:800;">{{ rental.totalPrice }} TND</span>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { getRentalById, getVehicleById } from '../store/data.js'
export default {
  name: 'RentalReceiptView',
  data() {
    const r = getRentalById(this.$route.params.id)
    return { rental: r, vehicle: r ? getVehicleById(r.vehicleId) : null, window }
  },
  computed: {
    duration() {
      if (!this.rental?.startTime || !this.rental?.endTime) return '—'
      const mins = Math.ceil((new Date(this.rental.endTime) - new Date(this.rental.startTime)) / 60000)
      return this.rental.rentalType === 'INSTANT' ? `${mins} minute(s)` : `${Math.ceil(mins/1440)} day(s)`
    }
  },
  mounted() { }
}
</script>
