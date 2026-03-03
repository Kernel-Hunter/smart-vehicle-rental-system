// Entry point: initializes and mounts the entire Vue application
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

// createApp(App)  → creates the Vue app using App.vue as the root component
// .use(router)    → registers the router so <router-link> and <router-view> work
// .mount('#app')  → injects the app into the <div id="app"> in index.html
createApp(App).use(router).mount('#app')