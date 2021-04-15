import { createRouter, createWebHistory, NavigationGuard, RouteRecordRaw } from 'vue-router'
import { useMainStore } from './store/index'
import Login from './views/Login.vue'
import TestView from './views/TestView.vue'

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
    name: 'Home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/Settings.vue'),
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: () => import('./views/Permissions.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: TestView,
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
