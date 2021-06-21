<template>
  <el-container id="main">
    <el-aside class="side-menu" width="auto"><SideMenu /></el-aside>
    <el-main>
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import SideMenu from '../components/SideMenu.vue'
</script>

<style>
.side-menu {
  height: 100%;
  width: 100px;
}

#main {
  height: 100vh;
}
</style>
