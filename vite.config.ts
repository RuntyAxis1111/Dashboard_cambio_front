import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { 
    headers: { 'Permissions-Policy': 'camera=(self)' } 
  },
  preview: { 
    headers: { 'Permissions-Policy': 'camera=(self)' } 
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2015',
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
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