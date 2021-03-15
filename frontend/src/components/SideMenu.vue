<template>
  <el-menu
    id="menu"
    router
    :default-active="route.path"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <div class="logo">Managrr</div>
    <el-menu-item index="/">
      <i class="el-icon-menu"></i>
      <span>Main</span>
    </el-menu-item>
    <el-menu-item index="/permissions">
      <i class="el-icon-document"></i>
      <span>Permissions</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span>Settings</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style>
.logo {
  color: #fff;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 24px;
}
#menu {
  border-right: 0px;
  height: 100%;
  text-align: center;
}
#menu > .el-menu-item {
  padding-right: 40px;
  font-size: 16px;
}
</style>
