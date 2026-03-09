<template>
  <!-- v-app wraps everything and applies the Vuetify theme -->
  <v-app :theme="theme">

    <!-- ── Navigation Bar ── -->
    <v-app-bar flat :elevation="scrolled ? 3 : 0" :class="['navbar', { 'navbar-scrolled': scrolled }]">
      <!-- Brand -->
      <v-app-bar-title>
        <router-link to="/" class="brand-link">
          <div class="brand-icon-wrap">
            <v-icon color="primary" size="22">mdi-car-multiple</v-icon>
          </div>
          <span class="brand-text">Smart<span class="brand-accent">Rent</span></span>
        </router-link>
      </v-app-bar-title>

      <template v-slot:append>
        <nav class="nav-links mr-2 d-none d-md-flex">
          <v-btn variant="text" to="/" exact size="small" class="nav-btn">Home</v-btn>
          <v-btn variant="text" to="/map" size="small" class="nav-btn">
            <v-icon start size="16">mdi-map-marker-radius</v-icon>Map
          </v-btn>
          <v-btn variant="text" to="/vehicles" size="small" class="nav-btn">Fleet</v-btn>
          <v-btn variant="text" to="/about" size="small" class="nav-btn">About</v-btn>

          <!-- Customer links -->
          <template v-if="currentUser?.role === 'CUSTOMER'">
            <v-btn variant="text" to="/rentals" size="small" class="nav-btn">My Rentals</v-btn>
            <v-btn variant="text" to="/profile" size="small" class="nav-btn">Profile</v-btn>
          </template>

          <!-- Company links -->
          <template v-if="currentUser?.role === 'COMPANY'">
            <v-btn variant="text" to="/company" size="small" class="nav-btn" color="secondary">Dashboard</v-btn>
            <v-btn variant="text" to="/company/vehicles" size="small" class="nav-btn" color="secondary">My Fleet</v-btn>
            <v-btn variant="text" to="/company/rentals" size="small" class="nav-btn" color="secondary">Rentals</v-btn>
          </template>
        </nav>

        <!-- Theme toggle -->
        <v-btn
          :icon="theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          size="small"
          @click="toggleTheme"
          class="mr-1"
        />

        <!-- User chip + logout -->
        <template v-if="currentUser">
          <v-chip
            :color="currentUser.role === 'COMPANY' ? 'secondary' : 'primary'"
            variant="tonal"
            size="small"
            class="mr-2 user-chip"
            :prepend-icon="currentUser.role === 'COMPANY' ? 'mdi-domain' : 'mdi-account'"
          >
            {{ currentUser.role === 'COMPANY' ? currentUser.companyName : currentUser.username }}
          </v-chip>
          <v-btn variant="tonal" color="error" size="small" @click="logout" prepend-icon="mdi-logout" rounded="lg">
            Logout
          </v-btn>
        </template>
        <template v-else>
          <v-btn color="primary" variant="tonal" size="small" to="/login" prepend-icon="mdi-login" rounded="lg">
            Login
          </v-btn>
        </template>
      </template>
    </v-app-bar>

    <!-- ── Page content with transitions ── -->
    <v-main>
      <router-view v-slot="{ Component, route }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </v-main>

    <!-- ── Global snackbar ── -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="bottom right"
      rounded="lg"
    >
      <div class="d-flex align-center gap-2">
        <v-icon size="18">{{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>

  </v-app>
</template>

<script>
import { getCurrentUser, clearCurrentUser } from './store/data.js'

export default {
  name: 'App',
  data() {
    return {
      theme:       localStorage.getItem('sr_theme') || 'light',
      currentUser: getCurrentUser(),
      scrolled:    false,
      snackbar:    { show: false, text: '', color: 'success' },
      transitionName: 'fade'
    }
  },
  mounted() {
    // Navbar shadow on scroll
    window.addEventListener('scroll', this.onScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  watch: {
    $route(to, from) {
      this.currentUser = getCurrentUser()
      // Choose transition based on navigation direction
      const order = ['/', '/map', '/vehicles', '/rentals', '/company', '/about']
      const toIdx   = order.indexOf(to.path)
      const fromIdx = order.indexOf(from.path)
      this.transitionName = toIdx > fromIdx ? 'slide-left' : 'slide-right'
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('sr_theme', this.theme)
      // Update Vuetify theme globally
      this.$vuetify.theme.global.name = this.theme
    },
    logout() {
      clearCurrentUser()
      this.currentUser = null
      this.$router.push('/')
    },
    onScroll() {
      this.scrolled = window.scrollY > 20
    }
  }
}
</script>

<style>
/* ── Google Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');

/* ── Global base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'DM Sans', sans-serif;
}

/* ── Page transition: fade ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

/* ── Page transition: slide left ── */
.slide-left-enter-active, .slide-left-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-left-enter-from  { opacity: 0; transform: translateX(30px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-30px); }

/* ── Page transition: slide right ── */
.slide-right-enter-active, .slide-right-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-right-enter-from  { opacity: 0; transform: translateX(-30px); }
.slide-right-leave-to    { opacity: 0; transform: translateX(30px); }

/* ── Scroll reveal animation ── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

/* ── Card hover lift ── */
.hover-lift {
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
}
.hover-lift:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 32px rgba(92, 107, 192, 0.15) !important;
}

/* ── Skeleton pulse ── */
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
.skeleton { animation: skeleton-pulse 1.5s ease-in-out infinite; }

/* ── Number counter animation ── */
@keyframes count-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.count-animated { animation: count-up 0.5s ease forwards; }
</style>

<style scoped>
.navbar { transition: box-shadow 0.3s ease; }

.brand-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(92, 107, 192, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  font-family: 'Syne', sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: inherit;
  letter-spacing: 0.5px;
}

.brand-accent { color: rgb(var(--v-theme-primary)); }

.nav-links { display: flex; align-items: center; gap: 2px; }

.nav-btn { font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.2px; }

.user-chip { font-size: 12px; }
</style>
