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

        <l-marker :lat-lng="userLocation">
          <l-popup>
            Your Current Location
          </l-popup>
        </l-marker>

        <l-marker
          v-for="vehicle in availableVehicles"
          :key="vehicle.id"
          :lat-lng="[vehicle.latitude, vehicle.longitude]"
        >
          <l-popup>
            <div>
              <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>

              <p>Type: {{ vehicle.type }}</p>
              <p>Status: {{ vehicle.status }}</p>
              <p>Price/Minute: {{ vehicle.pricePerMinute }} DT</p>

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

  computed: {
    availableVehicles() {
      return this.vehicles.filter(
        vehicle => vehicle.status === 'AVAILABLE'
      )
    }
  },

  mounted() {
    this.initializeVehicles()

    this.getUserLocation()
  },

  methods: {
    initializeVehicles() {
      const savedVehicles = localStorage.getItem('vehicles')

      if (savedVehicles) {
        this.vehicles = JSON.parse(savedVehicles)
      } else {
        this.vehicles = [
          {
            id: 1,
            brand: 'Toyota',
            model: 'Yaris',
            type: 'Car',
            status: 'AVAILABLE',
            pricePerMinute: 0.5,
            latitude: 36.8065,
            longitude: 10.1815
          },
          {
            id: 2,
            brand: 'Honda',
            model: 'PCX',
            type: 'Scooter',
            status: 'AVAILABLE',
            pricePerMinute: 0.3,
            latitude: 36.8080,
            longitude: 10.1840
          },
          {
            id: 3,
            brand: 'Yamaha',
            model: 'R1',
            type: 'Motorcycle',
            status: 'AVAILABLE',
            pricePerMinute: 0.7,
            latitude: 36.8040,
            longitude: 10.1780
          },
          {
            id: 4,
            brand: 'BMW',
            model: 'X1',
            type: 'Car',
            status: 'AVAILABLE',
            pricePerMinute: 0.9,
            latitude: 36.8100,
            longitude: 10.1880
          }
        ]

        localStorage.setItem(
          'vehicles',
          JSON.stringify(this.vehicles)
        )
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

    rentVehicle(vehicleId) {
      const vehicle = this.vehicles.find(
        vehicle => vehicle.id === vehicleId
      )

      if (vehicle) {
        vehicle.status = 'RENTED'

        localStorage.setItem(
          'vehicles',
          JSON.stringify(this.vehicles)
        )

        alert('Vehicle rented successfully')
      }
    }
  }
}
</script>
