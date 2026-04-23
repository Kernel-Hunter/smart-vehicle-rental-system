<template>
  <div class="home">

    <!-- ── HERO ── -->
    <section class="hero-section">
      <div class="hero-bg-orb orb-1" />
      <div class="hero-bg-orb orb-2" />

      <v-container style="max-width:1200px" class="py-16">
        <v-row align="center" justify="center">
          <v-col cols="12" md="7" class="hero-left">

            <div class="hero-badge">
              <v-icon size="14" color="primary" class="mr-1">mdi-map-marker-radius</v-icon>
              <span>Vehicle Rental Marketplace</span>
            </div>

            <h1 class="hero-title">
              Find & Rent<br />
              <span class="gradient-text">Any Vehicle</span><br />
              Near You
            </h1>

            <p class="hero-sub">
              Companies list their vehicles. Customers find them on the map.
              Instant pickup or scheduled contract — your choice.
            </p>

            <div class="hero-actions">
              <v-btn
                color="primary"
                size="large"
                rounded="xl"
                to="/map"
                prepend-icon="mdi-map-search"
                class="hero-btn-primary"
                elevation="0"
              >
                Open Map
              </v-btn>
              <v-btn
                variant="outlined"
                color="primary"
                size="large"
                rounded="xl"
                to="/vehicles"
                class="hero-btn-secondary"
              >
                Browse Fleet
              </v-btn>
            </div>

            <!-- Trust badges -->
            <div class="trust-row">
              <div v-for="t in trust" :key="t.text" class="trust-item">
                <v-icon :color="t.color" size="16">{{ t.icon }}</v-icon>
                <span>{{ t.text }}</span>
              </div>
            </div>

          </v-col>

          <!-- Hero right: floating map preview card -->
          <v-col cols="12" md="5" class="d-none d-md-flex justify-center">
            <div class="hero-map-card">
              <div class="map-card-header">
                <v-icon size="14" color="success">mdi-circle</v-icon>
                <span>{{ availableCount }} vehicles nearby</span>
              </div>
              <!-- Mini map preview -->
              <div class="mini-map">
                <div
                  v-for="v in previewVehicles"
                  :key="v.id"
                  class="mini-marker"
                  :class="{ 'marker-available': v.status === 'AVAILABLE' }"
                  :style="{ left: v.mapX + '%', top: v.mapY + '%' }"
                >
                  <div class="marker-dot" />
                  <div class="marker-pulse" v-if="v.status === 'AVAILABLE'" />
                </div>
                <div class="map-grid-lines" />
              </div>
              <div class="map-card-footer">
                <span>Tap a marker to rent instantly</span>
                <v-btn color="primary" variant="tonal" size="x-small" rounded="lg" to="/map">
                  Open →
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ── STATS ── -->
    <section class="stats-section">
      <v-container style="max-width:1200px">
        <v-row>
          <v-col v-for="(stat, i) in stats" :key="stat.label" cols="6" md="3">
            <div :class="['stat-card ', `-delay-${i + 1}`]">
              <div class="stat-value" :style="`color: rgb(var(--v-theme-${stat.color}))`">
                <span class="stat-number" :data-target="stat.raw">{{ stat.animated }}</span>
                <span class="stat-suffix">{{ stat.suffix }}</span>
              </div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <section class="hiw-section">
      <v-container style="max-width:1200px">
        <div class="section-header">
          <p class="section-overline">Simple Process</p>
          <h2 class="section-title">How SmartRent Works</h2>
        </div>

        <v-row class="mt-6">
          <v-col v-for="(step, i) in steps" :key="step.title" cols="12" md="4">
            <div :class="['step-card hover-lift ', `-delay-${i + 1}`]">
              <div class="step-number">{{ String(i + 1).padStart(2, '0') }}</div>
              <v-icon :color="step.color" size="36" class="mb-3">{{ step.icon }}</v-icon>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ── FOR COMPANIES CTA ── -->
    <section class="company-cta-section">
      <v-container style="max-width:1200px">
        <div class="company-cta-card">
          <div class="cta-content">
            <v-chip color="secondary" variant="tonal" size="small" class="mb-3">For Companies</v-chip>
            <h2 class="cta-title">List Your Fleet on SmartRent</h2>
            <p class="cta-desc">
              Register your company, upload your vehicles, and start earning.
              Customers near you will find your fleet on the map instantly.
            </p>
            <v-btn
              color="secondary"
              size="large"
              rounded="xl"
              to="/login"
              prepend-icon="mdi-domain-plus"
              elevation="0"
              class="mt-2"
            >
              Register as Company
            </v-btn>
          </div>
          <div class="cta-orb" />
        </div>
      </v-container>
    </section>

    <!-- ── RENTAL TYPES ── -->
    <section class="types-section">
      <v-container style="max-width:1200px">
        <div class="section-header">
          <p class="section-overline">Two Ways to Rent</p>
          <h2 class="section-title">Choose Your Style</h2>
        </div>
        <v-row class="mt-6">
          <v-col cols="12" md="6">
            <div class="type-card type-instant hover-lift">
              <v-icon color="warning" size="40" class="mb-3">mdi-lightning-bolt</v-icon>
              <h3 class="type-title">Instant Rental</h3>
              <p class="type-desc">See a vehicle on the map, walk up, and start renting immediately. Billed per minute. End anywhere.</p>
              <ul class="type-features">
                <li v-for="f in instantFeatures" :key="f">
                  <v-icon size="14" color="warning">mdi-check</v-icon> {{ f }}
                </li>
              </ul>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="type-card type-contract hover-lift">
              <v-icon color="primary" size="40" class="mb-3">mdi-file-sign</v-icon>
              <h3 class="type-title">Contract Rental</h3>
              <p class="type-desc">Plan ahead. Choose your dates, request a vehicle, get company approval and vehicle delivery.</p>
              <ul class="type-features">
                <li v-for="f in contractFeatures" :key="f">
                  <v-icon size="14" color="primary">mdi-check</v-icon> {{ f }}
                </li>
              </ul>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

  </div>
</template>

<script>
import { getPlatformStats, getVehicles, getCurrentUser } from '../store/data.js'

export default {
  name: 'HomeView',
  data() {
    const platformStats = getPlatformStats()
    const vehicles = getVehicles()
    return {
      currentUser: getCurrentUser(),
      availableCount: vehicles.filter(v => v.status === 'AVAILABLE').length,
      previewVehicles: vehicles.slice(0, 8),
      stats: [
        { label: 'Vehicles Listed',  raw: platformStats.totalVehicles,   animated: 0, suffix: '+',  color: 'primary'   },
        { label: 'Partner Companies',raw: platformStats.totalCompanies,  animated: 0, suffix: '',   color: 'secondary' },
        { label: 'Happy Customers',  raw: platformStats.totalCustomers,  animated: 0, suffix: '+',  color: 'success'   },
        { label: 'Rentals Completed',raw: platformStats.totalRentals,    animated: 0, suffix: '',   color: 'warning'   },
      ],
      trust: [
        { icon: 'mdi-shield-check',     color: 'success',   text: 'Verified Companies' },
        { icon: 'mdi-clock-fast',       color: 'warning',   text: 'Instant Pickup'     },
        { icon: 'mdi-credit-card-check',color: 'primary',   text: 'Transparent Pricing'},
      ],
      steps: [
        { icon: 'mdi-map-search',       color: 'primary',   title: 'Find on Map',       desc: 'Open the map and see all available vehicles around you in real time.' },
        { icon: 'mdi-lightning-bolt',   color: 'warning',   title: 'Rent Instantly',    desc: 'Walk up to the vehicle and start your rental with one tap.' },
        { icon: 'mdi-flag-checkered',   color: 'success',   title: 'End & Pay',         desc: 'End your rental anytime. Price is calculated automatically.' },
      ],
      instantFeatures: ['No reservation needed', 'Billed per minute', 'End anywhere in the city', 'GPS tracked'],
      contractFeatures: ['Schedule in advance', 'Billed per day', 'Vehicle delivery option', 'Admin approved'],
    }
  },

  mounted() {
    this.animateCounters()
  },

  methods: {
    // Animate number counters from 0 to target
    animateCounters() {
      this.stats.forEach((stat, i) => {
        const duration = 1500
        const steps    = 60
        const step     = stat.raw / steps
        let current    = 0
        setTimeout(() => {
          const timer = setInterval(() => {
            current = Math.min(current + step, stat.raw)
            this.stats[i].animated = Math.floor(current)
            if (current >= stat.raw) clearInterval(timer)
          }, duration / steps)
        }, 300 + i * 150)
      })
    }
  }
}
</script>

<style scoped>
.home { overflow-x: hidden; }

/* ── Hero ── */
.hero-section {
  position: relative;
  padding: 80px 0 60px;
  overflow: hidden;
}

.hero-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.orb-1 {
  width: 500px; height: 500px;
  background: rgba(13, 148, 136, 0.1);
  top: -100px; right: -100px;
}
.orb-2 {
  width: 350px; height: 350px;
  background: rgba(8, 145, 178, 0.07);
  bottom: -50px; left: -50px;
}

.hero-left { position: relative; z-index: 1; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(13, 148, 136, 0.25);
  color: rgb(var(--v-theme-primary));
  background: rgba(13, 148, 136, 0.08);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.hero-title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
  color: rgb(var(--v-theme-on-background));
}

.hero-sub {
  font-size: 17px;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.75;
  margin-bottom: 32px;
  max-width: 480px;
}

.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
.hero-btn-primary { font-weight: 600; }

.trust-row { display: flex; gap: 20px; flex-wrap: wrap; }
.trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Hero map card */
.hero-map-card {
  width: 320px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--border-color, rgba(0,0,0,0.08));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(13, 148, 136, 0.1);
  position: relative;
  z-index: 1;
}

.map-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.06));
  color: rgb(var(--v-theme-on-surface));
}

.mini-map {
  position: relative;
  height: 200px;
  background: rgba(13, 148, 136, 0.03);
  overflow: hidden;
}

.map-grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(13, 148, 136, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13, 148, 136, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}

.mini-marker {
  position: absolute;
  transform: translate(-50%, -50%);
}

.marker-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: rgb(var(--v-theme-error));
  border: 2px solid white;
  position: relative;
  z-index: 1;
}

.marker-available .marker-dot { background: rgb(var(--v-theme-success)); }

.marker-pulse {
  position: absolute;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: rgba(22, 163, 74, 0.3);
  top: 0; left: 0;
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0%   { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(3.5); opacity: 0; }
}

.map-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant));
  border-top: 1px solid var(--border-color, rgba(0,0,0,0.06));
}

/* ── Stats ── */
.stats-section { padding: 40px 0; }

.stat-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--border-color, rgba(0,0,0,0.08));
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: transform 0.22s, box-shadow 0.22s;
}
.v-theme--light .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(13,148,136,0.1); }
.v-theme--dark  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(45,212,191,0.15); }

.stat-value  { font-family: 'Cabinet Grotesk', sans-serif; font-size: 36px; font-weight: 800; line-height: 1; }
.stat-suffix { font-size: 24px; }
.stat-label  { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); margin-top: 6px; font-weight: 500; }

/* ── Section headers ── */
.hiw-section, .types-section { padding: 60px 0; }
.company-cta-section { padding: 40px 0; }

.section-header { text-align: center; margin-bottom: 8px; }
.section-overline {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 10px;
}
.section-title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-background));
}

/* ── Steps ── */
.step-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--border-color, rgba(0,0,0,0.08));
  border-radius: 20px;
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.step-number {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 56px;
  font-weight: 800;
  color: rgb(var(--v-theme-primary));
  opacity: 0.07;
  position: absolute;
  top: 12px;
  right: 20px;
  line-height: 1;
  user-select: none;
}

.step-title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: rgb(var(--v-theme-on-surface));
}

.step-desc { font-size: 14px; line-height: 1.7; color: rgb(var(--v-theme-on-surface-variant)); }

/* ── Company CTA ── */
.company-cta-card {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  border-radius: 24px;
  padding: 48px;
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-content { position: relative; z-index: 1; max-width: 560px; }
.cta-title { font-family: 'Cabinet Grotesk', sans-serif; font-size: 30px; font-weight: 700; margin-bottom: 12px; color: #fff; }
.cta-desc  { font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.85); margin-bottom: 4px; }

.cta-orb {
  position: absolute;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  right: -60px; bottom: -80px;
  pointer-events: none;
}

/* ── Rental types ── */
.type-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--border-color, rgba(0,0,0,0.08));
  border-radius: 20px;
  padding: 36px;
  height: 100%;
}

.type-title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
  color: rgb(var(--v-theme-on-surface));
}

.type-desc {
  font-size: 14px;
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 20px;
}

.type-features { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.type-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
}
</style>
