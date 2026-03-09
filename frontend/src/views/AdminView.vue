<template>
  <div>
    <!-- ── Page header ── -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Admin Dashboard</h2>
        <p class="page-sub">Manage rentals and fleet vehicles</p>
      </div>
    </div>

    <!-- ══════════════════════════════════
         SECTION 1: ALL RENTALS
    ══════════════════════════════════ -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">▸ All Rentals</h3>
        <button class="btn-refresh" @click="fetchAllRentals">↻ Refresh</button>
      </div>

      <p v-if="rentalsError" class="msg-error">{{ rentalsError }}</p>

      <div v-if="allRentals.length" class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>User</th><th>Vehicle</th>
              <th>Type</th><th>Status</th><th>Total</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in allRentals" :key="r.id">
              <td class="id-cell">#{{ r.id }}</td>
              <td>{{ r.user?.username }}</td>
              <td>{{ r.vehicle?.brand }} {{ r.vehicle?.model }}</td>
              <!-- Rental type badge -->
              <td><span :class="['type-badge', r.rentalType === 'INSTANT' ? 'type-instant' : 'type-contract']">{{ r.rentalType }}</span></td>
              <!-- Status badge with dynamic color -->
              <td><span :class="['status-badge', statusClass(r.status)]">{{ r.status }}</span></td>
              <td class="price-cell">{{ r.totalPrice != null ? r.totalPrice + ' DZD' : '—' }}</td>
              <td>
                <!-- Approve button: only for PENDING CONTRACT rentals -->
                <button
                  v-if="r.status === 'PENDING' && r.rentalType === 'CONTRACT'"
                  class="btn-approve"
                  @click="approve(r.id)"
                >
                  ✓ Approve
                </button>
                <span v-else class="no-action">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="status-text">No rentals found.</p>
    </div>

    <!-- ══════════════════════════════════
         SECTION 2: VEHICLE LIST
    ══════════════════════════════════ -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">▸ Fleet Vehicles</h3>
        <button class="btn-refresh" @click="fetchVehicles">↻ Refresh</button>
      </div>

      <p v-if="vehiclesError" class="msg-error">{{ vehiclesError }}</p>

      <div v-if="vehicles.length" class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Brand</th><th>Model</th><th>Type</th>
              <th>Status</th><th>Price/Min</th><th>Price/Day</th><th>Location</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in vehicles" :key="v.id">
              <td class="id-cell">#{{ v.id }}</td>
              <td>{{ v.brand }}</td>
              <td>{{ v.model }}</td>
              <td>{{ v.type }}</td>
              <td><span :class="['status-badge', vehicleStatusClass(v.status)]">{{ v.status }}</span></td>
              <td class="price-cell">{{ v.pricePerMinute }}</td>
              <td class="price-cell">{{ v.pricePerDay }}</td>
              <td class="loc-cell">{{ v.location || '—' }}</td>
              <td>
                <div class="row-actions">
                  <!-- Edit: loads vehicle data into the form below -->
                  <button class="btn-edit" @click="openEdit(v)">Edit</button>
                  <!-- Delete: sends DELETE request to backend -->
                  <button class="btn-delete" @click="deleteVehicle(v.id)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="status-text">No vehicles found.</p>
    </div>

    <!-- ══════════════════════════════════
         SECTION 3: ADD / EDIT VEHICLE FORM
         Title and button change depending on
         whether editingVehicle is set or null
    ══════════════════════════════════ -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">▸ {{ editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle' }}</h3>
        <!-- Cancel edit button: only shown when editing -->
        <button v-if="editingVehicle" class="btn-ghost" @click="cancelEdit">✕ Cancel Edit</button>
      </div>

      <form @submit.prevent="saveVehicle" class="vehicle-form">
        <div class="form-grid">
          <div class="field">
            <label class="field-label">BRAND</label>
            <input v-model="form.brand" type="text" class="field-input" placeholder="e.g. Toyota" required />
          </div>
          <div class="field">
            <label class="field-label">MODEL</label>
            <input v-model="form.model" type="text" class="field-input" placeholder="e.g. Corolla" required />
          </div>
          <div class="field">
            <label class="field-label">TYPE</label>
            <input v-model="form.type" type="text" class="field-input" placeholder="e.g. Sedan" required />
          </div>
          <div class="field">
            <label class="field-label">LOCATION</label>
            <input v-model="form.location" type="text" class="field-input" placeholder="e.g. Algiers Center" />
          </div>
          <div class="field">
            <label class="field-label">PRICE PER MINUTE (DZD)</label>
            <input v-model="form.pricePerMinute" type="number" step="0.01" class="field-input" placeholder="0.00" required />
          </div>
          <div class="field">
            <label class="field-label">PRICE PER DAY (DZD)</label>
            <input v-model="form.pricePerDay" type="number" step="0.01" class="field-input" placeholder="0.00" required />
          </div>
          <div class="field">
            <label class="field-label">STATUS</label>
            <!-- Dropdown for vehicle status -->
            <select v-model="form.status" class="field-input">
              <option>AVAILABLE</option>
              <option>RENTED</option>
              <option>MAINTENANCE</option>
            </select>
          </div>
        </div>

        <!-- Submit button text changes based on mode -->
        <button type="submit" class="btn-primary">
          {{ editingVehicle ? '✓ Update Vehicle' : '+ Add Vehicle' }}
        </button>
      </form>

      <p v-if="formMessage" class="msg-success">{{ formMessage }}</p>
    </div>

  </div>
</template>

<script>

export default {
  name: 'AdminView',

  data() {
    return {
      allRentals: [],        // All rentals from all users (admin only)
      vehicles: [],          // All vehicles in the system
      rentalsError: '',
      vehiclesError: '',
      editingVehicle: null,  // Holds vehicle being edited; null = Add mode
      // Form used for both adding and editing vehicles
      form: {
        brand: '', model: '', type: '',
        pricePerMinute: '', pricePerDay: '',
        location: '', status: 'AVAILABLE'
      },
      formMessage: ''        // Feedback after form submit
    }
  },

  // Load both tables immediately when admin page opens
  mounted() {
    this.fetchAllRentals()
    this.fetchVehicles()
  },

  methods: {
    // Authorization header for all admin API calls
    auth() {
      return { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    },

    // CSS class for rental status badge
    statusClass(status) {
      if (status === 'ACTIVE')    return 'badge-green'
      if (status === 'PENDING')   return 'badge-yellow'
      if (status === 'COMPLETED') return 'badge-gray'
      return 'badge-red'
    },

    // CSS class for vehicle status badge
    vehicleStatusClass(status) {
      if (status === 'AVAILABLE')   return 'badge-green'
      if (status === 'RENTED')      return 'badge-blue'
      return 'badge-yellow' // MAINTENANCE
    },

    // Fetches ALL rentals from ALL users — admin-only endpoint
    async fetchAllRentals() {
      this.rentalsError = ''
      try {
        const res = await axios.get('http://localhost:8080/api/rentals', this.auth())
        this.allRentals = res.data
      } catch {
        this.rentalsError = 'Failed to load rentals.'
      }
    },

    // Approves a contract rental:
    // backend sets contract.approved = true, rental.status = ACTIVE,
    // calculates totalPrice = days * pricePerDay
    async approve(id) {
      try {
        await axios.post(`http://localhost:8080/api/rentals/contract/approve/${id}`, {}, this.auth())
        this.fetchAllRentals() // Refresh to show updated status
      } catch (err) {
        this.rentalsError = err.response?.data?.message || 'Approval failed.'
      }
    },

    // Fetches all vehicles
    async fetchVehicles() {
      this.vehiclesError = ''
      try {
        const res = await axios.get('http://localhost:8080/api/vehicles', this.auth())
        this.vehicles = res.data
      } catch {
        this.vehiclesError = 'Failed to load vehicles.'
      }
    },

    // Switches form to Edit mode with selected vehicle's data pre-filled
    openEdit(v) {
      this.editingVehicle = v
      this.form = { ...v } // spread copies all fields into the form
      this.formMessage = ''
    },

    // Resets form back to Add mode
    cancelEdit() {
      this.editingVehicle = null
      this.form = {
        brand: '', model: '', type: '',
        pricePerMinute: '', pricePerDay: '',
        location: '', status: 'AVAILABLE'
      }
      this.formMessage = ''
    },

    // Saves vehicle: PUT if editing, POST if adding
    async saveVehicle() {
      this.formMessage = ''
      try {
        if (this.editingVehicle) {
          await axios.put(`http://localhost:8080/api/vehicles/${this.editingVehicle.id}`, this.form, this.auth())
          this.formMessage = 'Vehicle updated successfully.'
        } else {
          await axios.post('http://localhost:8080/api/vehicles', this.form, this.auth())
          this.formMessage = 'Vehicle added successfully.'
        }
        this.cancelEdit()
        this.fetchVehicles() // Refresh table
      } catch (err) {
        this.formMessage = err.response?.data?.message || 'Failed to save vehicle.'
      }
    },

    // Deletes a vehicle after browser confirmation dialog
    async deleteVehicle(id) {
      if (!confirm('Are you sure you want to delete this vehicle?')) return
      try {
        await axios.delete(`http://localhost:8080/api/vehicles/${id}`, this.auth())
        this.fetchVehicles()
      } catch (err) {
        this.vehiclesError = err.response?.data?.message || 'Delete failed.'
      }
    }
  }
}
</script>

<style scoped>
/* ── Page header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.page-sub { color: #475569; font-size: 13px; margin-top: 4px; }

/* ── Sections separate each admin panel ── */
.section {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}

.btn-refresh {
  background: transparent;
  border: 1px solid #1e2535;
  color: #3b82f6;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  transition: all 0.2s;
}
.btn-refresh:hover { background: #0f1a2e; }

/* ── Table ── */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #1e2535;
  border-radius: 6px;
}

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }

.data-table thead tr {
  background: #0d0f14;
  border-bottom: 1px solid #1e2535;
}

.data-table th {
  padding: 10px 14px;
  text-align: left;
  color: #475569;
  font-size: 11px;
  letter-spacing: 1px;
  white-space: nowrap;
}

.data-table tbody tr {
  border-bottom: 1px solid #1a1e2a;
  transition: background 0.15s;
}
.data-table tbody tr:hover { background: #0f1218; }
.data-table tbody tr:last-child { border-bottom: none; }

.data-table td {
  padding: 12px 14px;
  color: #94a3b8;
  vertical-align: middle;
}

.id-cell    { color: #3b82f6; font-size: 12px; }
.price-cell { color: #22c55e; }
.loc-cell   { color: #64748b; font-size: 12px; }
.no-action  { color: #2a3548; }

/* Badges */
.status-badge, .type-badge {
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 1px;
}
.badge-green  { background: #052e16; color: #22c55e; border: 1px solid #166534; }
.badge-yellow { background: #1c1500; color: #eab308; border: 1px solid #854d0e; }
.badge-gray   { background: #1a1e2a; color: #64748b; border: 1px solid #2a3548; }
.badge-red    { background: #1f0707; color: #ef4444; border: 1px solid #7f1d1d; }
.badge-blue   { background: #0c1a3a; color: #60a5fa; border: 1px solid #1e3a5f; }
.type-instant  { background: #0c1a3a; color: #60a5fa; border: 1px solid #1e3a5f; }
.type-contract { background: #1a0c3a; color: #a78bfa; border: 1px solid #3b1f7f; }

/* Row action buttons */
.row-actions { display: flex; gap: 6px; }

.btn-approve {
  background: #052e16;
  border: 1px solid #166534;
  color: #22c55e;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  transition: all 0.2s;
}
.btn-approve:hover { background: #0a4a24; }

.btn-edit {
  background: transparent;
  border: 1px solid #1e3a5f;
  color: #3b82f6;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  transition: all 0.2s;
}
.btn-edit:hover { background: #0f1a2e; }

.btn-delete {
  background: transparent;
  border: 1px solid #7f1d1d;
  color: #ef4444;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  transition: all 0.2s;
}
.btn-delete:hover { background: #1f0707; }

/* ── Add/Edit form ── */
.vehicle-form { display: flex; flex-direction: column; gap: 20px; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; letter-spacing: 2px; color: #475569; }
.field-input {
  background: #0d0f14;
  border: 1px solid #1e2535;
  border-radius: 4px;
  padding: 10px 14px;
  color: #c8d0e0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.field-input:focus { border-color: #3b82f6; }

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 11px 28px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  width: fit-content;
  transition: background 0.2s;
}
.btn-primary:hover { background: #2563eb; }

.btn-ghost {
  background: transparent;
  color: #ef4444;
  border: 1px solid #7f1d1d;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  transition: all 0.2s;
}
.btn-ghost:hover { background: #1f0707; }

.msg-error   { color: #ef4444; font-size: 13px; }
.msg-success { color: #22c55e; font-size: 13px; }
.status-text { color: #475569; font-size: 13px; }

</style>
