import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@modyfi/vite-plugin-yaml'

// base './' → the built files work from any sub-folder (e.g. miracbarisusta.com/bipolar-manzarasi/)
export default defineConfig({
  base: './',
  plugins: [react(), yaml()],
})
