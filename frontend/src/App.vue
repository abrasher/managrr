<template>
  <n-config-provider :theme="darkTheme">
    <n-space vertical>
      <n-layout has-sider class="h-screen">
        <side-menu />
        <n-layout-content>
          Content
        </n-layout-content>
      </n-layout>
    </n-space>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'

</script>

<style>

</style>
