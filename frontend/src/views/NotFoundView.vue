<template>
  <div style="min-height:calc(100vh - 120px);display:flex;align-items:center;justify-content:center;padding:40px;">
    <div class="text-center reveal">
      <div style="font-family:'Syne',sans-serif;font-size:120px;font-weight:800;line-height:1;color:rgb(var(--v-theme-primary));opacity:0.08;user-select:none;">404</div>
      <v-icon color="primary" size="64" style="margin-top:-80px;position:relative;" class="mb-4">mdi-map-marker-question</v-icon>
      <h1 style="font-family:'Syne',sans-serif;font-size:32px;font-weight:700;margin-bottom:12px;">Page Not Found</h1>
      <p style="color:rgb(var(--v-theme-on-surface-variant));font-size:16px;margin-bottom:32px;">
        The page you're looking for doesn't exist.
      </p>
      <div class="d-flex justify-center gap-3">
        <v-btn color="primary" size="large" rounded="xl" to="/" prepend-icon="mdi-home" elevation="0">Home</v-btn>
        <v-btn variant="outlined" color="primary" size="large" rounded="xl" to="/vehicles" prepend-icon="mdi-car-multiple">Browse Fleet</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { useReveal } from '../composables/useReveal.js'
export default {
  name: 'NotFoundView',
  setup() { return useReveal() },
  mounted() { this.setupReveal() }
}
</script>
