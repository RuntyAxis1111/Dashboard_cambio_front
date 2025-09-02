import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { 
    headers: { 
      'Permissions-Policy': 'camera=(self), microphone=(self)' 
    },
    host: 'localhost',
    port: 5173
  },
  preview: { 
    headers: { 
      'Permissions-Policy': 'camera=(self), microphone=(self)' 
    },
    host: 'localhost',
    port: 4173
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})