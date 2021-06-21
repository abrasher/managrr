import type { RouterLink, RouterView } from 'vue-router'

declare global {
  interface __VLS_GlobalComponents {
    RouterLink: typeof RouterLink
    RouterView: typeof RouterView
  }
}
