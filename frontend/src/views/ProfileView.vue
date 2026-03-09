<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">My Profile</h2>

    <v-row>
      <!-- LEFT: Profile card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="1" class="text-center pa-6">
          <!-- Avatar with initials -->
          <v-avatar color="primary" size="80" class="mb-4">
            <span class="text-h5 font-weight-bold text-white">{{ initials }}</span>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold">{{ profile.username }}</h3>
          <p class="text-medium-emphasis text-body-2 mt-1">{{ profile.email }}</p>
          <v-chip :color="profile.role === 'ADMIN' ? 'secondary' : 'primary'" variant="tonal" size="small" class="mt-3">
            {{ profile.role }}
          </v-chip>

          <!-- Rental stats -->
          <v-divider class="my-4" />
          <v-row dense>
            <v-col cols="4">
              <div class="text-h5 font-weight-bold text-primary">{{ totalRentals }}</div>
              <div class="text-caption text-medium-emphasis">Total</div>
            </v-col>
            <v-col cols="4">
              <div class="text-h5 font-weight-bold text-success">{{ activeRentals }}</div>
              <div class="text-caption text-medium-emphasis">Active</div>
            </v-col>
            <v-col cols="4">
              <div class="text-h5 font-weight-bold text-primary">{{ completedRentals }}</div>
              <div class="text-caption text-medium-emphasis">Done</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- RIGHT: Edit form -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="1">
          <v-card-title class="pa-6 pb-2">Edit Account</v-card-title>
          <v-card-text class="pa-6">
            <v-form @submit.prevent="saveProfile">
              <v-text-field v-model="form.username" label="Username" prepend-inner-icon="mdi-account" variant="outlined" density="comfortable" class="mb-3" required />
              <v-text-field v-model="form.email" label="Email" prepend-inner-icon="mdi-email" type="email" variant="outlined" density="comfortable" class="mb-4" required />

              <v-divider class="mb-4" />
              <p class="text-body-2 font-weight-medium mb-3">Change Password <span class="text-medium-emphasis font-weight-regular">(leave blank to keep current)</span></p>

              <v-text-field v-model="form.newPassword" label="New Password" prepend-inner-icon="mdi-lock" type="password" variant="outlined" density="comfortable" class="mb-3" />
              <v-text-field v-model="form.confirmPassword" label="Confirm Password" prepend-inner-icon="mdi-lock-check" type="password" variant="outlined" density="comfortable" class="mb-4" />

              <v-alert v-if="message" :type="success ? 'success' : 'error'" variant="tonal" density="compact" class="mb-4">
                {{ message }}
              </v-alert>

              <v-btn type="submit" color="primary" rounded="lg" prepend-icon="mdi-content-save">
                Save Changes
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getCurrentUser, setCurrentUser, updateUser, getRentalsByUser } from '../store/data.js'

export default {
  name: 'ProfileView',
  data() {
    const user = getCurrentUser()
    return {
      profile: { ...user },
      form: { username: user.username, email: user.email, newPassword: '', confirmPassword: '' },
      rentals: getRentalsByUser(user.id),
      message: '',
      success: false
    }
  },
  computed: {
    initials()         { return this.profile.username?.charAt(0).toUpperCase() || '?' },
    totalRentals()     { return this.rentals.length },
    activeRentals()    { return this.rentals.filter(r => r.status === 'ACTIVE').length },
    completedRentals() { return this.rentals.filter(r => r.status === 'COMPLETED').length }
  },
  methods: {
    saveProfile() {
      this.message = ''
      if (this.form.newPassword && this.form.newPassword !== this.form.confirmPassword) {
        this.message = 'Passwords do not match.'
        this.success = false
        return
      }
      const updated = {
        ...this.profile,
        username: this.form.username,
        email:    this.form.email,
        ...(this.form.newPassword ? { password: this.form.newPassword } : {})
      }
      updateUser(updated)
      setCurrentUser(updated)
      this.profile = { ...updated }
      this.message = 'Profile updated successfully.'
      this.success = true
      this.form.newPassword    = ''
      this.form.confirmPassword = ''
    }
  }
}
</script>
