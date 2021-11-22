import type { Component } from '@vue/runtime-core'
import type VueRouter from 'vue-router'

declare global {
  interface __VLS_GlobalComponents {
    RouterLink: typeof VueRouter.RouterLink
    RouterView: typeof VueRouter.RouterView
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    layout?: Component
  }
}
