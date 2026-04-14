import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Security: Disable sourcemaps in production
    minify: 'terser', // Optimized minification
    terserOptions: {
      compress: {
        drop_console: true, // Performance: Remove console logs in prod
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['framer-motion', 'lucide-react', 'react-markdown']
        }
      }
    }
  }
})
