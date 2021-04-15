import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
  server: {
    proxy: {
      '/login': {
        changeOrigin: true,
        target: 'http://localhost:4000',
      },
      '/graphql': {
        changeOrigin: true,
        target: 'http://localhost:4000',
      },
      '/refresh': {
        changeOrigin: true,
        target: 'http://localhost:4000',
      },
      '/logout': {
        changeOrigin: true,
        target: 'http://localhost:4000',
      },
    },
  },
})
