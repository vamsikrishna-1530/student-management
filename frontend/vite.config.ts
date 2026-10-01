import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// VITE_BASE is set in the GitHub Pages workflow to "/student-management/"
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
