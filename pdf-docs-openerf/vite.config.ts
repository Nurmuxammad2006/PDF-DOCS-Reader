import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'canola-deacon-occultist.ngrok-free.dev',
      '.ngrok-free.dev' // This allows any ngrok subdomain automatically
    ]
  }
})