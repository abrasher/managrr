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
    <el-menu-item index="/library">
      <i class="el-icon-film" />
      <span class="text-lg">Library</span>
    </el-menu-item>
    <el-menu-item index="/permissions">
      <i class="el-icon-user" />
      <span class="text-lg">Permissions</span>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <i class="el-icon-setting" />
        <span class="text-lg">Settings</span>
      </template>
      <el-menu-item index="/settings/general">
        <span class="text-base"> General </span>
      </el-menu-item>
      <el-menu-item index="/settings/poster">
        <span class="text-base"> Poster Generation </span>
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/system">
      <i class="el-icon-monitor" />
      <span class="text-lg">System</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss">
.logo {
  color: #fff;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 24px;
}

#menu {
  width: 200px;
  border-right: 0px;
  height: 100%;
  text-align: left;
}
</style>
