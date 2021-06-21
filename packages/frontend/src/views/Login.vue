<template>
  <el-card>
    <h1 class="title">Managrr</h1>
    <el-form label-width="120px" label-position="right">
      <el-form-item label="Username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="Remember Me"> <el-checkbox v-model="loginForm.rememberMe"></el-checkbox> </el-form-item>
      <el-button class="submit-button" @click="login()">Login</el-button>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { useMainStore } from '../store/'
import { reactive } from '@vue/reactivity'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useMainStore()
const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

const login = async () => {
  const res = await axios.post('/login', loginForm)
  if (res.status !== 200) {
    ElMessage.error('Incorrect Credientials, Try Again')
  } else {
    store.login(loginForm.rememberMe)
    router.push('/')
  }
}
</script>

<style>
.submit-button {
  margin: 0 auto;
  width: 33%;
  display: block;
}

.title {
  text-align: center;
}
</style>
