<template>
  <component :is="layoutComponent">
    <router-view></router-view>
  </component>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  if (!route.meta.layout) {
    return MainLayout
  }
  return route.meta.layout
})
</script>

<style>
body {
  height: 100vh;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: block;
  width: 100vw;
}

#app {
  height: 100vh;
}

.layout-container {
  height: 100vh;
  width: 100vw;
}

.el-main {
  height: 100%;
}

.el-container {
  height: 100%;
}
</style>
