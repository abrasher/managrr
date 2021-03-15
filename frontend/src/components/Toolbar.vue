<template>
  <div class="toolbar">
    <div class="toolbar-item title">
      {{ props.title }}
    </div>
    <template v-for="btn in props.buttons" :key="btn.key">
      <div class="toolbar-btn">
        <div>
          <i :class="`el-icon-${btn.icon}`"></i><span>{{ btn.title }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface ToolbarButton {
  title: string
  icon: string
}

const props = defineProps<{
  title: string
  buttons: ToolbarButton
}>()
</script>

<style>
.title {
  font-size: 24px;
}
.toolbar {
  display: flex;
  background-color: #545c64;
  color: #fff;
  padding-left: 20px;
  padding-right: 20px;
  height: 50px;
}
.toolbar-item {
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.toolbar-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: none;
  background-color: transparent;
  color: #fff;
  border-radius: 0;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
}
.toolbar-btn i {
  padding-right: 6px;
  font-size: 20px;
}
.toolbar-btn span {
  font-size: 16px;
}
.toolbar-btn:hover {
  background: rgb(67, 74, 80);
}
</style>
