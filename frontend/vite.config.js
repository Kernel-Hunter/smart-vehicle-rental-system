import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    // Required for Vuetify to work correctly in production builds
    'process.env': {}
  }
})
