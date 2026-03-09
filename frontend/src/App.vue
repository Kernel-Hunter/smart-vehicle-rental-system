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
/* ── Fonts: single clean import ── */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

/* ── Base reset ── */
*, *::before, *::after { box-sizing: border-box; }

html, body {
  font-family: 'Nunito', system-ui, sans-serif;
  /* Vuetify handles the background color via theme */
}

/* =========================================================
   LIGHT THEME — explicit, nothing left to chance
   ========================================================= */
.v-theme--light {
  --sr-text:        #1a1a2e;   /* very dark navy — max contrast */
  --sr-text-muted:  #4a5568;   /* medium gray — clearly visible */
  --sr-border:      #e2e8f0;   /* light gray border */
  --sr-surface:     #ffffff;
  --sr-bg:          #f7f8fc;
}

/* Override Vuetify's opacity-based dimming on light theme */
.v-theme--light .v-card-subtitle,
.v-theme--light .v-list-item-subtitle {
  opacity: 1 !important;
  color: #4a5568 !important;
}
.v-theme--light .v-card-title,
.v-theme--light .v-list-item-title {
  color: #1a1a2e !important;
}
.v-theme--light .v-card-text {
  color: #1a1a2e !important;
}
/* Vuetify applies --v-medium-emphasis-opacity (0.6) — kill it */
.v-theme--light .text-medium-emphasis {
  opacity: 1 !important;
  color: #4a5568 !important;
}
.v-theme--light .v-data-table,
.v-theme--light .v-data-table td,
.v-theme--light .v-data-table th {
  color: #1a1a2e !important;
}

/* =========================================================
   DARK THEME
   ========================================================= */
.v-theme--dark {
  --sr-text:        #f0f0ff;
  --sr-text-muted:  #94a3b8;
  --sr-border:      rgba(255,255,255,0.09);
  --sr-surface:     #16161f;
  --sr-bg:          #0c0c14;
}

.v-theme--dark .v-card-subtitle,
.v-theme--dark .v-list-item-subtitle {
  opacity: 1 !important;
  color: #94a3b8 !important;
}
.v-theme--dark .v-card-title,
.v-theme--dark .v-list-item-title {
  color: #f0f0ff !important;
}
.v-theme--dark .v-card-text {
  color: #f0f0ff !important;
}
.v-theme--dark .text-medium-emphasis {
  opacity: 1 !important;
  color: #94a3b8 !important;
}
.v-theme--dark .v-data-table,
.v-theme--dark .v-data-table td,
.v-theme--dark .v-data-table th {
  color: #f0f0ff !important;
}

/* =========================================================
   SHARED UTILITIES
   ========================================================= */

/* Headings */
h1, h2, h3, h4, .font-display {
  font-family: 'Syne', 'Nunito', sans-serif;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Page transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.22s ease; }
.fade-enter-from,   .fade-leave-to     { opacity: 0; }

.slide-left-enter-active,  .slide-left-leave-active  { transition: all 0.26s cubic-bezier(.4,0,.2,1); }
.slide-left-enter-from  { opacity: 0; transform: translateX(20px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-20px); }

.slide-right-enter-active, .slide-right-leave-active { transition: all 0.26s cubic-bezier(.4,0,.2,1); }
.slide-right-enter-from { opacity: 0; transform: translateX(-20px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(20px); }

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.reveal.visible     { opacity: 1; transform: translateY(0); }
.reveal-delay-1     { transition-delay: 0.07s; }
.reveal-delay-2     { transition-delay: 0.14s; }
.reveal-delay-3     { transition-delay: 0.21s; }
.reveal-delay-4     { transition-delay: 0.28s; }

/* Hover lift */
.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
.hover-lift:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 28px rgba(79,70,229,0.15) !important;
}

/* Skeleton loader */
@keyframes sk-pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
.skeleton { animation: sk-pulse 1.5s ease-in-out infinite !important; }
.v-theme--light .skeleton * { background: #e9ecf3 !important; color: transparent !important; }
.v-theme--dark  .skeleton * { background: #1e1e2a !important; color: transparent !important; }
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
  width: 34px; height: 34px;
  border-radius: 10px;
  background: rgba(79, 70, 229, 0.1);
  display: flex; align-items: center; justify-content: center;
}

/* Brand text: explicit color per theme — never inherit */
.v-theme--light .brand-text { color: #1a1a2e !important; }
.v-theme--dark  .brand-text { color: #f0f0ff !important; }

.brand-text {
  font-family: 'Syne', sans-serif;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.brand-accent { color: rgb(var(--v-theme-primary)); }

.nav-links { display: flex; align-items: center; gap: 2px; }
.nav-btn   { font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 600; }
.user-chip { font-size: 12px; }
</style>
