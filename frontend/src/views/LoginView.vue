<template>
  <v-row justify="center" class="mt-8">
    <v-col cols="12" sm="8" md="5" lg="4">

      <!-- Card container -->
      <v-card rounded="xl" elevation="3">
        <v-card-text class="pa-8">

          <!-- Header -->
          <div class="text-center mb-6">
            <v-icon size="48" color="primary">mdi-car-key</v-icon>
            <h1 class="text-h5 font-weight-bold mt-2">SmartRent</h1>
            <p class="text-medium-emphasis text-body-2 mt-1">
              Vehicle Rental Management System
            </p>
          </div>

          <!-- Tab switcher between Login and Register -->
          <v-tabs v-model="activeTab" color="primary" grow class="mb-6">
            <v-tab value="login">Login</v-tab>
            <v-tab value="register">Register</v-tab>
          </v-tabs>

          <!-- LOGIN FORM -->
          <v-window v-model="activeTab">
            <v-window-item value="login">
              <v-form @submit.prevent="login">
                <v-text-field
                  v-model="loginForm.username"
                  label="Username"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  required
                />
                <v-text-field
                  v-model="loginForm.password"
                  label="Password"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  required
                />

                <!-- Error alert -->
                <v-alert v-if="loginError" type="error" variant="tonal" class="mb-4" density="compact">
                  {{ loginError }}
                </v-alert>

                <v-btn type="submit" color="primary" block size="large" rounded="lg">
                  Login
                </v-btn>
              </v-form>

              <!-- Demo credentials hint -->
              <v-card variant="tonal" color="primary" class="mt-4 pa-3" rounded="lg">
                <p class="text-caption font-weight-bold mb-1">Demo Credentials</p>
                <p class="text-caption">Admin: admin / admin123</p>
                <p class="text-caption">Customer: karim / karim123</p>
              </v-card>
            </v-window-item>

            <!-- REGISTER FORM -->
            <v-window-item value="register">
              <v-form @submit.prevent="register">
                <v-text-field
                  v-model="registerForm.username"
                  label="Username"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  required
                />
                <v-text-field
                  v-model="registerForm.email"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  required
                />
                <v-text-field
                  v-model="registerForm.password"
                  label="Password"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  required
                />

                <v-alert v-if="registerMessage" :type="registerSuccess ? 'success' : 'error'" variant="tonal" class="mb-4" density="compact">
                  {{ registerMessage }}
                </v-alert>

                <v-btn type="submit" color="primary" block size="large" rounded="lg">
                  Create Account
                </v-btn>
              </v-form>
            </v-window-item>
          </v-window>

        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { loginUser, registerUser, setCurrentUser } from '../store/data.js'

export default {
  name: 'LoginView',
  data() {
    return {
      activeTab: 'login',
      showPassword: false,
      loginForm:    { username: '', password: '' },
      registerForm: { username: '', email: '', password: '' },
      loginError:      '',
      registerMessage: '',
      registerSuccess: false
    }
  },
  methods: {
    login() {
      this.loginError = ''
      // Find user in localStorage data store
      const user = loginUser(this.loginForm.username, this.loginForm.password)
      if (!user) {
        this.loginError = 'Invalid username or password.'
        return
      }
      // Store current user in sessionStorage
      setCurrentUser(user)
      // Redirect based on role
      this.$router.push(user.role === 'ADMIN' ? '/admin' : '/vehicles')
    },

    register() {
      this.registerMessage = ''
      const user = registerUser(
        this.registerForm.username,
        this.registerForm.email,
        this.registerForm.password
      )
      if (!user) {
        this.registerMessage = 'Username already taken. Choose another.'
        this.registerSuccess = false
        return
      }
      this.registerMessage = 'Account created! You can now log in.'
      this.registerSuccess = true
      this.registerForm = { username: '', email: '', password: '' }
      // Switch to login tab after successful registration
      setTimeout(() => { this.activeTab = 'login' }, 1500)
    }
  }
}
</script>
