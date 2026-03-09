<template>
  <div>
    <!-- Header -->
    <div class="text-center py-8">
      <v-chip color="primary" variant="tonal" size="small" class="mb-4">Academic Project</v-chip>
      <h1 class="text-h3 font-weight-bold mb-3">About SmartRent</h1>
      <p class="text-medium-emphasis text-body-1" style="max-width: 600px; margin: 0 auto; line-height: 1.8">
        Smart Vehicle Rental Management System — ISS Project<br />
        South Mediterranean University · MedTech
      </p>
    </div>

    <!-- Description -->
    <v-card rounded="xl" elevation="1" class="mb-8">
      <v-card-text class="pa-6">
        <p class="text-overline text-primary mb-2">The Project</p>
        <p class="text-body-1 mb-3" style="line-height: 1.8">
          SmartRent is a full-stack vehicle rental platform developed as part of the ISS curriculum.
          It demonstrates real-world software engineering concepts including REST API design,
          JWT authentication, role-based access control, and a reactive Vue 3 frontend.
        </p>
        <p class="text-body-1" style="line-height: 1.8">
          The system supports two rental models: instant self-service rentals billed per minute,
          and admin-approved contract rentals billed per day with optional vehicle delivery.
        </p>
      </v-card-text>
    </v-card>

    <!-- Tech stack -->
    <h2 class="text-h5 font-weight-bold mb-4">Tech Stack</h2>
    <v-row class="mb-8">
      <v-col v-for="tech in techStack" :key="tech.name" cols="6" md="4" lg="2">
        <v-card rounded="xl" elevation="1" class="text-center pa-4 h-100">
          <v-icon :color="tech.color" size="36" class="mb-2">{{ tech.icon }}</v-icon>
          <div class="text-body-2 font-weight-bold">{{ tech.name }}</div>
          <div class="text-caption text-medium-emphasis mt-1">{{ tech.desc }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Team -->
    <h2 class="text-h5 font-weight-bold mb-4">The Team</h2>
    <v-row class="mb-8">
      <v-col v-for="member in team" :key="member.name" cols="6" md="3">
        <v-card rounded="xl" elevation="1" class="text-center pa-6">
          <v-avatar color="primary" size="64" class="mb-3">
            <span class="text-h6 font-weight-bold text-white">{{ member.initials }}</span>
          </v-avatar>
          <div class="text-body-1 font-weight-bold">{{ member.name }}</div>
          <div class="text-caption text-medium-emphasis mt-1">{{ member.role }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- University -->
    <v-card color="primary" variant="tonal" rounded="xl" elevation="0">
      <v-card-text class="pa-6">
        <p class="text-overline mb-1">Institution</p>
        <p class="text-h6 font-weight-bold">South Mediterranean University — MedTech</p>
        <p class="text-body-2 text-medium-emphasis mt-1">Program: ISS — Ingénierie des Systèmes et des Services</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      techStack: [
        { icon: 'mdi-coffee',          color: 'warning',   name: 'Spring Boot', desc: 'Java backend' },
        { icon: 'mdi-vuejs',           color: 'success',   name: 'Vue 3',       desc: 'Frontend' },
        { icon: 'mdi-alpha-v-box',     color: 'primary',   name: 'Vuetify 3',   desc: 'UI Library' },
        { icon: 'mdi-database',        color: 'info',      name: 'MySQL',       desc: 'Database' },
        { icon: 'mdi-shield-key',      color: 'secondary', name: 'JWT',         desc: 'Auth' },
        { icon: 'mdi-docker',          color: 'primary',   name: 'Docker',      desc: 'Deployment' },
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
