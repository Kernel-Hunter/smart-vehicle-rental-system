<template>
  <div style="max-width:1200px; margin:0 auto; padding:28px 32px;">

    <div class="d-flex align-center justify-space-between mb-6 reveal">
      <div>
        <h2 class="page-title">Vehicle Rentals</h2>
        <p class="page-sub">All rentals for your fleet</p>
      </div>
      <!-- Filter chips -->
      <div class="d-flex gap-2 flex-wrap">
        <v-chip
          v-for="f in filters"
          :key="f.value"
          :color="activeFilter === f.value ? 'primary' : undefined"
          :variant="activeFilter === f.value ? 'tonal' : 'outlined'"
          size="small"
          @click="activeFilter = f.value"
          class="cursor-pointer"
        >
          {{ f.label }}
          <v-badge v-if="f.count > 0" :content="f.count" color="error" inline class="ml-1" />
        </v-chip>
      </div>
    </div>

    <!-- Skeleton loading -->
    <v-card v-if="loading" rounded="xl" elevation="1" class="skeleton">
      <v-card-text class="pa-6">
        <div v-for="i in 5" :key="i" style="height:48px; background:rgba(92,107,192,0.07); border-radius:8px; margin-bottom:10px;" />
      </v-card-text>
    </v-card>

    <!-- Rentals table -->
    <v-card v-else rounded="xl" elevation="1" class="reveal reveal-delay-1">
      <v-data-table
        :headers="headers"
        :items="filteredRentals"
        :items-per-page="10"
        rounded="xl"
      >
        <!-- Customer column -->
        <template v-slot:item.customerName="{ item }">
          <div class="d-flex align-center gap-2">
            <v-avatar color="primary" size="28">
              <span class="text-caption font-weight-bold text-white">{{ item.customerName?.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <span class="text-body-2">{{ item.customerName }}</span>
          </div>
        </template>

        <!-- Type column -->
        <template v-slot:item.rentalType="{ item }">
          <v-chip :color="item.rentalType === 'INSTANT' ? 'warning' : 'secondary'" variant="tonal" size="small">
            <v-icon start size="12">{{ item.rentalType === 'INSTANT' ? 'mdi-lightning-bolt' : 'mdi-file-sign' }}</v-icon>
            {{ item.rentalType }}
          </v-chip>
        </template>

        <!-- Status column -->
        <template v-slot:item.status="{ item }">
          <v-chip :color="statusColor(item.status)" variant="tonal" size="small">{{ item.status }}</v-chip>
        </template>

        <!-- Price column -->
        <template v-slot:item.totalPrice="{ item }">
          <span :class="item.totalPrice ? 'text-success font-weight-bold' : 'text-medium-emphasis'">
            {{ item.totalPrice ? item.totalPrice + ' TND' : '—' }}
          </span>
        </template>

        <!-- Actions column: approve button for pending contracts -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="item.status === 'PENDING' && item.rentalType === 'CONTRACT'"
            color="success"
            variant="tonal"
            size="small"
            rounded="lg"
            prepend-icon="mdi-check"
            @click="approve(item)"
          >
            Approve
          </v-btn>
          <span v-else class="text-medium-emphasis text-caption">—</span>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="2500" rounded="lg">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { getCurrentUser, getRentalsByCompany, getVehicleById, getCustomerById, approveContract } from '../store/data.js'
import { useReveal } from '../composables/useReveal.js'

export default {
  name: 'CompanyRentals',
  setup() { return useReveal() },
  data() {
    return {
      company:      getCurrentUser(),
      rentals:      [],
      loading:      true,
      activeFilter: 'ALL',
      snackbar:     { show: false, text: '', color: 'success' },
      headers: [
        { title: '#',         key: 'id',           width: '60px' },
        { title: 'Customer',  key: 'customerName'  },
        { title: 'Vehicle',   key: 'vehicleName'   },
        { title: 'Type',      key: 'rentalType'    },
        { title: 'Status',    key: 'status'        },
        { title: 'Start',     key: 'startDate'     },
        { title: 'Revenue',   key: 'totalPrice'    },
        { title: '',          key: 'actions', sortable: false },
      ]
    }
  },

  computed: {
    enrichedRentals() {
      return this.rentals.map(r => {
        const vehicle  = getVehicleById(r.vehicleId)
        const customer = getCustomerById(r.customerId)
        return {
          ...r,
          vehicleName:  vehicle  ? `${vehicle.brand} ${vehicle.model}` : '—',
          customerName: customer ? customer.fullName || customer.username : '—',
          startDate:    r.startTime ? new Date(r.startTime).toLocaleDateString() : (r.contract?.startDate || '—')
        }
      })
    },
    filteredRentals() {
      if (this.activeFilter === 'ALL') return this.enrichedRentals
      return this.enrichedRentals.filter(r => r.status === this.activeFilter)
    },
    filters() {
      return [
        { label: 'All',       value: 'ALL',       count: 0 },
        { label: 'Active',    value: 'ACTIVE',    count: this.rentals.filter(r => r.status === 'ACTIVE').length },
        { label: 'Pending',   value: 'PENDING',   count: this.rentals.filter(r => r.status === 'PENDING').length },
        { label: 'Completed', value: 'COMPLETED', count: 0 },
      ]
    }
  },

  mounted() {
    setTimeout(() => {
      this.rentals = getRentalsByCompany(this.company.id)
      this.loading = false
      this.$nextTick(() => this.setupReveal())
    }, 500)
  },

  methods: {
    statusColor(s) {
      if (s === 'ACTIVE')    return 'success'
      if (s === 'PENDING')   return 'warning'
      if (s === 'COMPLETED') return 'primary'
      return 'error'
    },
    approve(rental) {
      approveContract(rental.id)
      this.rentals = getRentalsByCompany(this.company.id)
      this.snackbar = { show: true, text: 'Contract approved!', color: 'success' }
    }
  }
}
</script>

<style scoped>
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: rgb(var(--v-theme-on-surface)); }
.page-sub   { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); margin-top: 2px; }
</style>
