<template>
  <h1>Settings</h1>
  <h3>General</h3>
  <el-form label-width="120px" label-position="right">
    <el-form-item label="Server Port">
      <el-input v-model="settings.port"></el-input>
    </el-form-item>
    <h3>Plex</h3>
    <el-form-item label="Account Token">
      <el-input v-model="settings.plexAccountToken"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button :loading="loadingButton" @click="saveSettings">Save</el-button>
    </el-form-item>
  </el-form>
  <h4>Servers</h4>
  <el-tabs v-model="currentTab" type="card" addable @tab-add="addTab">
    <el-tab-pane
      v-for="(plex, index) in plexSettings"
      :key="index"
      :label="plex.friendlyName ?? 'New Server'"
    >
      <el-form
        :model="plex"
        class="form"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="Server URL">
          <el-input
            v-model="plex.url"
            placeholder="http://localhost:32400"
          ></el-input>
        </el-form-item>
        <el-form-item label="Token">
          <el-input v-model="plex.token"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveServer(plex)">Save</el-button>
          <el-button type="warning" @click="testServer(plex)"
            >Test Connection</el-button
          >
          <el-button type="danger" @click="deleteServer(plex.id)"
            >Delete</el-button
          >
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref, onBeforeMount } from 'vue'
import { client } from '../graphql/client'
import {
  AddPlexDocument,
  GetSettingsDocument,
  DeletePlexDocument,
  CheckPlexDocument,
  UpdateSettingsDocument,
} from '../graphql/generated-types'
import type { GetSettingsQuery, PlexSettings } from '../graphql/generated-types'

const currentTab = ref('0')
const settings = reactive({}) as GetSettingsQuery['settings']

const plexSettings = reactive<Partial<PlexSettings>[]>([defaultPlex])

const loadingButton = ref(false)

const saveSettings = async () => {
  loadingButton.value = true
  await client.mutate({
    mutation: UpdateSettingsDocument,
    variables: {
      data: settings,
    },
  })
  loadingButton.value = false
  ElMessage.success('Settings Saved')
}

const loadSettings = async () => {
  const res = await client.query({
    query: GetSettingsDocument,
  })
  const { language, port, plexAccountToken, plex } = res.data.settings

  settings.language = language ?? 'eng'
  settings.port = port ?? 4000
  settings.plexAccountToken = plexAccountToken
  plex && plexSettings.unshift(...plex)
}

const saveServer = async ({ id, url, token }: PlexSettings) => {
  const res = await client.mutate({
    mutation: AddPlexDocument,
    variables: {
      data: {
        url,
        token,
      },
    },
  })
  if (res.data != null) {
    plexSettings[plexSettings.findIndex((set) => set.id === id)] =
      res.data.updatePlex
  } else {
    ElMessage('Error saving settings')
    console.error(res.errors)
  }
}

const deleteServer = (id: number | undefined) => {
  if (id === undefined) return
  client
    .mutate({
      mutation: DeletePlexDocument,
      variables: {
        id,
      },
    })
    .then((res) => {
      const index = plexSettings.findIndex(
        (set) => set.id === res.data?.deletePlex.id
      )
      plexSettings.splice(index, 1)
    })
}

const testServer = async ({ url, token }: PlexSettings) => {
  console.log('test')
  client
    .query({
      query: CheckPlexDocument,
      variables: {
        data: {
          url,
          token,
        },
      },
    })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
    .finally(() => console.log('ran'))
  console.log('gregre')
}

const addTab = () => {
  // Prevents from creating more than one new server at a time
  if (plexSettings[plexSettings.length - 1].friendlyName === 'New Server')
    return

  plexSettings.push(defaultPlex)

  currentTab.value = `${plexSettings.length - 1}`
}

onBeforeMount(async () => {
  loadSettings()
})
</script>

<script lang="ts">
const defaultPlex = {
  friendlyName: 'New Server',
  machineIdentifier: '',
  token: '',
  url: '',
}
</script>

<style>
label {
  font-weight: bold;
}

.el-tabs {
  width: 60%;
}
form {
  min-width: 400px;
  max-width: 700px;
}
</style>
