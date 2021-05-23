<template>
  <div v-if="settingsLoading">Loading...</div>
  <el-row v-else class="max-w-4xl h-full">
    <el-col :span="12" class="text-xl">
      <p class="text-white text-xl mb-2">Poster Generation Settings</p>
      <el-form v-model="form" label-width="auto" label-position="left">
        <el-form-item label="Font Colour">
          <el-select v-model="form.FONT_COLOUR" size="small">
            <el-option label="White" value="white" />
            <el-option label="Black" value="black" />
          </el-select>
        </el-form-item>
        <el-form-item label="Background Colour">
          <el-color-picker v-model="form.BOX_COLOUR" />
        </el-form-item>
        <el-form-item label="Spacing">
          <el-input-number v-model="form.SPACING" :min="10" :step="1" size="small" />
        </el-form-item>
        <el-form-item label="Icon Scale">
          <el-input-number
            v-model="form.GLOBAL_ICON_SCALE"
            :min="0.01"
            :max="1"
            :step="0.01"
            size="small"
          />
        </el-form-item>
        <el-form-item label="Rating Scale">
          <el-input-number
            v-model="form.RATING_SCALE"
            :min="0.01"
            :max="1"
            :step="0.01"
            size="small"
          />
        </el-form-item>
        <el-form-item label="Layer Blend Mode">
          <el-select v-model="form.BLEND_MODE">
            <el-option
              v-for="mode in BlendMode"
              :key="mode"
              :label="toNormalCase(mode)"
              :value="mode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Source Opacity">
          <el-input-number
            v-model="form.SOURCE_OPACITY"
            :min="0.01"
            :max="1"
            :step="0.01"
            size="small"
          />
        </el-form-item>
        <el-form-item label="Destination Opacity">
          <el-input-number
            v-model="form.DESTINATION_OPACITY"
            :min="0.01"
            :max="1"
            :step="0.01"
            size="small"
          />
        </el-form-item>
        <el-form-item label="JPEG Quality">
          <el-input-number v-model="form.JPEG_QUALITY" :min="1" :max="100" :step="1" size="small" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="updateMutation.fetching.value" @click="updateSettings">
            Save Settings
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12">
      <p class="text-lg text-center">Preview</p>
      <img class="mb-2" :src="previewUrl" >
      <el-button class="w-full" :loading="previewMutation.fetching.value" @click="generatePreview"
        >Generate Preview</el-button
      >
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { reactive } from '@vue/reactivity'
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'

import type { PosterGenerationInput } from '@/graphql/generated-types'
import {
  BlendMode,
  GetSettingsDocument,
  PreviewPosterDocument,
  UpdatePosterSettingsDocument,
} from '@/graphql/generated-types'
import { useMutation, useQuery } from '@/hooks/graphql'

const previewUrl = ref('/img/preview.jpeg')

const toNormalCase = (str: string) =>
  str
    .split('_')
    .map((val) => `${val[0].toUpperCase()}${val.slice(1).toLowerCase()}`)
    .join(' ')

const previewMutation = useMutation(PreviewPosterDocument)
const updateMutation = useMutation(UpdatePosterSettingsDocument)
const { loading: settingsLoading, data: settingsData } = useQuery(GetSettingsDocument)

watch(settingsData, (dataValue) => {
  if (!dataValue) return
  Object.assign(form, dataValue.settings.posterSettings)
})

const updateSettings = async () => {
  try {
    const data = await updateMutation.execute(form)
    void generatePreview()

    Object.assign(form, data.updatePosterSettings)
    console.log(data.updatePosterSettings)
    ElMessage.success('Successfully Saved')
  } catch (err) {
    console.error(err)
  }
}

const generatePreview = async () => {
  const data = await previewMutation.execute(form)
  previewUrl.value = data.previewPoster
}

const form: PosterGenerationInput = reactive({})
</script>
