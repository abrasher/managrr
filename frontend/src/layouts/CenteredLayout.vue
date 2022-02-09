<template>
  <el-container class="centered">
    <slot></slot>
  </el-container>
</template>

<style>
.centered {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}
</style>
