<!-- AboutView.vue -->
<template>
  <div style="max-width:1100px; margin:0 auto; padding:28px 32px;">
    <div class="text-center py-10 reveal">
      <v-chip color="primary" variant="tonal" size="small" class="mb-4">Academic Project</v-chip>
      <h1 style="font-family:'Syne',sans-serif;font-size:clamp(32px,5vw,52px);font-weight:800;margin-bottom:16px;">
        About <span style="color:rgb(var(--v-theme-primary))">SmartRent</span>
      </h1>
      <p style="font-size:16px;color:rgb(var(--v-theme-on-surface-variant));max-width:560px;margin:0 auto;line-height:1.8;">
        Smart Vehicle Rental Marketplace — ISS Project<br />South Mediterranean University · MedTech
      </p>
    </div>

    <!-- Description -->
    <v-card rounded="xl" elevation="1" class="mb-8 reveal reveal-delay-1">
      <v-card-text class="pa-8">
        <p class="text-overline text-primary mb-3">The Project</p>
        <p style="font-size:16px;line-height:1.8;color:rgb(var(--v-theme-on-surface));">
          SmartRent is a two-sided vehicle rental marketplace. Companies register and list their fleets.
          Customers open the map, find nearby available vehicles, and rent them instantly or via scheduled contract.
          Built as part of the ISS curriculum to demonstrate full-stack development, role-based access, and real-world UX patterns.
        </p>
      </v-card-text>
    </v-card>

    <!-- Tech stack -->
    <h2 class="reveal mb-4" style="font-family:'Syne',sans-serif;font-size:26px;font-weight:700;">Tech Stack</h2>
    <v-row class="mb-8">
      <v-col v-for="(t, i) in tech" :key="t.name" cols="6" md="4" lg="2">
        <v-card :class="`hover-lift reveal reveal-delay-${(i%4)+1}`" rounded="xl" elevation="1" class="text-center pa-4">
          <v-icon :color="t.color" size="32" class="mb-2">{{ t.icon }}</v-icon>
          <div style="font-size:13px;font-weight:700;">{{ t.name }}</div>
          <div style="font-size:11px;color:rgb(var(--v-theme-on-surface-variant));margin-top:2px;">{{ t.desc }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Team -->
    <h2 class="reveal mb-4" style="font-family:'Syne',sans-serif;font-size:26px;font-weight:700;">The Team</h2>
    <v-row class="mb-8">
      <v-col v-for="(m, i) in team" :key="m.name" cols="6" md="3">
        <v-card :class="`hover-lift reveal reveal-delay-${i+1}`" rounded="xl" elevation="1" class="text-center pa-6">
          <v-avatar color="primary" size="60" class="mb-3">
            <span style="font-size:20px;font-weight:700;color:white;">{{ m.initials }}</span>
          </v-avatar>
          <div style="font-weight:700;font-size:14px;">{{ m.name }}</div>
          <div style="font-size:12px;color:rgb(var(--v-theme-on-surface-variant));margin-top:3px;">{{ m.role }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- University -->
    <v-card color="primary" variant="tonal" rounded="xl" elevation="0" class="reveal">
      <v-card-text class="pa-6">
        <p class="text-overline mb-1">Institution</p>
        <p style="font-family:'Syne',sans-serif;font-size:20px;font-weight:700;">South Mediterranean University — MedTech</p>
        <p style="font-size:14px;color:rgb(var(--v-theme-on-surface-variant));margin-top:4px;">Program: ISS — Ingénierie des Systèmes et des Services</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useReveal } from '../composables/useReveal.js'
export default {
  name: 'AboutView',
  setup() { return useReveal() },
  data() {
    return {
      tech: [
        { icon: 'mdi-coffee',      color: 'warning',   name: 'Spring Boot', desc: 'Java backend'  },
        { icon: 'mdi-vuejs',       color: 'success',   name: 'Vue 3',       desc: 'Frontend'      },
        { icon: 'mdi-alpha-v-box', color: 'primary',   name: 'Vuetify 3',   desc: 'UI Library'    },
        { icon: 'mdi-database',    color: 'info',      name: 'MySQL',       desc: 'Database'      },
        { icon: 'mdi-shield-key',  color: 'secondary', name: 'JWT',         desc: 'Auth'          },
        { icon: 'mdi-docker',      color: 'primary',   name: 'Docker',      desc: 'Deployment'    },
      ],
      team: [
        { name: 'Karim Masmoudi', initials: 'KM', role: 'Full Stack Developer' },
        { name: 'Bilel Didi',     initials: 'BD', role: 'Full Stack Developer' },
        { name: 'Aziz Zemzmi',    initials: 'AZ', role: 'Full Stack Developer' },
        { name: 'Ahmed Tahri',    initials: 'AT', role: 'Full Stack Developer' },
      ]
    }
  },
  mounted() { this.setupReveal() }
}
</script>
