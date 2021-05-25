import { createRouter, createWebHistory, NavigationGuard, RouteRecordRaw } from 'vue-router'

import { useMainStore } from './store/index'
import LibraryManager from './views/LibraryManager.vue'
import Login from './views/Login.vue'
import PosterGenerator from './views/PosterGenerator.vue'
import SystemView from './views/System.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/signin',
    name: 'Login',
    component: Login,
    meta: {
      layout: 'center',
    },
  },
  {
    path: '/',
    redirect: '/settings',
  },
  {
    path: '/library',
    component: LibraryManager,
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: () => import('./views/Permissions.vue'),
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
    component: () => import('./views/Settings.vue'),
  },
  {
    path: '/settings/poster',
    name: 'Poster',
    component: PosterGenerator,
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

const loginGuard: NavigationGuard = async (to, from, next) => {
  const { loggedIn, refreshAuthentication } = useMainStore()

  if (to.name === 'Login') {
    return next()
  }

  const refreshed = await refreshAuthentication()

  if (refreshed) {
    if (loggedIn) {
      return next()
    }
  }
  return next({ name: 'Login' })
}

router.beforeEach(loginGuard)

export { router }
