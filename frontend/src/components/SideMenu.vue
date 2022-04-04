<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <span class="text-center w-full block text-xl font-bold">{{ collapsed ? 'm' : 'managrr' }}</span>
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :expand-icon="expandIcon"
      />
    </n-layout-sider>
    <n-layout>
      <span>Content</span>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { NIcon } from 'naive-ui'
import { BookOutline, CaretDownOutline, HomeOutline, SettingsOutline } from '@vicons/ionicons5'
import type { Component } from 'vue'
import type { RouterLinkProps } from 'vue-router'
import { RouterLink } from 'vue-router'

const collapsed = ref(true)

const expandIcon = () => {
  return h(NIcon, null, { default: () => h(CaretDownOutline) })
}

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderLabel(props: RouterLinkProps, labelText: string) {
  return () => h(RouterLink, props, { default: () => labelText })
}

const menuOptions: MenuOption[] = [
  {
    label: renderLabel({
      to: 'home',
    }, 'Home'),
    key: 'home',
    icon: renderIcon(HomeOutline),
  },
  {
    label: renderLabel({
      to: 'library',
    }, 'Library Manager'),
    key: 'library',
    icon: renderIcon(BookOutline),
  },
  {
    label: renderLabel({
      to: 'settings',
    }, 'Settings'),
    key: 'settings',
    icon: renderIcon(SettingsOutline),
  },

]
</script>
