import path from 'path'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import WindiCss from 'vite-plugin-windicss'
import tsconfigPaths from 'vite-tsconfig-paths'
import AutoImport from 'unplugin-auto-import/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  plugins: [
    Vue(),
    tsconfigPaths({
      extensions: ['.vue', '.ts'],
    }),
    WindiCss(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: true,
    }),
    Layouts(),
    Pages(),
    Components({
      dts: true,
      resolvers: [ElementPlusResolver()],
    }),
    VueI18n({
      compositionOnly: true,
      runtimeOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),
  ],

  server: {
    fs: {
      strict: true,
    },
    proxy: {
      '/graphql': {
        changeOrigin: true,
        target: 'http://localhost:9989',
      },

      '/img': {
        changeOrigin: true,
        target: 'http://localhost:9989',
      },
    },
  },

  optimizeDeps: {
    include: ['vue', 'vue-router'],
  },
})
