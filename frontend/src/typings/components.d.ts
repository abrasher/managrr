import type { RouterLink, RouterView } from 'vue-router'

declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: RouterLink
    RouterView: RouterView
  }
}

export {}
