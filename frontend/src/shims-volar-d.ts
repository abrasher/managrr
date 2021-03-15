import { RouterLink, RouterView } from 'vue-router'

import * as ElementPlus from 'element-plus'

type ElementPlusComponents = {
  [K in keyof typeof ElementPlus as Exclude<
    K,
    'default' | 'locale' | 'install' | 'version' | 'ElMessage'
  >]: typeof ElementPlus[K]
}

declare global {
  interface __VLS_GlobalComponents {
    RouterLink: typeof RouterLink
    RouterView: typeof RouterView
  }
}
