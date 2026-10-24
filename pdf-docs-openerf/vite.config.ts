import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendTarget = 'http://127.0.0.1:8080'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
      },
      '/uploads': {
        target: backendTarget,
        changeOrigin: true,
      },
    },
    allowedHosts: [
      'canola-deacon-occultist.ngrok-free.dev',
      '.ngrok-free.dev' // This allows any ngrok subdomain automatically
    ]
  }
})