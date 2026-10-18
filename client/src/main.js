import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Create the app, plug in Pinia (state) and the router, then mount it
// into <div id="app"> in index.html.
createApp(App).use(createPinia()).use(router).mount('#app')
