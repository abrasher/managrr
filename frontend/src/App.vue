<template>
  <el-container>
    <el-aside width="500px"><SideMenu></SideMenu></el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import SideMenu from './components/SideMenu.vue'
const test = 'hello'
// import { defineComponent } from 'vue'

// export default defineComponent({
//   name: 'Main',
//   components: {
//     SideMenu,
//   },
// })
</script>

<style>
#main {
  height: 100vh;
}

el-aside {
  width: 300px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
