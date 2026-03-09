<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-2">User Management</h2>
    <p class="text-medium-emphasis text-body-2 mb-6">All registered users on the platform</p>

    <!-- Stats row -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card rounded="xl" elevation="1" class="text-center pa-4">
          <div class="text-h4 font-weight-bold text-primary">{{ users.length }}</div>
          <div class="text-caption text-medium-emphasis mt-1">Total Users</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card rounded="xl" elevation="1" class="text-center pa-4">
          <div class="text-h4 font-weight-bold text-success">{{ customerCount }}</div>
          <div class="text-caption text-medium-emphasis mt-1">Customers</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card rounded="xl" elevation="1" class="text-center pa-4">
          <div class="text-h4 font-weight-bold text-secondary">{{ adminCount }}</div>
          <div class="text-caption text-medium-emphasis mt-1">Admins</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Users table -->
    <v-card rounded="xl" elevation="1">
      <v-data-table :headers="headers" :items="users" :items-per-page="10" rounded="xl">
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="item.role === 'ADMIN' ? 'secondary' : 'primary'"
            variant="tonal"
            size="small"
          >
            <v-icon start size="12">
              {{ item.role === 'ADMIN' ? 'mdi-shield-account' : 'mdi-account' }}
            </v-icon>
            {{ item.role }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { getUsers } from '../store/data.js'

export default {
  name: 'AdminUsersView',
  data() {
    return {
      users: getUsers(),
      headers: [
        { title: 'ID',       key: 'id',       width: '60px' },
        { title: 'Username', key: 'username'  },
        { title: 'Email',    key: 'email'     },
        { title: 'Role',     key: 'role'      },
      ]
    }
  },
  computed: {
    customerCount() { return this.users.filter(u => u.role === 'CUSTOMER').length },
    adminCount()    { return this.users.filter(u => u.role === 'ADMIN').length }
  }
}
</script>
