import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // <tableau-viz> is a Web Component from Tableau's Embedding API,
          // not a Vue component. This tells Vue to leave it alone.
          isCustomElement: (tag) => tag.startsWith('tableau-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      // Lets you write '@/components/X.vue' instead of '../../components/X.vue'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // Requests to /graphql from the browser are forwarded to the API server.
    // This avoids CORS issues during development.
    proxy: {
      '/graphql': 'http://localhost:4000'
    }
  }
})
