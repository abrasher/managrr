import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import HomeView from './views/Home.vue'
import PermissionsView from './views/Permissions.vue'
import SettingsView from './views/Settings.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: PermissionsView,
  },
]

const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

export { router }
