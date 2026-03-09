<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-2">Platform Statistics</h2>
    <p class="text-medium-emphasis text-body-2 mb-6">Overview of rentals, fleet and revenue</p>

    <!-- KPI cards -->
    <v-row class="mb-6">
      <v-col v-for="s in kpis" :key="s.label" cols="6" md="3">
        <v-card rounded="xl" elevation="1" class="text-center pa-4">
          <v-icon :color="s.color" size="36" class="mb-2">{{ s.icon }}</v-icon>
          <div class="text-h5 font-weight-bold" :style="`color: rgb(var(--v-theme-${s.color}))`">
            {{ s.value }}
          </div>
          <div class="text-caption text-medium-emphasis mt-1">{{ s.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Breakdown charts row -->
    <v-row class="mb-6">
      <!-- Rentals by status -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="1" height="100%">
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">Rentals by Status</v-card-title>
          <v-card-text>
            <div v-for="item in rentalsByStatus" :key="item.label" class="mb-3">
              <div class="d-flex justify-space-between text-caption mb-1">
                <span>{{ item.label }}</span>
                <span class="font-weight-bold">{{ item.count }}</span>
              </div>
              <v-progress-linear
                :model-value="totalRentals ? (item.count / totalRentals) * 100 : 0"
                :color="item.color"
                rounded
                height="8"
                bg-color="surface-variant"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Rentals by type -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="1" height="100%">
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">Rentals by Type</v-card-title>
          <v-card-text>
            <div v-for="item in rentalsByType" :key="item.label" class="mb-3">
              <div class="d-flex justify-space-between text-caption mb-1">
                <span>{{ item.label }}</span>
                <span class="font-weight-bold">{{ item.count }}</span>
              </div>
              <v-progress-linear
                :model-value="totalRentals ? (item.count / totalRentals) * 100 : 0"
                :color="item.color"
                rounded
                height="8"
                bg-color="surface-variant"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Fleet by status -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="1" height="100%">
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">Fleet Status</v-card-title>
          <v-card-text>
            <div v-for="item in fleetByStatus" :key="item.label" class="mb-3">
              <div class="d-flex justify-space-between text-caption mb-1">
                <span>{{ item.label }}</span>
                <span class="font-weight-bold">{{ item.count }}</span>
              </div>
              <v-progress-linear
                :model-value="totalVehicles ? (item.count / totalVehicles) * 100 : 0"
                :color="item.color"
                rounded
                height="8"
                bg-color="surface-variant"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent rentals -->
    <v-card rounded="xl" elevation="1">
      <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">Recent Rentals</v-card-title>
      <v-data-table :headers="recentHeaders" :items="recentRentals" :items-per-page="5" rounded="xl">
        <template v-slot:item.rentalType="{ item }">
          <v-chip :color="item.rentalType === 'INSTANT' ? 'warning' : 'primary'" variant="tonal" size="small">
            {{ item.rentalType }}
          </v-chip>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="statusColor(item.status)" variant="tonal" size="small">{{ item.status }}</v-chip>
        </template>
        <template v-slot:item.totalPrice="{ item }">
          <span :class="item.totalPrice ? 'text-success font-weight-bold' : 'text-medium-emphasis'">
            {{ item.totalPrice ? item.totalPrice + ' DZD' : '—' }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { getRentals, getVehicles, getVehicleById, getUserById } from '../store/data.js'

export default {
  name: 'AdminStatsView',
  data() {
    return {
      rentals:  getRentals(),
      vehicles: getVehicles(),
      recentHeaders: [
        { title: 'ID',      key: 'id'          },
        { title: 'User',    key: 'username'    },
        { title: 'Vehicle', key: 'vehicleName' },
        { title: 'Type',    key: 'rentalType'  },
        { title: 'Status',  key: 'status'      },
        { title: 'Total',   key: 'totalPrice'  },
      ]
    }
  },
  computed: {
    totalRentals()  { return this.rentals.length },
    totalVehicles() { return this.vehicles.length },
    totalRevenue() {
      return this.rentals
        .filter(r => r.totalPrice != null)
        .reduce((sum, r) => sum + r.totalPrice, 0)
        .toFixed(2)
    },
    pendingContracts() {
      return this.rentals.filter(r => r.status === 'PENDING' && r.rentalType === 'CONTRACT').length
    },
    kpis() {
      return [
        { icon: 'mdi-clipboard-list',   color: 'primary',   value: this.totalRentals,             label: 'Total Rentals' },
        { icon: 'mdi-car-multiple',     color: 'success',   value: this.totalVehicles,            label: 'Total Vehicles' },
        { icon: 'mdi-cash',             color: 'warning',   value: this.totalRevenue + ' DZD',    label: 'Total Revenue' },
        { icon: 'mdi-clock-alert',      color: 'error',     value: this.pendingContracts,         label: 'Pending Contracts' },
      ]
    },
    rentalsByStatus() {
      return [
        { label: 'ACTIVE',    count: this.rentals.filter(r => r.status === 'ACTIVE').length,    color: 'success' },
        { label: 'PENDING',   count: this.rentals.filter(r => r.status === 'PENDING').length,   color: 'warning' },
        { label: 'COMPLETED', count: this.rentals.filter(r => r.status === 'COMPLETED').length, color: 'primary' },
        { label: 'CANCELLED', count: this.rentals.filter(r => r.status === 'CANCELLED').length, color: 'error'   },
      ]
    },
    rentalsByType() {
      return [
        { label: 'INSTANT',  count: this.rentals.filter(r => r.rentalType === 'INSTANT').length,  color: 'warning' },
        { label: 'CONTRACT', count: this.rentals.filter(r => r.rentalType === 'CONTRACT').length, color: 'primary' },
      ]
    },
    fleetByStatus() {
      return [
        { label: 'AVAILABLE',   count: this.vehicles.filter(v => v.status === 'AVAILABLE').length,   color: 'success' },
        { label: 'RENTED',      count: this.vehicles.filter(v => v.status === 'RENTED').length,      color: 'primary' },
        { label: 'MAINTENANCE', count: this.vehicles.filter(v => v.status === 'MAINTENANCE').length, color: 'warning' },
      ]
    },
    recentRentals() {
      return [...this.rentals]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
        .map(r => {
          const user    = getUserById(r.userId)
          const vehicle = getVehicleById(r.vehicleId)
          return {
            ...r,
            username:    user    ? user.username                       : '—',
            vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : '—'
          }
        })
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
