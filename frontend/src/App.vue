<template>
  <div class="app-shell">
    <!-- ── Top navigation bar: sticky, always visible on every page ── -->
    <header class="topbar">

      <!-- Brand logo on the left -->
      <div class="topbar-brand">
        <span class="brand-icon">◈</span>
        <span class="brand-name">SMART<span class="brand-accent">RENT</span></span>
      </div>

      <!-- Center nav links -->
      <nav class="topbar-nav">
        <!-- Always visible: anyone can browse vehicles -->
        <router-link to="/vehicles" class="nav-link">Vehicles</router-link>

        <!-- Only shown when user is logged in -->
        <router-link v-if="isLoggedIn" to="/rentals" class="nav-link">My Rentals</router-link>

        <!-- Only shown when role is ADMIN -->
        <router-link v-if="isAdmin" to="/admin" class="nav-link">Admin</router-link>
      </nav>

      <!-- Right side: user info or login button -->
      <div class="topbar-user">
        <!-- If logged in: show role badge, username, and logout button -->
        <span v-if="isLoggedIn" class="user-info">
          <span class="user-badge">{{ role }}</span>
          {{ username }}
          <button class="btn-logout" @click="logout">Logout</button>
        </span>

        <!-- If NOT logged in: show login/register link -->
        <router-link v-else to="/login" class="btn-login">Login / Register</router-link>
      </div>

    </header>

    <!-- ── Main content area: router-view renders the current page ── -->
    <main class="page-content">
      <router-view />
    </main>

  </div>
</template>

<script>
export default {
  name: 'App',

  computed: {
    // True if a JWT token exists in localStorage (user is authenticated)
    isLoggedIn() { return !!localStorage.getItem('token') },

    // Username saved to localStorage after successful login
    username() { return localStorage.getItem('username') || '' },

    // Role saved to localStorage: either 'CUSTOMER' or 'ADMIN'
    role() { return localStorage.getItem('role') || '' },

    // True only if role is ADMIN — controls Admin nav link visibility
    isAdmin() { return localStorage.getItem('role') === 'ADMIN' }
  },

  methods: {
    // Logout: wipe all stored auth data and redirect to login page
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* ── Google Fonts: Rajdhani for headings, IBM Plex Mono for body/data ── */
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

/* ── Global resets applied to the whole page via :global ── */
:global(*, *::before, *::after) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:global(body) {
  background-color: #0d0f14;  /* Deep dark background */
  color: #c8d0e0;
  font-family: 'IBM Plex Mono', monospace;
  min-height: 100vh;
}

:global(a) { text-decoration: none; }

/* ── App shell: full height column layout ── */
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Top bar ── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 60px;
  background: #13161e;             /* Slightly lighter than page background */
  border-bottom: 1px solid #1e2535;
  position: sticky;                /* Stays at top when scrolling */
  top: 0;
  z-index: 100;                    /* Always above page content */
}

/* Brand area */
.topbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  font-size: 22px;
  color: #3b82f6;  /* Blue accent */
}

.brand-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #e2e8f0;
}

/* The RENT part of SMARTRENT is blue */
.brand-accent { color: #3b82f6; }

/* ── Nav links ── */
.topbar-nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'IBM Plex Mono', monospace;
  color: #94a3b8;
  letter-spacing: 1px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

/* Active page link and hover both get blue highlight */
.nav-link:hover,
.nav-link.router-link-active {
  color: #3b82f6;
  border-color: #1e3a5f;
  background: #0f1a2e;
}

/* ── User area (right side) ── */
.topbar-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #94a3b8;
}

/* Role badge: small tag showing CUSTOMER or ADMIN */
.user-badge {
  background: #0f1a2e;
  border: 1px solid #1e3a5f;
  color: #3b82f6;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 1px;
}

/* Logout button: subtle until hovered, then turns red */
.btn-logout {
  background: transparent;
  border: 1px solid #2a3548;
  color: #64748b;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  transition: all 0.2s;
}
.btn-logout:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Login button: solid blue pill */
.btn-login {
  background: #3b82f6;
  color: #fff;
  padding: 7px 18px;
  border-radius: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.2s;
}
.btn-login:hover { background: #2563eb; }

/* ── Page content area ── */
.page-content {
  flex: 1;                   /* Takes remaining vertical space */
  padding: 36px 40px;
  max-width: 1280px;         /* Prevents content from stretching too wide */
  width: 100%;
  margin: 0 auto;            /* Centers content horizontally */
}
</style>