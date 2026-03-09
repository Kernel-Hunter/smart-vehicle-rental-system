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

      // ── LIGHT THEME ──
      light: {
        dark: false,
        colors: {
          primary:              '#4F46E5',
          secondary:            '#7C3AED',
          accent:               '#A78BFA',
          background:           '#F9FAFB',
          surface:              '#FFFFFF',
          'surface-variant':    '#F3F4F6',
          'on-background':      '#111827',
          'on-surface':         '#111827',
          'on-surface-variant': '#6B7280',
          'on-primary':         '#FFFFFF',
          'on-secondary':       '#FFFFFF',
          error:                '#DC2626',
          success:              '#16A34A',
          warning:              '#D97706',
          info:                 '#0284C7',
        }
      },

      // ── DARK THEME ──
      dark: {
        dark: true,
        colors: {
          primary:              '#818CF8',
          secondary:            '#A78BFA',
          accent:               '#C4B5FD',
          background:           '#0F0F14',
          surface:              '#18181F',
          'surface-variant':    '#23232E',
          'on-background':      '#F9FAFB',
          'on-surface':         '#F9FAFB',
          'on-surface-variant': '#9CA3AF',
          'on-primary':         '#1E1B4B',
          'on-secondary':       '#2E1065',
          error:                '#F87171',
          success:              '#4ADE80',
          warning:              '#FBBF24',
          info:                 '#38BDF8',
        }
      }
    }
  }
})

createApp(App).use(router).use(vuetify).mount('#app')
