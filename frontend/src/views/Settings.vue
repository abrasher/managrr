<template>
  <div v-if="fetching">Loading</div>
  <div v-else>
    <h1>Settings</h1>
    <h3>General</h3>
    <el-form label-width="120px" label-position="right">
      <el-form-item label="Server Port">
        <el-input v-model="settings.port" />
      </el-form-item>
      <h3>Plex</h3>
      <el-form-item label="Account Token">
        <el-input v-model="settings.plexAccountToken" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loadingButton" @click="updateSettings(settings)">Save</el-button>
      </el-form-item>
    </el-form>
    <h4>Plex Instances</h4>
    <el-tabs v-model="currentTabs.plex" addable @tab-add="addTabHandler(plexInstances, 'plex')">
      <el-tab-pane
        v-for="plex in plexInstances"
        :key="plex.id"
        :label="plex.friendlyName ?? 'New Server'"
      >
        <el-form :model="plex" class="form" label-width="120px" label-position="right">
          <span>{{ plex.id }}</span>
          <el-form-item label="Server URL">
            <el-input v-model="plex.url" placeholder="http://localhost:32400" />
          </el-form-item>
          <el-form-item label="Token">
            <el-input v-model="plex.token" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loadingButton" @click="updatePlex(plex)"
              >Save</el-button
            >
            <el-button type="danger" :loading="loadingButton" @click="removePlex(plex)"
              >Remove</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <h4>Radarr Instances</h4>
    <el-tabs
      v-model="currentTabs.radarr"
      addable
      @tab-add="addTabHandler(radarrInstances, 'radarr')"
    >
      <el-tab-pane
        v-for="radarr in radarrInstances"
        :key="radarr.id"
        :label="radarr.instanceName ?? 'New Server'"
      >
        <el-form :model="radarr" class="form" label-width="120px" label-position="right">
          <el-form-item label="Instance Name">
            <el-input v-model="radarr.instanceName" placeholder="Radarr" />
          </el-form-item>
          <el-form-item label="Server URL">
            <el-input v-model="radarr.url" placeholder="http://localhost:8989" />
          </el-form-item>
          <el-form-item label="API Key">
            <el-input v-model="radarr.apiKey" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loadingButton" @click="updateRadarr(radarr)"
              >Save</el-button
            >
            <el-button type="danger" :loading="loadingButton" @click="removeRadarr(radarr)"
              >Remove</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@urql/vue'
import { reactive, ref, watch } from 'vue'

import { mapToReactive } from '@/lib/helpers'

import type { GetSettingsQuery } from '../graphql/generated-types'
import {
  GetSettingsDocument,
  RemovePlexInstanceDocument,
  RemoveRadarrInstanceDocument,
  UpdateSettingsDocument,
  UpsertPlexInstanceDocument,
  UpsertRadarrInstanceDocument,
} from '../graphql/generated-types'

const getSettings = useQuery({ query: GetSettingsDocument, requestPolicy: 'network-only' })

const currentTabs = reactive({
  radarr: '0',
  plex: '0',
})

const fetching = getSettings.fetching

const addTabHandler = <T>(arr: T[], tabRef: keyof typeof currentTabs) => {
  arr.push(reactive({}) as T)
  const len = arr.length - 1
  currentTabs[tabRef] = len.toString()
}

const settings = ref({} as GetSettingsQuery['settings'])
const plexInstances = ref<GetSettingsQuery['plexInstances']>([])
const radarrInstances = ref<GetSettingsQuery['radarrInstances']>([])

watch(getSettings.data, (data) => {
  if (data === undefined) return
  settings.value = data.settings
  plexInstances.value = mapToReactive(data.plexInstances)
  radarrInstances.value = mapToReactive(data.radarrInstances)
})

watch(plexInstances, (newVal, oldVal) => {
  if (newVal.length < oldVal.length) {
    currentTabs.plex = (Number(currentTabs.plex) - 1).toString()
  }
})

watch(radarrInstances, (newVal, oldVal) => {
  if (newVal.length < oldVal.length) {
    currentTabs.radarr = (Number(currentTabs.radarr) - 1).toString()
  }
})

const updateSettings = useUpsertMutation(UpdateSettingsDocument, [
  'id',
  'language',
  'plexAccountToken',
  'port',
])

const updatePlex = useUpsertMutation(UpsertPlexInstanceDocument, ['id', 'token', 'url'])
const removePlex = useRemoveMutation(RemovePlexInstanceDocument, plexInstances)

const updateRadarr = useUpsertMutation(UpsertRadarrInstanceDocument, [
  'id',
  'url',
  'instanceName',
  'apiKey',
])
const removeRadarr = useRemoveMutation(RemoveRadarrInstanceDocument, radarrInstances)

const loadingButton = ref(false)
</script>

<script lang="ts"></script>

<style>
label {
  font-weight: bold;
}

.el-tabs {
  width: 60%;
  min-width: 600px;
}
form {
  min-width: 400px;
  max-width: 700px;
}
</style>
