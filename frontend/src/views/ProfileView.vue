<template>
  <div>
    <!-- Page header -->
    <div class="page-header">
      <div>
        <h2 class="page-title">My Profile</h2>
        <p class="page-sub">View and update your account information</p>
      </div>
    </div>

    <p v-if="loading" class="status-text">Loading profile...</p>
    <p v-if="error" class="msg-error">{{ error }}</p>

    <div v-if="profile" class="profile-layout">

      <!-- LEFT: Profile card -->
      <div class="profile-card">
        <!-- Avatar circle with initials -->
        <div class="avatar">{{ initials }}</div>
        <h3 class="profile-name">{{ profile.username }}</h3>
        <p class="profile-email">{{ profile.email }}</p>
        <!-- Role badge -->
        <span class="role-badge">{{ profile.role }}</span>

        <!-- Account stats -->
        <div class="profile-stats">
          <div class="pstat">
            <p class="pstat-value">{{ totalRentals }}</p>
            <p class="pstat-label">Total Rentals</p>
          </div>
          <div class="pstat">
            <p class="pstat-value">{{ activeRentals }}</p>
            <p class="pstat-label">Active</p>
          </div>
          <div class="pstat">
            <p class="pstat-value">{{ completedRentals }}</p>
            <p class="pstat-label">Completed</p>
          </div>
        </div>
      </div>

      <!-- RIGHT: Edit form -->
      <div class="edit-section">
        <h3 class="section-title">Edit Account</h3>

        <form @submit.prevent="saveProfile" class="edit-form">
          <div class="field">
            <label class="field-label">USERNAME</label>
            <input v-model="form.username" type="text" class="field-input" required />
          </div>
          <div class="field">
            <label class="field-label">EMAIL</label>
            <input v-model="form.email" type="email" class="field-input" required />
          </div>

          <div class="divider"></div>

          <p class="section-sub">Change Password <span class="optional">(leave blank to keep current)</span></p>
          <div class="field">
            <label class="field-label">NEW PASSWORD</label>
            <input v-model="form.newPassword" type="password" class="field-input" placeholder="Enter new password" />
          </div>
          <div class="field">
            <label class="field-label">CONFIRM PASSWORD</label>
            <input v-model="form.confirmPassword" type="password" class="field-input" placeholder="Repeat new password" />
          </div>

          <button type="submit" class="btn-primary">Save Changes</button>
        </form>

        <p v-if="saveMessage" :class="saveSuccess ? 'msg-success' : 'msg-error'">{{ saveMessage }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProfileView',

  data() {
    return {
      profile: null,    // User profile data from backend
      loading: false,
      error: '',
      // Form pre-filled with current profile data
      form: {
        username: '',
        email: '',
        newPassword: '',
        confirmPassword: ''
      },
      rentals: [],      // Used to compute rental stats
      saveMessage: '',
      saveSuccess: false
    }
  },

  computed: {
    // Generates avatar initials from username (e.g. "karim" → "K")
    initials() {
      return this.profile?.username?.charAt(0).toUpperCase() || '?'
    },
    totalRentals()     { return this.rentals.length },
    activeRentals()    { return this.rentals.filter(r => r.status === 'ACTIVE').length },
    completedRentals() { return this.rentals.filter(r => r.status === 'COMPLETED').length }
  },

  mounted() {
    this.fetchProfile()
    this.fetchRentals()
  },

  methods: {
    auth() {
      return { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    },

    // Fetches the logged-in user's profile from backend
    async fetchProfile() {
      this.loading = true
      try {
        const res = await axios.get('http://localhost:8080/api/users/me', this.auth())
        this.profile = res.data
        // Pre-fill the form with current values
        this.form.username = res.data.username
        this.form.email = res.data.email
      } catch {
        this.error = 'Failed to load profile.'
      } finally {
        this.loading = false
      }
    },

    // Fetches rentals to compute stats shown on the profile card
    async fetchRentals() {
      try {
        const res = await axios.get('http://localhost:8080/api/rentals/my', this.auth())
        this.rentals = res.data
      } catch { /* silently fail — stats just show 0 */ }
    },

    // Saves updated profile info to backend
    async saveProfile() {
      this.saveMessage = ''

      // Validate passwords match if user is changing password
      if (this.form.newPassword && this.form.newPassword !== this.form.confirmPassword) {
        this.saveMessage = 'Passwords do not match.'
        this.saveSuccess = false
        return
      }

      try {
        await axios.put('http://localhost:8080/api/users/me', {
          username: this.form.username,
          email: this.form.email,
          // Only send password if it was filled in
          ...(this.form.newPassword ? { password: this.form.newPassword } : {})
        }, this.auth())

        // Update stored username in localStorage so the navbar reflects the change
        localStorage.setItem('username', this.form.username)
        this.saveMessage = 'Profile updated successfully.'
        this.saveSuccess = true
        this.form.newPassword = ''
        this.form.confirmPassword = ''
        this.fetchProfile()
      } catch (err) {
        this.saveMessage = err.response?.data?.message || 'Failed to update profile.'
        this.saveSuccess = false
      }
    }
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 32px; }

.page-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}
.page-sub { color: #475569; font-size: 13px; margin-top: 4px; }

/* Two-column layout */
.profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: flex-start;
}

/* Profile card (left) */
.profile-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

/* Circular avatar with initials */
.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #0f1a2e;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.profile-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}

.profile-email { color: #475569; font-size: 12px; }

.role-badge {
  background: #0f1a2e;
  border: 1px solid #1e3a5f;
  color: #3b82f6;
  padding: 3px 12px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 2px;
}

/* Rental stats row inside profile card */
.profile-stats {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  width: 100%;
  justify-content: center;
}

.pstat { text-align: center; }
.pstat-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}
.pstat-label { color: #475569; font-size: 11px; margin-top: 2px; }

/* Edit form (right) */
.edit-section {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}

.section-sub { color: #94a3b8; font-size: 13px; }
.optional    { color: #475569; font-size: 12px; }

.divider { height: 1px; background: #1e2535; }

.edit-form { display: flex; flex-direction: column; gap: 16px; }

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
.field-input::placeholder { color: #2a3548; }

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

.msg-success { color: #22c55e; font-size: 13px; }
.msg-error   { color: #ef4444; font-size: 13px; }
.status-text { color: #475569; font-size: 13px; }
</style>
