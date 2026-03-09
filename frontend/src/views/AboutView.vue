<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Admin Dashboard</h2>

    <!-- ── SECTION 1: ALL RENTALS ── -->
    <h3 class="text-h6 font-weight-medium mb-3">
      <v-icon color="primary" class="mr-2">mdi-clipboard-list</v-icon>
      All Rentals
    </h3>

    <v-card rounded="xl" elevation="1" class="mb-8">
      <v-data-table :headers="rentalHeaders" :items="enrichedRentals" :items-per-page="10" rounded="xl">

        <template v-slot:item.rentalType="{ item }">
          <v-chip :color="item.rentalType === 'INSTANT' ? 'warning' : 'primary'" variant="tonal" size="small">
            {{ item.rentalType }}
          </v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip :color="statusColor(item.status)" variant="tonal" size="small">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.totalPrice="{ item }">
          <span :class="item.totalPrice ? 'text-success font-weight-bold' : 'text-medium-emphasis'">
            {{ item.totalPrice ? item.totalPrice + ' DZD' : '—' }}
          </span>
        </template>

        <!-- Approve button: only for PENDING CONTRACT rentals -->
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
          <span v-else class="text-medium-emphasis">—</span>
        </template>
      </v-data-table>
    </v-card>

    <!-- ── SECTION 2: VEHICLE LIST ── -->
    <div class="d-flex align-center justify-space-between mb-3">
      <h3 class="text-h6 font-weight-medium">
        <v-icon color="primary" class="mr-2">mdi-car-multiple</v-icon>
        Fleet Vehicles
      </h3>
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus" @click="openAddVehicle" rounded="lg">
        Add Vehicle
      </v-btn>
    </div>

    <v-card rounded="xl" elevation="1" class="mb-8">
      <v-data-table :headers="vehicleHeaders" :items="vehicles" :items-per-page="10" rounded="xl">

        <template v-slot:item.status="{ item }">
          <v-chip :color="vehicleStatusColor(item.status)" variant="tonal" size="small">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn color="primary" variant="tonal" size="small" rounded="lg" @click="openEditVehicle(item)" prepend-icon="mdi-pencil">
              Edit
            </v-btn>
            <v-btn color="error" variant="tonal" size="small" rounded="lg" @click="removeVehicle(item.id)" prepend-icon="mdi-delete">
              Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ── ADD/EDIT VEHICLE DIALOG ── -->
    <v-dialog v-model="vehicleDialog" max-width="550" rounded="xl">
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-2">
          {{ editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle' }}
        </v-card-title>
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="6">
              <v-text-field v-model="vehicleForm.brand" label="Brand" variant="outlined" density="comfortable" required />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="vehicleForm.model" label="Model" variant="outlined" density="comfortable" required />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="vehicleForm.type" label="Type" variant="outlined" density="comfortable" required />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="vehicleForm.status"
                label="Status"
                :items="['AVAILABLE', 'RENTED', 'MAINTENANCE']"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="vehicleForm.pricePerMinute" label="Price/Min (DZD)" type="number" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="vehicleForm.pricePerDay" label="Price/Day (DZD)" type="number" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="vehicleForm.location" label="Location" prepend-inner-icon="mdi-map-marker" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="vehicleDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" @click="saveVehicle" rounded="lg">
            {{ editingVehicle ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import {
  getRentals, getVehicles, getVehicleById, getUserById,
  approveContract, addVehicle, updateVehicle, deleteVehicle
} from '../store/data.js'

export default {
  name: 'AdminView',
  data() {
    return {
      rentals:        [],
      vehicles:       [],
      vehicleDialog:  false,
      editingVehicle: null,
      vehicleForm: { brand: '', model: '', type: '', status: 'AVAILABLE', pricePerMinute: 0, pricePerDay: 0, location: '' },
      snackbar: { show: false, text: '', color: 'success' },
      rentalHeaders: [
        { title: 'ID',       key: 'id',          width: '60px' },
        { title: 'User',     key: 'username'     },
        { title: 'Vehicle',  key: 'vehicleName'  },
        { title: 'Type',     key: 'rentalType'   },
        { title: 'Status',   key: 'status'       },
        { title: 'Total',    key: 'totalPrice'   },
        { title: 'Action',   key: 'actions', sortable: false },
      ],
      vehicleHeaders: [
        { title: 'ID',        key: 'id',             width: '60px' },
        { title: 'Brand',     key: 'brand'           },
        { title: 'Model',     key: 'model'           },
        { title: 'Type',      key: 'type'            },
        { title: 'Status',    key: 'status'          },
        { title: 'Price/Min', key: 'pricePerMinute'  },
        { title: 'Price/Day', key: 'pricePerDay'     },
        { title: 'Location',  key: 'location'        },
        { title: 'Actions',   key: 'actions', sortable: false },
      ]
    }
  },

  computed: {
    // Enrich rentals with username and vehicle name for display
    enrichedRentals() {
      return this.rentals.map(r => {
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

  mounted() {
    this.rentals  = getRentals()
    this.vehicles = getVehicles()
  },

  methods: {
    statusColor(status) {
      if (status === 'ACTIVE')    return 'success'
      if (status === 'PENDING')   return 'warning'
      if (status === 'COMPLETED') return 'primary'
      return 'error'
    },

    vehicleStatusColor(status) {
      if (status === 'AVAILABLE')   return 'success'
      if (status === 'RENTED')      return 'primary'
      return 'warning'
    },

    // Approve a pending contract rental
    approve(rental) {
      approveContract(rental.id)
      this.rentals  = getRentals()
      this.vehicles = getVehicles()
      this.snackbar = { show: true, text: 'Contract approved successfully!', color: 'success' }
    },

    openAddVehicle() {
      this.editingVehicle = null
      this.vehicleForm    = { brand: '', model: '', type: '', status: 'AVAILABLE', pricePerMinute: 0, pricePerDay: 0, location: '' }
      this.vehicleDialog  = true
    },

    openEditVehicle(vehicle) {
      this.editingVehicle = vehicle
      this.vehicleForm    = { ...vehicle }
      this.vehicleDialog  = true
    },

    saveVehicle() {
      if (this.editingVehicle) {
        updateVehicle({ ...this.vehicleForm, id: this.editingVehicle.id })
        this.snackbar = { show: true, text: 'Vehicle updated.', color: 'success' }
      } else {
        addVehicle({ ...this.vehicleForm })
        this.snackbar = { show: true, text: 'Vehicle added.', color: 'success' }
      }
      this.vehicleDialog = false
      this.vehicles = getVehicles()
    },

    removeVehicle(id) {
      deleteVehicle(id)
      this.vehicles = getVehicles()
      this.snackbar = { show: true, text: 'Vehicle deleted.', color: 'error' }
    }
  }
}
</script>
