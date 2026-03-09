<template>
  <div style="max-width:900px; margin:0 auto; padding:28px 32px;">
    <h2 class="reveal mb-6" style="font-family:'Syne',sans-serif;font-size:24px;font-weight:700;">My Profile</h2>
    <v-row>
      <!-- Profile card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="1" class="text-center pa-6 reveal">
          <v-avatar color="primary" size="72" class="mb-4">
            <span style="font-size:28px;font-weight:700;color:white;">{{ initials }}</span>
          </v-avatar>
          <h3 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:700;">{{ profile.username }}</h3>
          <p style="font-size:13px;color:rgb(var(--v-theme-on-surface-variant));margin-top:4px;">{{ profile.email }}</p>
          <v-chip color="primary" variant="tonal" size="small" class="mt-3">{{ profile.role }}</v-chip>
          <v-divider class="my-4" />
          <v-row dense>
            <v-col cols="4">
              <div style="font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:rgb(var(--v-theme-primary));">{{ total }}</div>
              <div style="font-size:11px;color:rgb(var(--v-theme-on-surface-variant));">Total</div>
            </v-col>
            <v-col cols="4">
              <div style="font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:rgb(var(--v-theme-success));">{{ active }}</div>
              <div style="font-size:11px;color:rgb(var(--v-theme-on-surface-variant));">Active</div>
            </v-col>
            <v-col cols="4">
              <div style="font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:rgb(var(--v-theme-secondary));">{{ done }}</div>
              <div style="font-size:11px;color:rgb(var(--v-theme-on-surface-variant));">Done</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- Edit form -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="1" class="reveal reveal-delay-1">
          <v-card-title class="pa-6 pb-3 text-body-1 font-weight-bold">Edit Account</v-card-title>
          <v-card-text class="px-6 pb-6">
            <v-form @submit.prevent="save">
              <v-text-field v-model="form.username" label="Username" prepend-inner-icon="mdi-account" variant="outlined" density="comfortable" class="mb-3" rounded="lg" />
              <v-text-field v-model="form.email" label="Email" type="email" prepend-inner-icon="mdi-email" variant="outlined" density="comfortable" class="mb-4" rounded="lg" />
              <v-divider class="mb-4" />
              <p class="text-caption font-weight-medium mb-3">Change Password <span style="opacity:0.5">(leave blank to keep current)</span></p>
              <v-text-field v-model="form.newPwd" label="New Password" type="password" prepend-inner-icon="mdi-lock" variant="outlined" density="comfortable" class="mb-3" rounded="lg" />
              <v-text-field v-model="form.confirmPwd" label="Confirm Password" type="password" prepend-inner-icon="mdi-lock-check" variant="outlined" density="comfortable" class="mb-4" rounded="lg" />
              <v-alert v-if="msg" :type="ok?'success':'error'" variant="tonal" density="compact" rounded="lg" class="mb-4">{{ msg }}</v-alert>
              <v-btn type="submit" color="primary" rounded="xl" prepend-icon="mdi-content-save" elevation="0">Save Changes</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getCurrentUser, setCurrentUser, updateCustomer, getRentalsByCustomer } from '../store/data.js'
import { useReveal } from '../composables/useReveal.js'
export default {
  name: 'ProfileView',
  setup() { return useReveal() },
  data() {
    const u = getCurrentUser()
    const rentals = getRentalsByCustomer(u.id)
    return {
      profile: { ...u },
      form: { username: u.username, email: u.email, newPwd: '', confirmPwd: '' },
      rentals, msg: '', ok: false
    }
  },
  computed: {
    initials() { return this.profile.username?.charAt(0).toUpperCase() || '?' },
    total()  { return this.rentals.length },
    active() { return this.rentals.filter(r => r.status === 'ACTIVE').length },
    done()   { return this.rentals.filter(r => r.status === 'COMPLETED').length }
  },
  mounted() { this.setupReveal() },
  methods: {
    save() {
      this.msg = ''
      if (this.form.newPwd && this.form.newPwd !== this.form.confirmPwd) { this.msg = 'Passwords do not match.'; this.ok = false; return }
      const updated = { ...this.profile, username: this.form.username, email: this.form.email, ...(this.form.newPwd ? { password: this.form.newPwd } : {}) }
      updateCustomer(updated); setCurrentUser(updated)
      this.profile = { ...updated }; this.msg = 'Profile updated!'; this.ok = true
      this.form.newPwd = ''; this.form.confirmPwd = ''
    }
  }
}
</script>
