<template>
  <div class="notfound-page">
    <div class="notfound-content">
      <!-- Large 404 display -->
      <p class="error-code">404</p>
      <h1 class="error-title">Page Not Found</h1>
      <p class="error-desc">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="error-btns">
        <router-link to="/vehicles" class="btn-primary">Go to Fleet</router-link>
        <router-link to="/" class="btn-ghost">Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
  // No logic needed — purely a static display page
}
</script>

<style scoped>
/* Full height centered layout */
.notfound-page {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notfound-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Giant 404 number */
.error-code {
  font-family: 'Rajdhani', sans-serif;
  font-size: 120px;
  font-weight: 700;
  color: #1e2535;
  line-height: 1;
  letter-spacing: 8px;
  /* Blue left border accent */
  border-left: 6px solid #3b82f6;
  padding-left: 24px;
}

.error-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.error-desc {
  color: #475569;
  font-size: 14px;
  max-width: 360px;
  line-height: 1.6;
}

.error-btns {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
  padding: 11px 28px;
  border-radius: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  letter-spacing: 1px;
  transition: background 0.2s;
}
.btn-primary:hover { background: #2563eb; }

.btn-ghost {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #1e3a5f;
  padding: 11px 28px;
  border-radius: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-ghost:hover { background: #0f1a2e; }
</style>
