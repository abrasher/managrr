import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import WindiCss from 'vite-plugin-windicss'
import tsconfigPaths from 'vite-tsconfig-paths'
import AutoImport from 'unplugin-auto-import/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'frontend',
  plugins: [
    Vue(),
    tsconfigPaths({
      extensions: ['.vue', '.ts'],
    }),
    WindiCss(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-import.d.ts',
    }),
    Layouts(),
    Pages(),
    Components({
      dts: 'src/auto-components.d.ts',
      resolvers: [NaiveUiResolver()],
    }),
  ],

  // server: {
  //   fs: {
  //     strict: true,
  //   },
  //   proxy: {
  //     '/graphql': {
  //       changeOrigin: true,
  //       target: 'http://localhost:9989',
  //     },

  //     '/img': {
  //       changeOrigin: true,
  //       target: 'http://localhost:9989',
  //     },
  //   },
  // },

  optimizeDeps: {
    include: ['vue', 'vue-router'],
  },
})
