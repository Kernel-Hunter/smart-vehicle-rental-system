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
      light: {
        dark: false,
        colors: {
          primary:              '#0d9488',
          secondary:            '#0891b2',
          accent:               '#06b6d4',
          background:           '#c8d6e5',
          surface:              '#ffffff',
          'surface-variant':    '#c8d3e0',
          'on-background':      '#0f172a',
          'on-surface':         '#0f172a',
          'on-surface-variant': '#475569',
          'on-primary':         '#ffffff',
          'on-secondary':       '#ffffff',
          error:                '#dc2626',
          success:              '#059669',
          warning:              '#d97706',
          info:                 '#0284c7',
          'on-error':           '#ffffff',
          'on-success':         '#ffffff',
          'on-warning':         '#ffffff',
          'on-info':            '#ffffff',
        }
      },
      dark: {
        dark: true,
        colors: {
          primary:              '#2dd4bf',
          secondary:            '#22d3ee',
          accent:               '#67e8f9',
          background:           '#0a0f1e',
          surface:              '#111827',
          'surface-variant':    '#1e2a3a',
          'on-background':      '#f0f9ff',
          'on-surface':         '#f0f9ff',
          'on-surface-variant': '#94a3b8',
          'on-primary':         '#042f2e',
          'on-secondary':       '#083344',
          error:                '#f87171',
          success:              '#34d399',
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
