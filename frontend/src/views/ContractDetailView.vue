<template>
  <div style="max-width:900px; margin:0 auto; padding:28px 32px;">
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/rentals" class="mb-4">Back to Rentals</v-btn>

    <div v-if="!rental"><v-alert type="error" variant="tonal" rounded="xl">Contract not found.</v-alert></div>

    <div v-else>
      <v-card rounded="xl" elevation="1" class="mb-4">
        <v-card-item>
          <template v-slot:append>
            <div class="d-flex gap-2">
              <v-chip :color="sc(rental.status)" variant="tonal">{{ rental.status }}</v-chip>
              <v-chip color="secondary" variant="tonal">CONTRACT</v-chip>
            </div>
          </template>
          <v-card-subtitle>Contract #{{ rental.id }}</v-card-subtitle>
          <v-card-title class="text-h5 font-weight-bold" style="font-family:'Cabinet Grotesk','Instrument Sans',sans-serif;">{{ vehicle?.brand }} {{ vehicle?.model }}</v-card-title>
        </v-card-item>
      </v-card>

      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="1" height="100%" class="">
            <v-card-title class="pa-4 pb-2 text-body-2 font-weight-bold">Vehicle Info</v-card-title>
            <v-list density="compact" class="px-2">
              <v-list-item title="Brand" :subtitle="vehicle?.brand" />
              <v-list-item title="Model" :subtitle="vehicle?.model" />
              <v-list-item title="Rate"  :subtitle="vehicle?.pricePerDay+' TND/day'" />
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="1" height="100%" class="">
            <v-card-title class="pa-4 pb-2 text-body-2 font-weight-bold">Contract Dates</v-card-title>
            <v-list density="compact" class="px-2">
              <v-list-item title="Start"    :subtitle="rental.contract?.startDate||'—'" />
              <v-list-item title="End"      :subtitle="rental.contract?.endDate||'—'" />
              <v-list-item title="Duration" :subtitle="days+' day(s)'" />
              <v-list-item title="Delivery" :subtitle="rental.contract?.deliveryLocation||'Not specified'" />
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="1" height="100%" class="">
            <v-card-title class="pa-4 pb-2 text-body-2 font-weight-bold">Payment</v-card-title>
            <v-list density="compact" class="px-2">
              <v-list-item title="Approval">
                <template v-slot:subtitle>
                  <v-chip :color="rental.contract?.approved?'success':'warning'" variant="tonal" size="x-small">
                    {{ rental.contract?.approved ? 'Approved' : 'Pending' }}
                  </v-chip>
                </template>
              </v-list-item>
              <v-list-item title="Status" :subtitle="rental.status" />
              <v-list-item title="Total"  :subtitle="rental.totalPrice ? rental.totalPrice+' TND' : 'Pending'" />
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-card rounded="xl" elevation="1" class="">
        <v-card-title class="pa-5 pb-3 text-body-2 font-weight-bold">Contract Progress</v-card-title>
        <v-card-text class="pb-5">
          <v-stepper :model-value="step" alt-labels flat :items="['Submitted','Approved','Active','Completed']" color="primary" />
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
    const r = getRentalById(this.$route.params.id)
    return { rental: r, vehicle: r ? getVehicleById(r.vehicleId) : null }
  },
  computed: {
    days() {
      if (!this.rental?.contract?.startDate || !this.rental?.contract?.endDate) return '—'
      return Math.ceil((new Date(this.rental.contract.endDate) - new Date(this.rental.contract.startDate)) / 86400000)
    },
    step() {
      if (this.rental?.status === 'COMPLETED') return 4
      if (this.rental?.status === 'ACTIVE')    return 3
      if (this.rental?.contract?.approved)     return 2
      return 1
    }
  },
  mounted() { },
  methods: { sc(s) { return s==='ACTIVE'?'success':s==='PENDING'?'warning':s==='COMPLETED'?'primary':'error' } }
}
</script>
