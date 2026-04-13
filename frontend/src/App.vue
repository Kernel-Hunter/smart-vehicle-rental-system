<template>
  <!-- v-app: theme is managed entirely by this.$vuetify.theme.global.name -->
  <v-app>

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

    <!-- ── Mobile Bottom Navigation (visible only on small screens) ── -->
    <v-bottom-navigation
      v-model="mobileTab"
      class="d-flex d-md-none mobile-nav"
      :elevation="8"
      color="primary"
    >
      <v-btn to="/" value="home">
        <v-icon>mdi-home</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn to="/map" value="map">
        <v-icon>mdi-map-marker-radius</v-icon>
        <span>Map</span>
      </v-btn>
      <v-btn to="/vehicles" value="vehicles">
        <v-icon>mdi-car-multiple</v-icon>
        <span>Fleet</span>
      </v-btn>
      <v-btn to="/about" value="about">
        <v-icon>mdi-information-outline</v-icon>
        <span>About</span>
      </v-btn>
      <v-btn v-if="currentUser?.role === 'CUSTOMER'" to="/rentals" value="rentals">
        <v-icon>mdi-clipboard-list</v-icon>
        <span>Rentals</span>
      </v-btn>
      <v-btn v-if="currentUser?.role === 'COMPANY'" to="/company" value="company">
        <v-icon>mdi-domain</v-icon>
        <span>Dashboard</span>
      </v-btn>
      <v-btn v-if="!currentUser" to="/login" value="login">
        <v-icon>mdi-login</v-icon>
        <span>Login</span>
      </v-btn>
      <v-btn v-if="currentUser" value="logout" @click="logout">
        <v-icon>mdi-logout</v-icon>
        <span>Logout</span>
      </v-btn>
    </v-bottom-navigation>

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
      transitionName: 'fade',
      mobileTab:   'home'
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
      // Let Vuetify own the theme state — it updates all CSS variables atomically
      const next = this.$vuetify.theme.global.name === 'light' ? 'dark' : 'light'
      this.$vuetify.theme.global.name = next
      this.theme = next  // keep local ref in sync for the icon only
      localStorage.setItem('sr_theme', next)
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
/* ═══════════════════════════════════════════════════════════
   FONTS
   Instrument Sans — refined, modern body text (used by Figma)
   Cabinet Grotesk — geometric display, characterful headings
   ═══════════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&display=swap');

*, *::before, *::after { box-sizing: border-box; }

html, body {
  font-family: 'Instrument Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* On mobile, add bottom padding so content isn't hidden behind the bottom nav */
@media (max-width: 960px) {
  .v-main { padding-bottom: 56px !important; }
}

h1, h2, h3, h4, .font-display {
  font-family: 'Cabinet Grotesk', 'Instrument Sans', system-ui, sans-serif;
}

/* ═══════════════════════════════════════════════════════════
   LIGHT THEME
   Background: slate-100 (#f1f5f9) — warm, not blinding white
   Cards: white — pop clearly against the slate background
   Text: slate-900 (#0f172a) — maximum contrast
   ═══════════════════════════════════════════════════════════ */
.v-theme--light {
  --v-medium-emphasis-opacity: 1;
  --v-high-emphasis-opacity:   1;
  --sr-text:      #0f172a;
  --sr-muted:     #475569;
  --sr-border:    #94a3b8;
  --sr-card:      #ffffff;
  --sr-bg:        #c8d6e5;
  /* This is what every card's border: var(--border-color, ...) actually reads */
  --border-color: #94a3b8;
}

/* Every card in light mode: white background + visible border + real shadow */
.v-theme--light .v-card {
  background-color: #ffffff !important;
  border: 1.5px solid #b8c4d4 !important;
  box-shadow: 0 2px 8px rgba(15,23,42,0.08) !important;
}

/* Kill Vuetify opacity dimming — explicit text colors everywhere */
.v-theme--light .v-card-title,
.v-theme--light .v-list-item-title      { color: #0f172a !important; opacity: 1 !important; }

.v-theme--light .v-card-subtitle,
.v-theme--light .v-list-item-subtitle,
.v-theme--light .text-medium-emphasis   { color: #475569 !important; opacity: 1 !important; }

.v-theme--light .v-card-text            { color: #0f172a !important; opacity: 1 !important; }

.v-theme--light .v-data-table,
.v-theme--light .v-data-table td,
.v-theme--light .v-data-table th        { color: #0f172a !important; }

/* Table rows get a border too */
.v-theme--light .v-data-table .v-table__wrapper {
  border: 1.5px solid #b8c4d4 !important;
  border-radius: 12px;
}

/* Chips */
.v-theme--light .v-chip { color: inherit !important; opacity: 1 !important; }

/* Btn text */
.v-theme--light .v-btn.v-btn--variant-text { color: #0f172a; }

/* App bar — base state (scoped .navbar-scrolled handles scroll state) */
.v-theme--light .v-app-bar:not(.navbar-scrolled) {
  background-color: #ffffff !important;
  border-bottom: 1.5px solid #b8c4d4 !important;
  box-shadow: 0 1px 4px rgba(15,23,42,0.05) !important;
}

/* List items */
.v-theme--light .v-list { background: transparent !important; }
.v-theme--light .v-list-item { color: #0f172a !important; }

/* ── Global catch-all: any div/section using common card-like class names ──
   Catches all custom .kpi-card, .stat-card, .step-card, .type-card etc.
   that have a border defined inline — override to be visible in light mode */
.v-theme--light [class*="-card"]:not(.v-card):not(.earnings-card):not(.company-cta-card) {
  border-color: #b8c4d4 !important;
}

/* Input fields in light mode need visible borders */
.v-theme--light .v-field__outline { color: #94a3b8 !important; }
.v-theme--light .v-field--variant-outlined .v-field__outline { opacity: 1 !important; }

/* Dialog/overlay cards */
.v-theme--light .v-overlay .v-card {
  border: 1.5px solid #b8c4d4 !important;
}

/* Bottom nav in light mode */
.v-theme--light .v-bottom-navigation {
  border-top: 1.5px solid #b8c4d4 !important;
  background: #ffffff !important;
}

/* ═══════════════════════════════════════════════════════════
   DARK THEME
   ═══════════════════════════════════════════════════════════ */
.v-theme--dark {
  --v-medium-emphasis-opacity: 1;
  --v-high-emphasis-opacity:   1;
  --sr-text:      #f0f9ff;
  --sr-muted:     #94a3b8;
  --sr-border:    rgba(255,255,255,0.12);
  --sr-card:      #111827;
  --sr-bg:        #0a0f1e;
  --border-color: rgba(255,255,255,0.10);
}

.v-theme--dark .v-card-title,
.v-theme--dark .v-list-item-title       { color: #f0f9ff !important; }

.v-theme--dark .v-card-subtitle,
.v-theme--dark .v-list-item-subtitle,
.v-theme--dark .text-medium-emphasis    { color: #94a3b8 !important; opacity: 1 !important; }

.v-theme--dark .v-card-text             { color: #f0f9ff !important; }

.v-theme--dark .v-data-table,
.v-theme--dark .v-data-table td,
.v-theme--dark .v-data-table th         { color: #f0f9ff !important; }

/* ═══════════════════════════════════════════════════════════
   SHARED UTILITIES
   ═══════════════════════════════════════════════════════════ */

.gradient-text {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Page transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,   .fade-leave-to     { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active   { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
.slide-left-enter-from  { opacity: 0; transform: translateX(18px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-18px); }

.slide-right-enter-active, .slide-right-leave-active { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
.slide-right-enter-from { opacity: 0; transform: translateX(-18px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(18px); }

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.48s ease, transform 0.48s ease;
}
.reveal.visible   { opacity: 1; transform: translateY(0); }
.reveal-delay-1   { transition-delay: 0.07s; }
.reveal-delay-2   { transition-delay: 0.14s; }
.reveal-delay-3   { transition-delay: 0.21s; }
.reveal-delay-4   { transition-delay: 0.28s; }

/* Hover lift base */
.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }

/* Skeleton */
@keyframes sk-pulse { 0%,100% { opacity:1 } 50% { opacity:0.45 } }
.skeleton { animation: sk-pulse 1.5s ease-in-out infinite !important; }
.v-theme--light .skeleton { background: #e2e8f0 !important; }
.v-theme--dark  .skeleton { background: #1e2a3a !important; }

/* ── Shimmer — visible on both themes ── */
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
/* Light shimmer: darker sweep so it shows on light bg */
.v-theme--light .shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(13,148,136,0.12) 50%, transparent 100%);
  background-size: 600px 100%;
  animation: shimmer 2.4s ease-in-out infinite;
}
.v-theme--dark .shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
  background-size: 600px 100%;
  animation: shimmer 2.4s ease-in-out infinite;
}

/* ── Float ── */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
.float      { animation: float 4s ease-in-out infinite; }
.float-slow { animation: float 6s ease-in-out infinite; }

/* ── Pulse glow — works on both themes ── */
@keyframes pulse-glow-light {
  0%, 100% { box-shadow: 0 4px 14px rgba(13,148,136,0.3); }
  50%       { box-shadow: 0 4px 28px rgba(13,148,136,0.6), 0 0 0 8px rgba(13,148,136,0.08); }
}
@keyframes pulse-glow-dark {
  0%, 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0.5); }
  50%       { box-shadow: 0 0 0 14px rgba(45,212,191,0); }
}
.v-theme--light .pulse-glow { animation: pulse-glow-light 2.5s ease-in-out infinite; }
.v-theme--dark  .pulse-glow { animation: pulse-glow-dark  2.5s ease-in-out infinite; }

/* ── Fade-up for staggered grids ── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up   { animation: fade-up 0.5s ease both; }
.fade-up-1 { animation: fade-up 0.5s 0.05s ease both; }
.fade-up-2 { animation: fade-up 0.5s 0.10s ease both; }
.fade-up-3 { animation: fade-up 0.5s 0.15s ease both; }
.fade-up-4 { animation: fade-up 0.5s 0.20s ease both; }

/* ── Chip hover ── */
.v-chip { transition: transform 0.15s ease, box-shadow 0.15s ease !important; }
.v-chip:hover { transform: translateY(-1px) !important; }

/* ── Button press ── */
.v-btn:active { transform: scale(0.97) !important; }

/* ── Primary button glow in BOTH themes ── */
.v-theme--light .v-btn--variant-flat[color="primary"],
.v-theme--light .v-btn--variant-elevated[color="primary"] {
  box-shadow: 0 4px 14px rgba(13,148,136,0.35) !important;
}
.v-theme--dark .v-btn--variant-flat[color="primary"],
.v-theme--dark .v-btn--variant-elevated[color="primary"] {
  box-shadow: 0 4px 20px rgba(45,212,191,0.3) !important;
}

/* ── v-card smooth transition ── */
.v-card { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }

/* ── Hover lift shadow — stronger in light ── */
.v-theme--light .hover-lift:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 32px rgba(13,148,136,0.22) !important;
}
.v-theme--dark .hover-lift:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 32px rgba(45,212,191,0.18) !important;
}

/* ── Input focus ring ── */
.v-theme--light .v-field--focused .v-field__outline { color: #0d9488 !important; }
.v-theme--dark  .v-field--focused .v-field__outline { color: #2dd4bf !important; }

/* ── Selection highlight ── */
::selection { background: rgba(13,148,136,0.2); }
</style>

<style scoped>
/* ── Navbar base ── */
.navbar {
  transition: background 0.35s ease, backdrop-filter 0.35s ease,
              border-color 0.35s ease, box-shadow 0.35s ease !important;
}

/* Scrolled state: glassmorphism blur */
.v-theme--light .navbar-scrolled :deep(.v-toolbar__content) { /* no-op, handled below */ }

/* We target the actual Vuetify toolbar element */
:deep(.v-app-bar.navbar-scrolled) {
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
}
.v-theme--light :deep(.v-app-bar.navbar-scrolled) {
  background: rgba(255,255,255,0.72) !important;
  border-bottom: 1px solid rgba(148,163,184,0.4) !important;
  box-shadow: 0 4px 24px rgba(15,23,42,0.08) !important;
}
.v-theme--dark :deep(.v-app-bar.navbar-scrolled) {
  background: rgba(10,15,30,0.72) !important;
  border-bottom: 1px solid rgba(255,255,255,0.07) !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4) !important;
}

.brand-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon-wrap {
  width: 34px; height: 34px;
  border-radius: 10px;
  background: rgba(13,148,136,0.12);
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, transform 0.2s;
}
.brand-link:hover .brand-icon-wrap {
  background: rgba(13,148,136,0.22);
  transform: rotate(-6deg) scale(1.08);
}

/* Brand text — hardcoded per theme, never inherit */
.v-theme--light .brand-text { color: #0f172a !important; }
.v-theme--dark  .brand-text { color: #f0f9ff !important; }

.brand-text {
  font-family: 'Cabinet Grotesk', 'Instrument Sans', sans-serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.brand-accent { color: rgb(var(--v-theme-primary)); }

.nav-links { display: flex; align-items: center; gap: 2px; }
.nav-btn {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  position: relative;
  overflow: hidden;
}
/* Subtle underline slide on nav btn hover */
.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 4px; left: 50%; right: 50%;
  height: 2px;
  background: rgb(var(--v-theme-primary));
  border-radius: 2px;
  transition: left 0.22s ease, right 0.22s ease;
}
.nav-btn:hover::after { left: 12px; right: 12px; }

.user-chip { font-size: 12px; }

/* Mobile bottom nav */
.mobile-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; }
.mobile-nav .v-btn { font-size: 10px !important; }
</style>
