<template>
  <div>
    <h1>SmartRent Real-Time Vehicle Map</h1>

    <div style="height: 600px; width: 100%">
      <l-map
        ref="map"
        v-model:zoom="zoom"
        :center="center"
        style="height: 100%"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <!-- User location -->
        <l-marker :lat-lng="userLocation">
          <l-popup>
            Your current location
          </l-popup>
        </l-marker>

        <!-- Vehicles -->
        <l-marker
          v-for="vehicle in vehicles"
          :key="vehicle.id"
          :lat-lng="[vehicle.latitude, vehicle.longitude]"
        >
          <l-popup>
            <div>
              <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>

              <p>Type: {{ vehicle.type }}</p>
              <p>Status: {{ vehicle.status }}</p>
              <p>Price/minute: {{ vehicle.pricePerMinute }}</p>

              <button @click="rentVehicle(vehicle.id)">
                Rent Vehicle
              </button>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup
} from '@vue-leaflet/vue-leaflet'

export default {
  name: 'MapView',

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },

  data() {
    return {
      zoom: 13,

      center: [36.8065, 10.1815],

      userLocation: [36.8065, 10.1815],

      vehicles: []
    }
  },

  async mounted() {
    this.getUserLocation()

    await this.loadVehicles()
  },

  methods: {
    async loadVehicles() {
      try {
        const response = await axios.get(
          'http://localhost:8080/vehicles/available'
        )

        this.vehicles = response.data
      } catch (error) {
        console.error(error)
      }
    },

    getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          this.userLocation = [lat, lng]
          this.center = [lat, lng]
        },
        (error) => {
          console.error(error)
        }
      )
    },

    async rentVehicle(vehicleId) {
      try {
        const token = localStorage.getItem('token')

        await axios.post(
          'http://localhost:8080/rentals/instant',
          {
            vehicleId: vehicleId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        alert('Vehicle rented successfully')

        await this.loadVehicles()
      } catch (error) {
        console.error(error)
        alert('Rental failed')
      }
    }
  }
}
</script>
