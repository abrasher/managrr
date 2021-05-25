import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import WindiCss from 'vite-plugin-windicss'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  plugins: [
    vue(),
    tsconfigPaths({
      extensions: ['.vue', '.ts'],
    }),
    WindiCss(),
  ],

  server: {
    proxy: {
      '/login': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
      '/graphql': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
      '/refresh': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
      '/logout': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
      '/img': {
        changeOrigin: true,
        target: 'http://localhost:5000',
      },
    },
  },
})
