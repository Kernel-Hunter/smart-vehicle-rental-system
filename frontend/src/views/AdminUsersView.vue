<template>
  <div>
    <!-- Page header -->
    <div class="page-header">
      <div>
        <h2 class="page-title">User Management</h2>
        <p class="page-sub">All registered users on the platform</p>
      </div>
      <button class="btn-refresh" @click="fetchUsers">↻ Refresh</button>
    </div>

    <p v-if="error" class="msg-error">{{ error }}</p>

    <!-- Summary stats -->
    <div class="stats-row">
      <div class="stat-card">
        <p class="stat-value">{{ users.length }}</p>
        <p class="stat-label">TOTAL USERS</p>
      </div>
      <div class="stat-card">
        <p class="stat-value">{{ customerCount }}</p>
        <p class="stat-label">CUSTOMERS</p>
      </div>
      <div class="stat-card">
        <p class="stat-value">{{ adminCount }}</p>
        <p class="stat-label">ADMINS</p>
      </div>
    </div>

    <!-- Users table -->
    <div v-if="users.length" class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td class="id-cell">#{{ u.id }}</td>
            <td class="name-cell">{{ u.username }}</td>
            <td class="email-cell">{{ u.email }}</td>
            <td>
              <!-- Role badge: blue for ADMIN, gray for CUSTOMER -->
              <span :class="['role-badge', u.role === 'ADMIN' ? 'role-admin' : 'role-customer']">
                {{ u.role }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="!loading" class="status-text">No users found.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AdminUsersView',

  data() {
    return {
      users: [],      // All registered users
      loading: false,
      error: ''
    }
  },

  computed: {
    // Count users by role for the stats row
    customerCount() { return this.users.filter(u => u.role === 'CUSTOMER').length },
    adminCount()    { return this.users.filter(u => u.role === 'ADMIN').length }
  },

  mounted() { this.fetchUsers() },

  methods: {
    auth() {
      return { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    },

    // Fetches all users — admin-only endpoint
    async fetchUsers() {
      this.loading = true
      this.error = ''
      try {
        const res = await axios.get('http://localhost:8080/api/users', this.auth())
        this.users = res.data
      } catch {
        this.error = 'Failed to load users.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.page-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 2px;
}
.page-sub { color: #475569; font-size: 13px; margin-top: 4px; }

.btn-refresh {
  background: transparent;
  border: 1px solid #1e2535;
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-refresh:hover { background: #0f1a2e; }

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #13161e;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
}

.stat-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label { color: #475569; font-size: 11px; letter-spacing: 2px; margin-top: 4px; }

/* Table */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #1e2535;
  border-radius: 8px;
}

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }

.data-table thead tr {
  background: #0d0f14;
  border-bottom: 1px solid #1e2535;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  color: #475569;
  font-size: 11px;
  letter-spacing: 1px;
}

.data-table tbody tr {
  border-bottom: 1px solid #1a1e2a;
  transition: background 0.15s;
}
.data-table tbody tr:hover { background: #13161e; }
.data-table tbody tr:last-child { border-bottom: none; }

.data-table td { padding: 14px 16px; color: #94a3b8; vertical-align: middle; }

.id-cell    { color: #3b82f6; font-size: 12px; }
.name-cell  { color: #e2e8f0; font-weight: 500; }
.email-cell { color: #64748b; font-size: 12px; }

/* Role badges */
.role-badge {
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 1px;
}
.role-admin    { background: #0c1a3a; color: #60a5fa; border: 1px solid #1e3a5f; }
.role-customer { background: #1a1e2a; color: #64748b; border: 1px solid #2a3548; }

.msg-error   { color: #ef4444; font-size: 13px; margin-bottom: 16px; }
.status-text { color: #475569; font-size: 13px; }
</style>
