<template>
  <div class="login-page">
    <div class="login-bg-orb" />

    <v-row justify="center" align="center" class="min-h-screen">
      <v-col cols="12" sm="9" md="6" lg="4">

        <div class="login-card reveal">
          <!-- Header -->
          <div class="login-header">
            <div class="login-logo">
              <v-icon color="primary" size="28">mdi-car-multiple</v-icon>
            </div>
            <h1 class="login-title">SmartRent</h1>
            <p class="login-sub">Vehicle Rental Marketplace</p>
          </div>

          <!-- Tabs -->
          <v-tabs v-model="activeTab" color="primary" grow class="mb-6" density="comfortable">
            <v-tab value="customer">
              <v-icon start size="16">mdi-account</v-icon>Customer
            </v-tab>
            <v-tab value="company">
              <v-icon start size="16">mdi-domain</v-icon>Company
            </v-tab>
            <v-tab value="register">
              <v-icon start size="16">mdi-account-plus</v-icon>Register
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">

            <!-- ── CUSTOMER LOGIN ── -->
            <v-window-item value="customer">
              <v-form @submit.prevent="loginAsCustomer">
                <v-text-field
                  v-model="loginForm.username"
                  label="Username"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  rounded="lg"
                />
                <v-text-field
                  v-model="loginForm.password"
                  label="Password"
                  prepend-inner-icon="mdi-lock-outline"
                  :type="showPwd ? 'text' : 'password'"
                  :append-inner-icon="showPwd ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPwd = !showPwd"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  rounded="lg"
                />
                <v-alert v-if="loginError" type="error" variant="tonal" density="compact" rounded="lg" class="mb-4">
                  {{ loginError }}
                </v-alert>
                <v-btn type="submit" color="primary" block size="large" rounded="xl" elevation="0" class="mb-4">
                  Login as Customer
                </v-btn>
              </v-form>

              <!-- Demo hint -->
              <v-card variant="tonal" color="primary" rounded="xl" class="pa-4">
                <p class="text-caption font-weight-bold mb-2">Demo Accounts</p>
                <div class="demo-list">
                  <div v-for="d in customerDemos" :key="d.user" class="demo-item" @click="fillCustomer(d)">
                    <v-icon size="12" color="primary">mdi-account</v-icon>
                    <span>{{ d.user }}</span>
                    <v-chip size="x-small" color="primary" variant="outlined">click to fill</v-chip>
                  </div>
                </div>
              </v-card>
            </v-window-item>

            <!-- ── COMPANY LOGIN ── -->
            <v-window-item value="company">
              <v-form @submit.prevent="loginAsCompany">
                <v-text-field
                  v-model="companyLoginForm.username"
                  label="Company Username"
                  prepend-inner-icon="mdi-domain"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  rounded="lg"
                />
                <v-text-field
                  v-model="companyLoginForm.password"
                  label="Password"
                  prepend-inner-icon="mdi-lock-outline"
                  :type="showPwd2 ? 'text' : 'password'"
                  :append-inner-icon="showPwd2 ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPwd2 = !showPwd2"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  rounded="lg"
                />
                <v-alert v-if="companyLoginError" type="error" variant="tonal" density="compact" rounded="lg" class="mb-4">
                  {{ companyLoginError }}
                </v-alert>
                <v-btn type="submit" color="secondary" block size="large" rounded="xl" elevation="0" class="mb-4">
                  Login as Company
                </v-btn>
              </v-form>

              <v-card variant="tonal" color="secondary" rounded="xl" class="pa-4">
                <p class="text-caption font-weight-bold mb-2">Demo Company Accounts</p>
                <div class="demo-list">
                  <div v-for="d in companyDemos" :key="d.user" class="demo-item" @click="fillCompany(d)">
                    <v-icon size="12" color="secondary">mdi-domain</v-icon>
                    <span>{{ d.user }}</span>
                    <v-chip size="x-small" color="secondary" variant="outlined">click to fill</v-chip>
                  </div>
                </div>
              </v-card>
            </v-window-item>

            <!-- ── REGISTER ── -->
            <v-window-item value="register">
              <!-- Toggle: Customer or Company registration -->
              <div class="register-toggle mb-4">
                <div
                  :class="['toggle-option', { active: registerAs === 'customer' }]"
                  @click="registerAs = 'customer'"
                >
                  <v-icon size="16">mdi-account</v-icon> Customer
                </div>
                <div
                  :class="['toggle-option', { active: registerAs === 'company' }]"
                  @click="registerAs = 'company'"
                >
                  <v-icon size="16">mdi-domain</v-icon> Company
                </div>
              </div>

              <!-- Customer register form -->
              <v-form v-if="registerAs === 'customer'" @submit.prevent="registerCustomer">
                <v-text-field v-model="regCustomer.fullName" label="Full Name" prepend-inner-icon="mdi-account-outline" variant="outlined" density="comfortable" class="mb-3" rounded="lg" />
                <v-text-field v-model="regCustomer.username" label="Username" prepend-inner-icon="mdi-at" variant="outlined" density="comfortable" class="mb-3" rounded="lg" />
                <v-text-field v-model="regCustomer.email" label="Email" type="email" prepend-inner-icon="mdi-email-outline" variant="outlined" density="comfortable" class="mb-3" rounded="lg" />
                <v-text-field v-model="regCustomer.password" label="Password" type="password" prepend-inner-icon="mdi-lock-outline" variant="outlined" density="comfortable" class="mb-4" rounded="lg" />
                <v-alert v-if="regMsg" :type="regSuccess ? 'success' : 'error'" variant="tonal" density="compact" rounded="lg" class="mb-4">{{ regMsg }}</v-alert>
                <v-btn type="submit" color="primary" block size="large" rounded="xl" elevation="0">Create Customer Account</v-btn>
              </v-form>

              <!-- Company register form -->
              <v-form v-else @submit.prevent="registerCompanyFn">
                <v-text-field v-model="regCompany.companyName" label="Company Name" prepend-inner-icon="mdi-domain" variant="outlined" density="comfortable" class="mb-3" rounded="lg" />
                <v-text-field v-model="regCompany.username" label="Username" prepend-inner-icon="mdi-at" variant="outlined" density="comfortable" class="mb-3" rounded="lg" />
                <v-text-field v-model="regCompany.email" label="Email" type="email" prepend-inner-icon="mdi-email-outline" variant="outlined" density="comfortable" class="mb-3" rounded="lg" />
                <v-select v-model="regCompany.city" label="City" :items="['Tunis', 'Sousse', 'Sfax', 'Bizerte', 'Monastir']" prepend-inner-icon="mdi-map-marker" variant="outlined" density="comfortable" class="mb-3" rounded="lg" />
                <v-textarea v-model="regCompany.description" label="Company Description" prepend-inner-icon="mdi-text" variant="outlined" density="comfortable" class="mb-3" rounded="lg" rows="2" />
                <v-text-field v-model="regCompany.password" label="Password" type="password" prepend-inner-icon="mdi-lock-outline" variant="outlined" density="comfortable" class="mb-4" rounded="lg" />
                <v-alert v-if="regMsg" :type="regSuccess ? 'success' : 'error'" variant="tonal" density="compact" rounded="lg" class="mb-4">{{ regMsg }}</v-alert>
                <v-btn type="submit" color="secondary" block size="large" rounded="xl" elevation="0">Register Company</v-btn>
              </v-form>
            </v-window-item>

          </v-window>
        </div>

      </v-col>
    </v-row>
  </div>
</template>

<script>
import { loginUser, setCurrentUser, registerCustomer, registerCompany } from '../store/data.js'
import { useReveal } from '../composables/useReveal.js'

export default {
  name: 'LoginView',
  setup() { return useReveal() },
  data() {
    return {
      activeTab:  'customer',
      registerAs: 'customer',
      showPwd:  false,
      showPwd2: false,
      loginForm:        { username: '', password: '' },
      companyLoginForm: { username: '', password: '' },
      regCustomer: { fullName: '', username: '', email: '', password: '' },
      regCompany:  { companyName: '', username: '', email: '', city: '', description: '', password: '' },
      loginError:       '',
      companyLoginError:'',
      regMsg:     '',
      regSuccess: false,
      customerDemos: [
        { user: 'karim', pass: 'karim123' },
        { user: 'bilel', pass: 'bilel123' },
      ],
      companyDemos: [
        { user: 'autoplus',  pass: 'company123' },
        { user: 'drivefast', pass: 'company123' },
        { user: 'luxauto',   pass: 'company123' },
      ]
    }
  },
  mounted() { this.setupReveal() },
  methods: {
    fillCustomer(d) { this.loginForm.username = d.user; this.loginForm.password = d.pass },
    fillCompany(d)  { this.companyLoginForm.username = d.user; this.companyLoginForm.password = d.pass },

    loginAsCustomer() {
      this.loginError = ''
      const user = loginUser(this.loginForm.username, this.loginForm.password, 'CUSTOMER')
      if (!user) { this.loginError = 'Invalid username or password.'; return }
      setCurrentUser(user)
      this.$router.push('/vehicles')
    },

    loginAsCompany() {
      this.companyLoginError = ''
      const user = loginUser(this.companyLoginForm.username, this.companyLoginForm.password, 'COMPANY')
      if (!user) { this.companyLoginError = 'Invalid company credentials.'; return }
      setCurrentUser(user)
      this.$router.push('/company')
    },

    registerCustomer() {
      this.regMsg = ''
      const user = registerCustomer(this.regCustomer.username, this.regCustomer.email, this.regCustomer.password, this.regCustomer.fullName)
      if (!user) { this.regMsg = 'Username already taken.'; this.regSuccess = false; return }
      this.regMsg = 'Account created! You can now log in.'; this.regSuccess = true
      setTimeout(() => { this.activeTab = 'customer' }, 1500)
    },

    registerCompanyFn() {
      this.regMsg = ''
      const company = registerCompany(this.regCompany.username, this.regCompany.companyName, this.regCompany.email, this.regCompany.password, this.regCompany.city, this.regCompany.description)
      if (!company) { this.regMsg = 'Username already taken.'; this.regSuccess = false; return }
      this.regMsg = 'Company registered! You can now log in.'; this.regSuccess = true
      setTimeout(() => { this.activeTab = 'company' }, 1500)
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 40px 16px;
}

.login-bg-orb {
  position: absolute;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(92, 107, 192, 0.1), transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.login-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(92, 107, 192, 0.12);
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 20px 60px rgba(92, 107, 192, 0.08);
}

.login-header { text-align: center; margin-bottom: 28px; }

.login-logo {
  width: 56px; height: 56px;
  border-radius: 16px;
  background: rgba(92, 107, 192, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.login-title {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 4px;
}

.login-sub { font-size: 13px; color: rgb(var(--v-theme-on-surface-variant)); }

/* Demo list */
.demo-list { display: flex; flex-direction: column; gap: 6px; }
.demo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.demo-item:hover { background: rgba(92, 107, 192, 0.1); }

/* Register toggle */
.register-toggle {
  display: flex;
  background: rgba(92, 107, 192, 0.07);
  border-radius: 12px;
  padding: 4px;
}
.toggle-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface-variant));
  transition: background 0.2s, color 0.2s;
}
.toggle-option.active {
  background: rgb(var(--v-theme-primary));
  color: white;
}
</style>
