import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: localStorage.getItem('sr_theme') || 'light',
    themes: {

      // ── LIGHT: clean white with deep indigo accents ──
      light: {
        dark: false,
        colors: {
          primary:              '#4338ca', // deep indigo
          secondary:            '#6d28d9', // violet
          accent:               '#7c3aed',
          background:           '#f7f8fc', // very light cool gray
          surface:              '#ffffff',
          'surface-variant':    '#eef0f8',
          // These 'on-*' values are what Vuetify uses for text on those surfaces
          'on-background':      '#1a1a2e',
          'on-surface':         '#1a1a2e',
          'on-surface-variant': '#4a5568',
          'on-primary':         '#ffffff',
          'on-secondary':       '#ffffff',
          error:                '#c0392b',
          success:              '#16a34a',
          warning:              '#b45309',
          info:                 '#0369a1',
          'on-error':           '#ffffff',
          'on-success':         '#ffffff',
          'on-warning':         '#ffffff',
          'on-info':            '#ffffff',
        }
      },

      // ── DARK: deep navy with bright indigo accents ──
      dark: {
        dark: true,
        colors: {
          primary:              '#818cf8', // bright indigo — readable on dark
          secondary:            '#a78bfa', // bright violet
          accent:               '#c4b5fd',
          background:           '#0c0c14',
          surface:              '#13131c',
          'surface-variant':    '#1c1c28',
          'on-background':      '#e8e8f5',
          'on-surface':         '#e8e8f5',
          'on-surface-variant': '#94a3b8',
          'on-primary':         '#1e1b4b',
          'on-secondary':       '#2e1065',
          error:                '#f87171',
          success:              '#4ade80',
          warning:              '#fbbf24',
          info:                 '#38bdf8',
          'on-error':           '#1a0000',
          'on-success':         '#022c22',
          'on-warning':         '#1c1000',
          'on-info':            '#001a2e',
        }
      }
    }
  }
})

createApp(App).use(router).use(vuetify).mount('#app')
