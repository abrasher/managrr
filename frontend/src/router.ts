import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import LibraryManagerVue from './views/LibraryManager.vue'

import NotFoundVue from './views/NotFound.vue'
import PermissionsVue from './views/Permissions.vue'
import PosterGenerator from './views/PosterGenerator.vue'
import SettingsVue from './views/Settings.vue'
import SystemView from './views/System.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/library',
    name: 'LibraryManager',
    component: LibraryManagerVue,
  },
  {
    path: '/permissions',
    name: 'Permissions',
    alias: '/',
    component: PermissionsVue,
  },
  {
    path: '/system',
    name: 'System',
    component: SystemView,
  },
  {
    path: '/settings',
    alias: '/settings/general',
    name: 'Settings',
    component: SettingsVue,
  },
  {
    path: '/settings/poster',
    name: 'Poster',
    component: PosterGenerator,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: NotFoundVue,
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export { router }
