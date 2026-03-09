<template>
  <!-- v-app is required by Vuetify — it wraps everything and applies the theme -->
  <v-app :theme="theme">

    <!-- ── Top navigation bar ── -->
    <v-app-bar flat border="b" :elevation="0">

      <!-- Brand -->
      <v-app-bar-title>
        <router-link to="/" class="brand-link">
          <v-icon color="primary" class="mr-1">mdi-car-multiple</v-icon>
          <span class="brand-text">Smart<span class="brand-accent">Rent</span></span>
        </router-link>
      </v-app-bar-title>

      <!-- Nav links (desktop) -->
      <template v-slot:append>
        <div class="nav-links mr-2">
          <v-btn variant="text" to="/" exact>Home</v-btn>
          <v-btn variant="text" to="/vehicles">Vehicles</v-btn>
          <v-btn variant="text" to="/about">About</v-btn>

          <!-- Customer links: only when logged in -->
          <template v-if="currentUser">
            <v-btn variant="text" to="/rentals">My Rentals</v-btn>
            <v-btn variant="text" to="/profile">Profile</v-btn>
          </template>

          <!-- Admin links: only when role is ADMIN -->
          <template v-if="isAdmin">
            <v-btn variant="text" to="/admin" color="primary">Dashboard</v-btn>
            <v-btn variant="text" to="/admin/users" color="primary">Users</v-btn>
            <v-btn variant="text" to="/admin/stats" color="primary">Stats</v-btn>
          </template>
        </div>

        <!-- Dark/light mode toggle button -->
        <v-btn
          :icon="theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          @click="toggleTheme"
          class="mr-1"
        />

        <!-- Logged in: show user chip + logout -->
        <template v-if="currentUser">
          <v-chip
            :color="isAdmin ? 'secondary' : 'primary'"
            variant="tonal"
            class="mr-2"
            prepend-icon="mdi-account"
          >
            {{ currentUser.username }}
            <!-- Role badge inside chip -->
            <v-badge
              :content="currentUser.role"
              color="primary"
              inline
              class="ml-1"
            />
          </v-chip>
          <v-btn variant="tonal" color="error" @click="logout" prepend-icon="mdi-logout">
            Logout
          </v-btn>
        </template>

        <!-- Not logged in: login button -->
        <v-btn v-else variant="tonal" color="primary" to="/login" prepend-icon="mdi-login">
          Login
        </v-btn>
      </template>
    </v-app-bar>

    <!-- ── Page content ── -->
    <v-main>
      <v-container fluid class="pa-6" style="max-width: 1280px;">
        <router-view />
      </v-container>
    </v-main>

    <!-- ── Global snackbar for notifications ── -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script>
import { getCurrentUser, clearCurrentUser } from './store/data.js'

export default {
  name: 'App',

  data() {
    return {
      // Theme: read from localStorage so it persists across sessions
      theme: localStorage.getItem('sr_theme') || 'light',
      currentUser: getCurrentUser(),
      // Global snackbar used for notifications
      snackbar: { show: false, text: '', color: 'success' }
    }
  },

  computed: {
    isAdmin() { return this.currentUser?.role === 'ADMIN' }
  },

  // Watch route changes to re-read the current user
  // (needed after login/logout)
  watch: {
    $route() {
      this.currentUser = getCurrentUser()
    }
  },

  methods: {
    // Toggle between light and dark theme and save preference
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('sr_theme', this.theme)
    },

    // Clear session and redirect to login
    logout() {
      clearCurrentUser()
      this.currentUser = null
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.brand-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  color: inherit;
}

.brand-accent {
  color: rgb(var(--v-theme-primary));
}

.nav-links {
  display: flex;
  gap: 2px;
}
</style>
