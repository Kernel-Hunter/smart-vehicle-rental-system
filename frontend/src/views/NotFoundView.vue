<template>
  <v-row justify="center" align="center" style="min-height: calc(100vh - 120px)">
    <v-col cols="12" sm="8" md="5" class="text-center">
      <div class="text-h1 font-weight-bold text-primary mb-2" style="opacity: 0.15; font-size: 8rem">
        404
      </div>
      <v-icon color="primary" size="64" class="mb-4" style="margin-top: -80px; position: relative;">
        mdi-map-marker-question
      </v-icon>
      <h1 class="text-h4 font-weight-bold mb-3">Page Not Found</h1>
      <p class="text-medium-emphasis text-body-1 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="d-flex justify-center gap-3">
        <v-btn color="primary" size="large" rounded="lg" to="/vehicles" prepend-icon="mdi-car-multiple">
          Browse Fleet
        </v-btn>
        <v-btn variant="outlined" color="primary" size="large" rounded="lg" to="/" prepend-icon="mdi-home">
          Home
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default { name: 'NotFoundView' }
</script>
```

---

## Full file checklist — everything to create/replace
```
src/
├── main.js                          ← REPLACE
├── App.vue                          ← REPLACE
├── store/
│   └── data.js                      ← NEW FILE (create store/ folder)
├── router/
│   └── index.js                     ← REPLACE
└── views/
    ├── HomeView.vue                 ← REPLACE
    ├── LoginView.vue                ← REPLACE
    ├── VehiclesView.vue             ← REPLACE
    ├── VehicleDetailView.vue        ← REPLACE
    ├── RentalsView.vue              ← REPLACE
    ├── ProfileView.vue              ← REPLACE
    ├── ContractDetailView.vue       ← REPLACE
    ├── RentalReceiptView.vue        ← REPLACE
    ├── AdminView.vue                ← REPLACE
    ├── AdminUsersView.vue           ← REPLACE
    ├── AdminStatsView.vue           ← REPLACE
    ├── AboutView.vue                ← REPLACE
    └── NotFoundView.vue             ← REPLACE
