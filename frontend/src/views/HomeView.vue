<template>
  <div>
    <!-- ── HERO ── -->
    <v-row align="center" class="py-8">
      <v-col cols="12" md="7">
        <v-chip color="primary" variant="tonal" size="small" class="mb-4">
          Smart Vehicle Rental
        </v-chip>
        <h1 class="text-h3 font-weight-bold mb-4">
          Rent Any Vehicle<br />
          <span style="color: rgb(var(--v-theme-primary))">Instantly or By Contract</span>
        </h1>
        <p class="text-body-1 text-medium-emphasis mb-6" style="max-width:480px; line-height:1.8">
          SmartRent gives you full control over your rental experience.
          Jump in now with an instant rental, or plan ahead with a contract.
        </p>
        <div class="d-flex gap-3">
          <v-btn color="primary" size="large" rounded="lg" to="/vehicles" prepend-icon="mdi-car-multiple">
            Browse Fleet
          </v-btn>
          <v-btn v-if="!currentUser" variant="outlined" color="primary" size="large" rounded="lg" to="/login">
            Get Started
          </v-btn>
          <v-btn v-else variant="outlined" color="primary" size="large" rounded="lg" to="/rentals">
            My Rentals
          </v-btn>
        </div>
      </v-col>

      <!-- Rental type info card -->
      <v-col cols="12" md="5">
        <v-card rounded="xl" elevation="2">
          <v-card-text class="pa-6">
            <p class="text-overline text-medium-emphasis mb-3">Rental Models</p>
            <v-list lines="two">
              <v-list-item
                prepend-icon="mdi-lightning-bolt"
                title="Instant Rental"
                subtitle="Start now · End anywhere · Billed per minute"
                rounded="lg"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-icon color="warning" size="32">mdi-lightning-bolt</v-icon>
                </template>
              </v-list-item>
              <v-list-item
                title="Contract Rental"
                subtitle="Choose dates · Admin approves · Billed per day"
                rounded="lg"
              >
                <template v-slot:prepend>
                  <v-icon color="primary" size="32">mdi-file-document-outline</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ── STATS ── -->
    <v-row class="my-4">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" md="3">
        <v-card rounded="xl" elevation="1" class="text-center pa-4">
          <v-icon :color="stat.color" size="36" class="mb-2">{{ stat.icon }}</v-icon>
          <div class="text-h4 font-weight-bold" :style="`color: rgb(var(--v-theme-${stat.color}))`">
            {{ stat.value }}
          </div>
          <div class="text-caption text-medium-emphasis mt-1">{{ stat.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ── HOW IT WORKS ── -->
    <h2 class="text-h5 font-weight-bold mt-8 mb-2">How It Works</h2>
    <p class="text-medium-emphasis mb-6">Two ways to rent — both simple and fast</p>

    <v-row>
      <!-- Instant rental steps -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1">
          <v-card-title class="pa-4 pb-2">
            <v-icon color="warning" class="mr-2">mdi-lightning-bolt</v-icon>
            Instant Rental
          </v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item
                v-for="(step, i) in instantSteps"
                :key="i"
                dot-color="warning"
                size="small"
              >
                <div class="font-weight-medium">{{ step.title }}</div>
                <div class="text-caption text-medium-emphasis">{{ step.desc }}</div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Contract rental steps -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1">
          <v-card-title class="pa-4 pb-2">
            <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
            Contract Rental
          </v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item
                v-for="(step, i) in contractSteps"
                :key="i"
                dot-color="primary"
                size="small"
              >
                <div class="font-weight-medium">{{ step.title }}</div>
                <div class="text-caption text-medium-emphasis">{{ step.desc }}</div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ── ROLES ── -->
    <h2 class="text-h5 font-weight-bold mt-10 mb-6">Who Uses SmartRent?</h2>
    <v-row>
      <v-col v-for="role in roles" :key="role.title" cols="12" md="4">
        <v-card rounded="xl" elevation="1" height="100%">
          <v-card-text class="pa-6">
            <v-icon :color="role.color" size="40" class="mb-3">{{ role.icon }}</v-icon>
            <h3 class="text-h6 font-weight-bold mb-2">{{ role.title }}</h3>
            <p class="text-body-2 text-medium-emphasis">{{ role.desc }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getCurrentUser } from '../store/data.js'

export default {
  name: 'HomeView',
  data() {
    return {
      currentUser: getCurrentUser(),
      stats: [
        { value: '2',    label: 'Rental Models',  icon: 'mdi-swap-horizontal', color: 'primary' },
        { value: '3',    label: 'User Roles',     icon: 'mdi-account-group',   color: 'secondary' },
        { value: '8',    label: 'Vehicles',       icon: 'mdi-car-multiple',    color: 'success' },
        { value: '24/7', label: 'Available',      icon: 'mdi-clock-outline',   color: 'warning' },
      ],
      instantSteps: [
        { title: 'Browse the Fleet',  desc: 'Find an available vehicle near you' },
        { title: 'Start Instantly',   desc: 'One click — no approval needed' },
        { title: 'End Anywhere',      desc: 'Stop when done — price calculated automatically' }
      ],
      contractSteps: [
        { title: 'Choose Your Dates',  desc: 'Pick start and end date for your trip' },
        { title: 'Submit Request',     desc: 'Send your request with delivery details' },
        { title: 'Admin Approves',     desc: 'Get confirmed and pay per day' }
      ],
      roles: [
        { icon: 'mdi-account-outline', color: 'info',      title: 'Visitor',  desc: 'Browse the full vehicle fleet without an account. See availability, pricing, and locations.' },
        { icon: 'mdi-account',         color: 'primary',   title: 'Customer', desc: 'Register to start instant rentals, submit contract requests, and track your rental history.' },
        { icon: 'mdi-shield-account',  color: 'secondary', title: 'Admin',    desc: 'Manage the fleet, approve contract rentals, and monitor all platform activity.' }
      ]
    }
  }
}
</script>
