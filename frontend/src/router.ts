import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

import Home from "./views/Home.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
]

const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

export { router }
