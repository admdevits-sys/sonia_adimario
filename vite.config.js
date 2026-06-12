import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'sonia-adimario.onrender.com' // Autoriza o domínio do Render
    ]
  }
})