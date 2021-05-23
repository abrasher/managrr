<template>
  <div v-if="data">
    <p class="text-xl font-semibold">Tasks</p>
    <div class="table w-full py-4">
      <div class="table-row">
        <div class="table-cell">Task Name</div>
        <div class="table-cell">Status</div>
        <div class="table-cell">Actions</div>
      </div>
      <div v-for="task in data.system.tasks" :key="task.id" class="table-row my-5">
        <div class="table-cell">{{ task.name }}</div>
        <div class="table-cell">{{ task.status }}</div>
        <div class="table-cell"><el-button> Run Task </el-button></div>
      </div>
    </div>
    <el-button @click="logout">Logout</el-button>

    <p class="text-lg font-semibold py-3">About</p>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { useRouter } from 'vue-router'

import { GetSystemDocument } from '@/graphql/generated-types'
import { useQuery } from '@/hooks/graphql'

import { useMainStore } from '../store'
const router = useRouter()
const store = useMainStore()

const logout = async () => {
  await axios.post('/logout')
  store.logout()
  void router.push('/login')
}

const { data } = useQuery(GetSystemDocument)
</script>
