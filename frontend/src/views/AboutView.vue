<!-- AboutView.vue -->
<template>
  <div class="about-page">

    <!-- Header -->
    <div class="about-header">
      <v-chip color="primary" variant="tonal" size="small" class="mb-4">Academic Project</v-chip>
      <h1 class="about-title">
        About <span class="gradient-text">SmartRent</span>
      </h1>
      <p class="about-sub">
        Smart Vehicle Rental Marketplace — ISS Project<br />
        South Mediterranean University · MedTech
      </p>
    </div>

    <!-- Description -->
    <v-card rounded="xl" elevation="1" class="mb-8 fade-up-1">
      <v-card-text class="pa-8">
        <p class="text-overline text-primary mb-3">The Project</p>
        <p class="about-body">
          SmartRent is a two-sided vehicle rental marketplace. Companies register and list their fleets.
          Customers open the map, find nearby available vehicles, and rent them instantly or via scheduled contract.
          Built as part of the ISS curriculum to demonstrate component-driven architecture,
          role-based access control, and real-world UX patterns.
        </p>
      </v-card-text>
    </v-card>

    <!-- Tech stack -->
    <h2 class="section-heading mb-5 fade-up-1">Tech Stack</h2>
    <v-row class="mb-10">
      <v-col v-for="(t, i) in tech" :key="t.name" cols="6" sm="4" md="3" lg="2">
        <v-card
          :class="`hover-lift fade-up-${(i % 4) + 1}`"
          rounded="xl"
          elevation="1"
          class="tech-card text-center pa-5"
        >
          <v-icon :color="t.color" size="34" class="mb-3">{{ t.icon }}</v-icon>
          <div class="tech-name">{{ t.name }}</div>
          <div class="tech-desc">{{ t.desc }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Team -->
    <h2 class="section-heading mb-5 fade-up-1">The Team</h2>
    <v-row class="mb-10">
      <v-col v-for="(m, i) in team" :key="m.name" cols="6" md="3">
        <v-card
          :class="`hover-lift fade-up-${i + 1}`"
          rounded="xl"
          elevation="1"
          class="team-card text-center pa-6"
        >
          <v-avatar color="primary" size="64" class="mb-4">
            <span class="avatar-initials">{{ m.initials }}</span>
          </v-avatar>
          <div class="member-name">{{ m.name }}</div>
          <div class="member-role">{{ m.role }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- University -->
    <v-card color="primary" variant="tonal" rounded="xl" elevation="0" class="fade-up-1">
      <v-card-text class="pa-6">
        <p class="text-overline mb-2">Institution</p>
        <p class="uni-name">South Mediterranean University — MedTech</p>
        <p class="uni-sub">Program: ISS — Ingénierie des Systèmes et des Services</p>
      </v-card-text>
    </v-card>

  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      tech: [
        { icon: 'mdi-vuejs',          color: 'success',   name: 'Vue 3',       desc: 'Framework'    },
        { icon: 'mdi-alpha-v-box',    color: 'primary',   name: 'Vuetify 3',   desc: 'UI Library'   },
        { icon: 'mdi-lightning-bolt', color: 'warning',   name: 'Vite',        desc: 'Build Tool'   },
        { icon: 'mdi-routes',         color: 'info',      name: 'Vue Router',  desc: 'Navigation'   },
        { icon: 'mdi-harddisk',       color: 'secondary', name: 'localStorage',desc: 'Data Layer'   },
        { icon: 'mdi-cloud-upload',   color: 'primary',   name: 'Vercel',      desc: 'Deployment'   },
      ],
      team: [
        { name: 'Karim Masmoudi', initials: 'KM', role: 'Full Stack Developer' },
        { name: 'Bilel Didi',     initials: 'BD', role: 'Full Stack Developer' },
        { name: 'Aziz Zemzmi',    initials: 'AZ', role: 'Full Stack Developer' },
        { name: 'Ahmed Tahri',    initials: 'AT', role: 'Full Stack Developer' },
      ]
    }
  }
}
</script>

<style scoped>
.about-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 32px;
}

@media (max-width: 600px) {
  .about-page { padding: 16px; }
}

/* Header */
.about-header {
  text-align: center;
  padding: 40px 0 32px;
}

.about-title {
  font-family: 'Cabinet Grotesk', 'Instrument Sans', sans-serif;
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  margin-bottom: 16px;
  color: rgb(var(--v-theme-on-background));
}

.about-sub {
  font-size: 16px;
  line-height: 1.8;
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 520px;
  margin: 0 auto;
}

/* Description */
.about-body {
  font-size: 16px;
  line-height: 1.85;
  color: rgb(var(--v-theme-on-surface));
}

/* Section heading */
.section-heading {
  font-family: 'Cabinet Grotesk', 'Instrument Sans', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-background));
}

/* Tech cards */
.tech-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tech-name {
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}

.tech-desc {
  font-size: 11px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 3px;
}

/* Team cards */
.team-card {
  height: 100%;
}

.avatar-initials {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.member-name {
  font-weight: 700;
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 4px;
}

.member-role {
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant));
}

/* University card */
.uni-name {
  font-family: 'Cabinet Grotesk', 'Instrument Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}

.uni-sub {
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 6px;
}
</style>
