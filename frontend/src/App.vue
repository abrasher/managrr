<template>
  <el-container id="main">
    <el-aside class="side-menu" width="auto"><SideMenu></SideMenu></el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script setup lang="ts">
import SideMenu from './components/SideMenu.vue'
</script>

<style>
#main {
  height: 100vh;
}

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

.side-menu {
  height: 100%;
  width: 100px;
}
</style>
