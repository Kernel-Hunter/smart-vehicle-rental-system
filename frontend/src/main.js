// Entry point — sets up Vue app with Vuetify and Router
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

// Vuetify core + styles
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Material Design Icons (used by Vuetify for all icons)
import '@mdi/font/css/materialdesignicons.css'

// Create Vuetify instance with light and dark theme definitions
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', // App starts in light mode
    themes: {
      // ── Light theme ──
      light: {
        dark: false,
        colors: {
          primary:    '#5C6BC0', // Indigo
          secondary:  '#7E57C2', // Purple
          accent:     '#9575CD',
          background: '#F5F5F5',
          surface:    '#FFFFFF',
          error:      '#EF5350',
          success:    '#66BB6A',
          warning:    '#FFA726',
          info:       '#42A5F5',
        }
      },
      // ── Dark theme ──
      dark: {
        dark: true,
        colors: {
          primary:    '#7986CB', // Lighter indigo for dark bg
          secondary:  '#9575CD',
          accent:     '#B39DDB',
          background: '#121212',
          surface:    '#1E1E1E',
          error:      '#EF5350',
          success:    '#66BB6A',
          warning:    '#FFA726',
          info:       '#42A5F5',
        }
      }
    }
  }
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
