<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">My Rentals</h2>
        <p class="text-medium-emphasis text-body-2 mt-1">Your complete rental history</p>
      </div>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-refresh" @click="loadRentals">
        Refresh
      </v-btn>
    </div>

    <!-- Rentals data table using Vuetify v-data-table -->
    <v-card rounded="xl" elevation="1">
      <v-data-table
        :headers="headers"
        :items="enrichedRentals"
        :items-per-page="10"
        rounded="xl"
      >
        <!-- Rental type column -->
        <template v-slot:item.rentalType="{ item }">
          <v-chip
            :color="item.rentalType === 'INSTANT' ? 'warning' : 'primary'"
            variant="tonal"
            size="small"
          >
            <v-icon start size="12">
              {{ item.rentalType === 'INSTANT' ? 'mdi-lightning-bolt' : 'mdi-file-document-outline' }}
            </v-icon>
            {{ item.rentalType }}
          </v-chip>
        </template>

        <!-- Status column -->
        <template v-slot:item.status="{ item }">
          <v-chip :color="statusColor(item.status)" variant="tonal" size="small">
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Total price column -->
        <template v-slot:item.totalPrice="{ item }">
          <span :class="item.totalPrice ? 'text-success font-weight-bold' : 'text-medium-emphasis'">
            {{ item.totalPrice ? item.totalPrice + ' DZD' : '—' }}
          </span>
        </template>

        <!-- Actions column -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-1">
            <!-- End rental: only for ACTIVE INSTANT -->
            <v-btn
              v-if="item.status === 'ACTIVE' && item.rentalType === 'INSTANT'"
              color="error"
              variant="tonal"
              size="small"
              rounded="lg"
              @click="endRental(item)"
            >
              End
            </v-btn>

            <!-- Receipt: only for COMPLETED -->
            <v-btn
              v-if="item.status === 'COMPLETED'"
              color="success"
              variant="tonal"
              size="small"
              rounded="lg"
              :to="`/rentals/${item.id}/receipt`"
              prepend-icon="mdi-receipt"
            >
              Receipt
            </v-btn>

            <!-- Details: only for CONTRACT -->
            <v-btn
              v-if="item.rentalType === 'CONTRACT'"
              color="primary"
              variant="tonal"
              size="small"
              rounded="lg"
              :to="`/rentals/${item.id}/contract`"
              prepend-icon="mdi-eye"
            >
              Details
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { getRentalsByUser, getVehicleById, endInstantRental, getCurrentUser } from '../store/data.js'

export default {
  name: 'RentalsView',
  data() {
    return {
      rentals:     [],
      currentUser: getCurrentUser(),
      snackbar:    { show: false, text: '', color: 'success' },
      headers: [
        { title: 'ID',          key: 'id',           width: '60px' },
        { title: 'Vehicle',     key: 'vehicleName'   },
        { title: 'Type',        key: 'rentalType'    },
        { title: 'Status',      key: 'status'        },
        { title: 'Start',       key: 'startTime'     },
        { title: 'Total Price', key: 'totalPrice'    },
        { title: 'Actions',     key: 'actions', sortable: false },
      ]
    }
  },

  computed: {
    // Enrich rentals with vehicle name for display in table
    enrichedRentals() {
      return this.rentals.map(r => {
        const vehicle = getVehicleById(r.vehicleId)
        return {
          ...r,
          vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : '—',
          startTime: r.startTime ? new Date(r.startTime).toLocaleString() : '—'
        }
      })
    }
  },

  mounted() { this.loadRentals() },

  methods: {
    loadRentals() {
      this.rentals = getRentalsByUser(this.currentUser.id)
    },

    statusColor(status) {
      if (status === 'ACTIVE')    return 'success'
      if (status === 'PENDING')   return 'warning'
      if (status === 'COMPLETED') return 'primary'
      return 'error'
    },

    // End an active instant rental
    endRental(rental) {
      endInstantRental(rental.id)
      this.loadRentals()
      this.snackbar = { show: true, text: 'Rental ended successfully!', color: 'success' }
    }
  }
}
</script>
