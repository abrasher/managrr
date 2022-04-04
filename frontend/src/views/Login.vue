<template>
  <n-layout class="h-full">
    <n-card>
      <n-form />
    </n-card>
  </n-layout>
</template>

<script lang="ts" setup>

import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useMainStore } from '../store/'

const store = useMainStore()
const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

const login = async() => {
  const res = await axios.post('/login', loginForm)
  if (res.status !== 200) {
    ElMessage.error('Incorrect Credientials, Try Again')
  }
  else {
    store.login(loginForm.rememberMe)
    router.push('/')
  }
}
</script>

<style>

</style>
