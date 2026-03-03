<template>
  <div class="auth-page">
    <div class="auth-container">

      <!-- ── Brand header ── -->
      <div class="auth-header">
        <span class="auth-icon">◈</span>
        <h1 class="auth-title">SMART<span class="accent">RENT</span></h1>
        <p class="auth-subtitle">Vehicle Rental Management System</p>
      </div>

      <!-- ── Tab switcher: toggles between Login and Register forms ── -->
      <div class="tab-switcher">
        <button
          :class="['tab-btn', activeTab === 'login' ? 'tab-active' : '']"
          @click="activeTab = 'login'"
        >Login</button>
        <button
          :class="['tab-btn', activeTab === 'register' ? 'tab-active' : '']"
          @click="activeTab = 'register'"
        >Register</button>
      </div>

      <!-- ── LOGIN FORM: shown when activeTab === 'login' ── -->
      <form v-if="activeTab === 'login'" @submit.prevent="login" class="auth-form">
        <div class="field">
          <label class="field-label">USERNAME</label>
          <input
            v-model="loginForm.username"
            type="text"
            class="field-input"
            placeholder="Enter username"
            required
          />
        </div>
        <div class="field">
          <label class="field-label">PASSWORD</label>
          <input
            v-model="loginForm.password"
            type="password"
            class="field-input"
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" class="btn-primary">Login</button>
        <!-- Error message shown if login fails -->
        <p v-if="loginError" class="msg-error">{{ loginError }}</p>
      </form>

      <!-- ── REGISTER FORM: shown when activeTab === 'register' ── -->
      <form v-if="activeTab === 'register'" @submit.prevent="register" class="auth-form">
        <div class="field">
          <label class="field-label">USERNAME</label>
          <input
            v-model="registerForm.username"
            type="text"
            class="field-input"
            placeholder="Choose a username"
            required
          />
        </div>
        <div class="field">
          <label class="field-label">EMAIL</label>
          <input
            v-model="registerForm.email"
            type="email"
            class="field-input"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="field">
          <label class="field-label">PASSWORD</label>
          <input
            v-model="registerForm.password"
            type="password"
            class="field-input"
            placeholder="Choose a password"
            required
          />
        </div>
        <button type="submit" class="btn-primary">Create Account</button>
        <!-- Message changes color: green on success, red on failure -->
        <p v-if="registerMessage" :class="registerSuccess ? 'msg-success' : 'msg-error'">
          {{ registerMessage }}
        </p>
      </form>

    </div>
  </div>
</template>

<script>
import axios from 'axios' // HTTP client for API calls

export default {
  name: 'LoginView',

  data() {
    return {
      activeTab: 'login',  // Controls which form is visible: 'login' or 'register'

      // Bound to the login form inputs via v-model
      loginForm: { username: '', password: '' },

      // Bound to the register form inputs via v-model
      registerForm: { username: '', email: '', password: '' },

      loginError: '',       // Shown below login form on failure
      registerMessage: '',  // Shown below register form (success or failure)
      registerSuccess: false // Controls message color: true = green, false = red
    }
  },

  methods: {
    async login() {
      this.loginError = '' // Clear previous errors before trying again
      try {
        // POST credentials to backend auth endpoint
        const res = await axios.post('http://localhost:8080/api/auth/login', this.loginForm)

        // Store JWT token and user info in localStorage for use across all pages
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
        localStorage.setItem('role', res.data.role)

        // Redirect based on role: ADMIN goes to dashboard, others go to vehicles
        this.$router.push(res.data.role === 'ADMIN' ? '/admin' : '/vehicles')
      } catch (err) {
        // Show error from backend, or a generic fallback message
        this.loginError = err.response?.data?.message || 'Login failed. Check your credentials.'
      }
    },

    async register() {
      this.registerMessage = ''
      try {
        // POST new user data to backend registration endpoint
        await axios.post('http://localhost:8080/api/auth/register', this.registerForm)

        // Success: show green message and clear the form fields
        this.registerMessage = 'Account created successfully. You can now log in.'
        this.registerSuccess = true
        this.registerForm = { username: '', email: '', password: '' }
      } catch (err) {
        // Failure: show red error message
        this.registerMessage = err.response?.data?.message || 'Registration failed.'
        this.registerSuccess = false
      }
    }
  }
}
</script>

<style scoped>
/* ── Center the auth card vertically and horizontally ── */
.auth-page {
  min-height: calc(100vh - 60px); /* Subtract topbar height */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── The card itself ── */
.auth-container {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 48px 44px;
  width: 100%;
  max-width: 420px;
}

/* ── Brand section at top of card ── */
.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-icon {
  font-size: 32px;
  color: #3b82f6;
  display: block;
  margin-bottom: 10px;
}

.auth-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #e2e8f0;
}

.accent { color: #3b82f6; }

.auth-subtitle {
  color: #475569;
  font-size: 12px;
  margin-top: 6px;
  letter-spacing: 1px;
}

/* ── Tab switcher ── */
.tab-switcher {
  display: flex;
  background: #0d0f14;
  border: 1px solid #1e2535;
  border-radius: 6px;
  padding: 3px;
  margin-bottom: 28px;
}

.tab-btn {
  flex: 1;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #475569;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s;
}

/* Active tab gets highlighted background and blue text */
.tab-active {
  background: #1e2535;
  color: #3b82f6;
}

/* ── Form layout ── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Small uppercase label above each input */
.field-label {
  font-size: 11px;
  letter-spacing: 2px;
  color: #475569;
}

/* Input field: dark background, blue border on focus */
.field-input {
  background: #0d0f14;
  border: 1px solid #1e2535;
  border-radius: 4px;
  padding: 10px 14px;
  color: #c8d0e0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.field-input:focus { border-color: #3b82f6; }
.field-input::placeholder { color: #2a3548; }

/* Primary submit button */
.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s;
}
.btn-primary:hover { background: #2563eb; }

/* Feedback messages */
.msg-error   { color: #ef4444; font-size: 13px; }
.msg-success { color: #22c55e; font-size: 13px; }
</style>