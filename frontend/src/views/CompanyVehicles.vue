<template>
  <div style="max-width:1200px; margin:0 auto; padding:28px 32px;">

    <div class="d-flex align-center justify-space-between mb-6 reveal">
      <div>
        <h2 class="page-title">My Fleet</h2>
        <p class="page-sub">Manage vehicles listed under your company</p>
      </div>
      <v-btn color="secondary" rounded="xl" prepend-icon="mdi-plus" @click="openAdd" elevation="0">
        Add Vehicle
      </v-btn>
    </div>

    <!-- Skeleton loading state -->
    <v-row v-if="loading">
      <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
        <v-card rounded="xl" elevation="1" class="skeleton">
          <v-card-text class="pa-5">
            <div style="height:16px; background:rgba(92,107,192,0.1); border-radius:8px; margin-bottom:10px;" />
            <div style="height:12px; width:60%; background:rgba(92,107,192,0.07); border-radius:6px; margin-bottom:8px;" />
            <div style="height:12px; width:80%; background:rgba(92,107,192,0.07); border-radius:6px;" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Vehicle grid -->
    <v-row v-else>
      <v-col v-for="(v, i) in myVehicles" :key="v.id" cols="12" sm="6" md="4">
        <v-card :class="`hover-lift reveal reveal-delay-${(i % 4) + 1}`" rounded="xl" elevation="1" height="100%">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar :color="v.color" size="38">
                <v-icon size="18" color="white">mdi-car</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-chip :color="statusColor(v.status)" variant="tonal" size="small">{{ v.status }}</v-chip>
            </template>
            <v-card-subtitle class="text-caption">{{ v.type }} · {{ v.city }}</v-card-subtitle>
            <v-card-title class="text-body-1 font-weight-bold">{{ v.brand }} {{ v.model }}</v-card-title>
          </v-card-item>
          <v-card-text class="pt-0">
            <v-row dense class="mb-2">
              <v-col cols="6">
                <div class="price-label">Per Minute</div>
                <div class="price-val text-primary">{{ v.pricePerMinute }} DZD</div>
              </v-col>
              <v-col cols="6">
                <div class="price-label">Per Day</div>
                <div class="price-val text-secondary">{{ v.pricePerDay }} DZD</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="pa-3">
            <v-btn color="primary" variant="tonal" size="small" rounded="lg" prepend-icon="mdi-pencil" @click="openEdit(v)">Edit</v-btn>
            <v-spacer />
            <v-btn color="error" variant="text" size="small" icon="mdi-delete" @click="confirmDelete(v)" />
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col v-if="myVehicles.length === 0" cols="12">
        <div class="empty-state">
          <v-icon size="56" color="secondary" class="mb-3" style="opacity:0.4">mdi-car-off</v-icon>
          <p class="text-body-1 font-weight-medium">No vehicles yet</p>
          <p class="text-body-2 text-medium-emphasis mt-1">Add your first vehicle to start accepting rentals.</p>
          <v-btn color="secondary" rounded="xl" prepend-icon="mdi-plus" @click="openAdd" class="mt-4">Add Vehicle</v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="560" rounded="xl">
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-2 text-h6 font-weight-bold">
          <v-icon :color="editing ? 'primary' : 'secondary'" class="mr-2">{{ editing ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          {{ editing ? 'Edit Vehicle' : 'Add New Vehicle' }}
        </v-card-title>
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="6">
              <v-text-field v-model="form.brand" label="Brand" variant="outlined" density="comfortable" rounded="lg" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="form.model" label="Model" variant="outlined" density="comfortable" rounded="lg" />
            </v-col>
            <v-col cols="6">
              <v-select v-model="form.type" label="Type" :items="['Sedan', 'SUV', 'Hatchback', 'Truck', 'Van', 'Convertible']" variant="outlined" density="comfortable" rounded="lg" />
            </v-col>
            <v-col cols="6">
              <v-select v-model="form.status" label="Status" :items="['AVAILABLE', 'RENTED', 'MAINTENANCE']" variant="outlined" density="comfortable" rounded="lg" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model.number="form.pricePerMinute" label="Price/Min (DZD)" type="number" variant="outlined" density="comfortable" rounded="lg" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model.number="form.pricePerDay" label="Price/Day (DZD)" type="number" variant="outlined" density="comfortable" rounded="lg" />
            </v-col>
            <v-col cols="12">
              <v-select v-model="form.city" label="City" :items="['Tunis', 'Sousse', 'Sfax', 'Bizerte', 'Monastir']" prepend-inner-icon="mdi-map-marker" variant="outlined" density="comfortable" rounded="lg" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn :color="editing ? 'primary' : 'secondary'" variant="tonal" rounded="lg" @click="save">
            {{ editing ? 'Update' : 'Add Vehicle' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete confirm dialog -->
    <v-dialog v-model="deleteDialog" max-width="380" rounded="xl">
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <v-icon color="error" size="48" class="mb-3">mdi-alert-circle-outline</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Delete Vehicle?</h3>
          <p class="text-body-2 text-medium-emphasis">
            Are you sure you want to remove <strong>{{ deletingVehicle?.brand }} {{ deletingVehicle?.model }}</strong>?
            This cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="tonal" rounded="lg" @click="doDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="2500" rounded="lg">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { getCurrentUser, getVehiclesByCompany, addVehicle, updateVehicle, deleteVehicle } from '../store/data.js'
import { useReveal } from '../composables/useReveal.js'

export default {
  name: 'CompanyVehicles',
  setup() { return useReveal() },
  data() {
    const company = getCurrentUser()
    return {
      company,
      myVehicles:      [],
      loading:         true,
      dialog:          false,
      deleteDialog:    false,
      editing:         null,
      deletingVehicle: null,
      form: { brand: '', model: '', type: 'Sedan', status: 'AVAILABLE', pricePerMinute: 2, pricePerDay: 1200, city: 'Tunis' },
      snackbar: { show: false, text: '', color: 'success' }
    }
  },

  mounted() {
    // Simulate loading skeleton for 600ms
    setTimeout(() => {
      this.myVehicles = getVehiclesByCompany(this.company.id)
      this.loading = false
      this.$nextTick(() => this.setupReveal())
    }, 600)
  },

  methods: {
    statusColor(s) {
      if (s === 'AVAILABLE')   return 'success'
      if (s === 'RENTED')      return 'primary'
      return 'warning'
    },
    openAdd() {
      this.editing = null
      this.form    = { brand: '', model: '', type: 'Sedan', status: 'AVAILABLE', pricePerMinute: 2, pricePerDay: 1200, city: this.company.city || 'Tunis' }
      this.dialog  = true
    },
    openEdit(v) {
      this.editing = v
      this.form    = { ...v }
      this.dialog  = true
    },
    save() {
      if (this.editing) {
        updateVehicle({ ...this.form, id: this.editing.id, companyId: this.company.id, color: this.editing.color, mapX: this.editing.mapX, mapY: this.editing.mapY })
        this.snackbar = { show: true, text: 'Vehicle updated.', color: 'success' }
      } else {
        addVehicle({ ...this.form, companyId: this.company.id, color: '#7E57C2' })
        this.snackbar = { show: true, text: 'Vehicle added!', color: 'success' }
      }
      this.myVehicles = getVehiclesByCompany(this.company.id)
      this.dialog = false
    },
    confirmDelete(v) {
      this.deletingVehicle = v
      this.deleteDialog    = true
    },
    doDelete() {
      deleteVehicle(this.deletingVehicle.id)
      this.myVehicles = getVehiclesByCompany(this.company.id)
      this.deleteDialog = false
      this.snackbar = { show: true, text: 'Vehicle deleted.', color: 'error' }
    }
  }
}
</script>

<style scoped>
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: rgb(var(--v-theme-on-surface)); }
.page-sub   { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); margin-top: 2px; }
.price-label { font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); margin-bottom: 2px; }
.price-val   { font-size: 15px; font-weight: 700; }
.empty-state { text-align: center; padding: 60px 20px; color: rgb(var(--v-theme-on-surface-variant)); }
</style>
