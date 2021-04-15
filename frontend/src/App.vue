<template>
  <component :is="layoutComponent" class="layout-container">
    <router-view></router-view>
  </component>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import CenteredLayout from './layouts/CenteredLayout.vue'
import MainLayout from './layouts/MainLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  switch (route.meta.layout) {
    case 'center':
      return CenteredLayout
    case 'main':
      return MainLayout
    default:
      return MainLayout
  }
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
