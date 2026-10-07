import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/simola-v2/' : '/',
  publicDir: mode === 'production' ? 'deploy/v2-public' : 'public',
  plugins: [
    react(),
    tailwindcss(),
  ],
}))