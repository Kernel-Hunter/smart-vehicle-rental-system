<template>
  <div class="home">

    <!-- ── HERO SECTION ── -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-tag">◈ SMART VEHICLE RENTAL</p>
        <h1 class="hero-title">
          Rent Any Vehicle<br />
          <span class="hero-accent">Instantly or By Contract</span>
        </h1>
        <p class="hero-desc">
          SmartRent gives you full control over your rental experience.
          Jump in now with an instant rental, or plan ahead with a contract.
        </p>
        <div class="hero-btns">
          <!-- Takes logged-in users to vehicles, others to login -->
          <router-link to="/vehicles" class="btn-primary">Browse Fleet</router-link>
          <router-link to="/login" class="btn-ghost" v-if="!isLoggedIn">Get Started</router-link>
          <router-link to="/rentals" class="btn-ghost" v-else>My Rentals</router-link>
        </div>
      </div>

      <!-- Decorative right side panel -->
      <div class="hero-panel">
        <div class="panel-card">
          <p class="panel-label">RENTAL TYPES</p>
          <div class="panel-item">
            <span class="panel-icon">⚡</span>
            <div>
              <p class="panel-item-title">Instant Rental</p>
              <p class="panel-item-sub">Start now · Billed per minute</p>
            </div>
          </div>
          <div class="panel-item">
            <span class="panel-icon">📋</span>
            <div>
              <p class="panel-item-title">Contract Rental</p>
              <p class="panel-item-sub">Plan ahead · Billed per day</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── STATS ROW ── -->
    <section class="stats-row">
      <!-- Each stat card shows a key platform number -->
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <p class="stat-value">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <section class="how-section">
      <h2 class="section-title">How It Works</h2>
      <p class="section-sub">Two ways to rent — both simple and fast</p>

      <div class="steps-grid">

        <!-- Instant rental steps -->
        <div class="steps-card">
          <p class="steps-type">⚡ Instant Rental</p>
          <div class="step" v-for="(step, i) in instantSteps" :key="i">
            <span class="step-num">{{ i + 1 }}</span>
            <div>
              <p class="step-title">{{ step.title }}</p>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Contract rental steps -->
        <div class="steps-card">
          <p class="steps-type">📋 Contract Rental</p>
          <div class="step" v-for="(step, i) in contractSteps" :key="i">
            <span class="step-num">{{ i + 1 }}</span>
            <div>
              <p class="step-title">{{ step.title }}</p>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ── ROLES SECTION ── -->
    <section class="roles-section">
      <h2 class="section-title">Who Uses SmartRent?</h2>
      <div class="roles-grid">
        <div class="role-card" v-for="role in roles" :key="role.title">
          <span class="role-icon">{{ role.icon }}</span>
          <h3 class="role-title">{{ role.title }}</h3>
          <p class="role-desc">{{ role.desc }}</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'HomeView',

  computed: {
    // Check if user is logged in to show correct CTA button
    isLoggedIn() { return !!localStorage.getItem('token') }
  },

  data() {
    return {
      // Platform statistics displayed in the stats row
      stats: [
        { value: '2', label: 'Rental Models' },
        { value: '3', label: 'User Roles' },
        { value: '100%', label: 'Web Based' },
        { value: '24/7', label: 'Available' }
      ],

      // Steps for instant rental flow
      instantSteps: [
        { title: 'Browse the Fleet', desc: 'Find an available vehicle near you' },
        { title: 'Start Instantly', desc: 'One click to begin — no approval needed' },
        { title: 'End Anywhere', desc: 'Stop when done — price calculated automatically' }
      ],

      // Steps for contract rental flow
      contractSteps: [
        { title: 'Choose Your Dates', desc: 'Pick start and end date for your trip' },
        { title: 'Submit Request', desc: 'Send your request with delivery details' },
        { title: 'Admin Approves', desc: 'Get confirmed and pay per day' }
      ],

      // User role descriptions
      roles: [
        {
          icon: '👤',
          title: 'Visitor',
          desc: 'Browse the full vehicle fleet without an account. See availability, pricing, and locations.'
        },
        {
          icon: '🙋',
          title: 'Customer',
          desc: 'Register to start instant rentals, submit contract requests, and track your rental history.'
        },
        {
          icon: '🛠️',
          title: 'Admin',
          desc: 'Manage the fleet, approve contract rentals, and monitor all platform activity.'
        }
      ]
    }
  }
}
</script>

<style scoped>
.home { display: flex; flex-direction: column; gap: 80px; }

/* ── Hero ── */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  padding: 48px 0;
}

.hero-content { flex: 1; display: flex; flex-direction: column; gap: 20px; }

.hero-tag {
  color: #3b82f6;
  font-size: 12px;
  letter-spacing: 3px;
}

.hero-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 52px;
  font-weight: 700;
  color: #e2e8f0;
  line-height: 1.1;
  letter-spacing: 1px;
}

.hero-accent { color: #3b82f6; }

.hero-desc {
  color: #64748b;
  font-size: 15px;
  line-height: 1.7;
  max-width: 480px;
}

.hero-btns { display: flex; gap: 12px; margin-top: 8px; }

.btn-primary {
  background: #3b82f6;
  color: #fff;
  padding: 12px 28px;
  border-radius: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  letter-spacing: 1px;
  transition: background 0.2s;
}
.btn-primary:hover { background: #2563eb; }

.btn-ghost {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #1e3a5f;
  padding: 12px 28px;
  border-radius: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  letter-spacing: 1px;
  transition: all 0.2s;
}
.btn-ghost:hover { background: #0f1a2e; }

/* Hero decorative panel */
.hero-panel { flex-shrink: 0; }

.panel-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 28px;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-label {
  font-size: 11px;
  letter-spacing: 2px;
  color: #475569;
}

.panel-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #0d0f14;
  border: 1px solid #1e2535;
  border-radius: 6px;
  padding: 14px;
}

.panel-icon { font-size: 22px; }

.panel-item-title {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
}

.panel-item-sub {
  color: #475569;
  font-size: 12px;
  margin-top: 2px;
}

/* ── Stats row ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 28px;
  text-align: center;
}

.stat-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 40px;
  font-weight: 700;
  color: #3b82f6;
  letter-spacing: 2px;
}

.stat-label {
  color: #475569;
  font-size: 12px;
  margin-top: 4px;
  letter-spacing: 1px;
}

/* ── How it works ── */
.how-section { display: flex; flex-direction: column; gap: 32px; }

.section-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.section-sub { color: #475569; font-size: 13px; margin-top: -20px; }

.steps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.steps-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.steps-type {
  color: #3b82f6;
  font-size: 13px;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.step { display: flex; gap: 16px; align-items: flex-start; }

.step-num {
  background: #0f1a2e;
  border: 1px solid #1e3a5f;
  color: #3b82f6;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}

.step-title { color: #e2e8f0; font-size: 14px; }
.step-desc  { color: #475569; font-size: 12px; margin-top: 3px; }

/* ── Roles ── */
.roles-section { display: flex; flex-direction: column; gap: 28px; }

.roles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.role-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s;
}
.role-card:hover { border-color: #2a4a7f; }

.role-icon  { font-size: 28px; }
.role-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}
.role-desc  { color: #64748b; font-size: 13px; line-height: 1.6; }
</style>
