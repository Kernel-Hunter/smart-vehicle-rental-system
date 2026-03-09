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
          primary:    '#5C6BC0',
          secondary:  '#7E57C2',
          accent:     '#9575CD',
          background: '#F8F7FF',
          surface:    '#FFFFFF',
          error:      '#EF5350',
          success:    '#43A047',
          warning:    '#FB8C00',
          info:       '#039BE5',
        }
      },
      dark: {
        dark: true,
        colors: {
          primary:    '#7986CB',
          secondary:  '#9575CD',
          accent:     '#B39DDB',
          background: '#0F0E17',
          surface:    '#1A1825',
          error:      '#EF5350',
          success:    '#43A047',
          warning:    '#FB8C00',
          info:       '#039BE5',
        }
      }
    }
  }
})

createApp(App).use(router).use(vuetify).mount('#app')
