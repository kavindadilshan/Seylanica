import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { blogPlugin } from './scripts/blog-plugin.mjs'

export default defineConfig({
  plugins: [blogPlugin(), react(), tailwindcss()],
})
