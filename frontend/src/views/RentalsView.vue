<!-- ============================================================
     RentalsView.vue  —  paste into src/views/RentalsView.vue
     ============================================================ -->
<template>
  <div style="max-width:1100px; margin:0 auto; padding:28px 32px;">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 style="font-family:'Cabinet Grotesk','Instrument Sans',sans-serif;font-size:24px;font-weight:700;">My Rentals</h2>
        <p style="font-size:13px;color:rgb(var(--v-theme-on-surface-variant));margin-top:2px;">Your complete rental history</p>
      </div>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-refresh" @click="load" rounded="lg">Refresh</v-btn>
    </div>

    <!-- Skeleton -->
    <v-card v-if="loading" rounded="xl" elevation="1" class="skeleton">
      <v-card-text class="pa-6">
        <div v-for="i in 5" :key="i" style="height:48px;background:rgba(92,107,192,0.07);border-radius:8px;margin-bottom:10px;" />
      </v-card-text>
    </v-card>

    <v-card v-else rounded="xl" elevation="1" class="">
      <v-data-table :headers="headers" :items="enriched" :items-per-page="10" rounded="xl">
        <template v-slot:item.rentalType="{ item }">
          <v-chip :color="item.rentalType==='INSTANT'?'warning':'primary'" variant="tonal" size="small">
            <v-icon start size="12">{{ item.rentalType==='INSTANT'?'mdi-lightning-bolt':'mdi-file-sign' }}</v-icon>
            {{ item.rentalType }}
          </v-chip>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="sc(item.status)" variant="tonal" size="small">{{ item.status }}</v-chip>
        </template>
        <template v-slot:item.totalPrice="{ item }">
          <span :class="item.totalPrice?'text-success font-weight-bold':'text-medium-emphasis'">
            {{ item.totalPrice ? item.totalPrice+' TND' : '—' }}
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn v-if="item.status==='ACTIVE'&&item.rentalType==='INSTANT'" color="error" variant="tonal" size="small" rounded="lg" @click="end(item)">End</v-btn>
            <v-btn v-if="item.status==='COMPLETED'" color="success" variant="tonal" size="small" rounded="lg" :to="`/rentals/${item.id}/receipt`" prepend-icon="mdi-receipt">Receipt</v-btn>
            <v-btn v-if="item.rentalType==='CONTRACT'" color="primary" variant="tonal" size="small" rounded="lg" :to="`/rentals/${item.id}/contract`" prepend-icon="mdi-eye">Details</v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="sb.show" :color="sb.color" :timeout="3000" rounded="lg">{{ sb.text }}</v-snackbar>
  </div>
</template>

<script>
import { getRentalsByCustomer, getVehicleById, endInstantRental, getCurrentUser } from '../store/data.js'
export default {
  name: 'RentalsView',
  data() {
    return {
      rentals: [], loading: true, currentUser: getCurrentUser(),
      sb: { show: false, text: '', color: 'success' },
      headers: [
        { title: '#', key: 'id', width: '60px' }, { title: 'Vehicle', key: 'vehicleName' },
        { title: 'Type', key: 'rentalType' }, { title: 'Status', key: 'status' },
        { title: 'Start', key: 'startTime' }, { title: 'Total', key: 'totalPrice' },
        { title: '', key: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    enriched() {
      return this.rentals.map(r => {
        const v = getVehicleById(r.vehicleId)
        return { ...r, vehicleName: v ? `${v.brand} ${v.model}` : '—', startTime: r.startTime ? new Date(r.startTime).toLocaleString() : '—' }
      })
    }
  },
  mounted() { setTimeout(() => { this.load(); }, 400) },
  methods: {
    load() { this.rentals = getRentalsByCustomer(this.currentUser.id); this.loading = false },
    sc(s) { return s==='ACTIVE'?'success':s==='PENDING'?'warning':s==='COMPLETED'?'primary':'error' },
    end(r) { endInstantRental(r.id); this.load(); this.sb = { show: true, text: 'Rental ended!', color: 'success' } }
  }
}
</script>
