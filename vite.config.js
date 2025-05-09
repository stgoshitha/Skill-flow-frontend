import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/posts': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/categories': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/learning-plan': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/helpdesk': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/comments': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/replies': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    },
    historyApiFallback: true
  }
})