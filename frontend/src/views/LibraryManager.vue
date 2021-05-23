<template>
  <div v-if="!data">Loading</div>
  <div>
    <ag-grid-vue
      class="ag-theme-alpine permission-grid"
      :row-data="data"
      :column-defs="columnDefs"
    />
  </div>
</template>

<script lang="ts" setup>
import { AgGridVue } from '@ag-grid-community/vue3'
import { onMounted } from '@vue/runtime-core'
import { ref } from 'vue'

import { client } from '@/graphql/client'
import { GetMediaDocument } from '@/graphql/generated-types'
import type { IColDef } from '@/typings/ag-grid'

import type {
  OMDbMetadata,
  PlexMetadata,
  RadarrMetadata,
  TMDbMetadata,
} from '../../../backend/typings/common'

interface IMedia {
  id: string
  title: string
  year: number
  plexMetadata: PlexMetadata[]
  radarrMetadata: RadarrMetadata[]
  omdbMetadata: OMDbMetadata
  tmdbMetadata: TMDbMetadata
}

const data = ref<IMedia[]>()

const columnDefs: IColDef<IMedia>[] = [
  {
    field: 'title',
  },
  {
    field: 'year',
  },
  // Rating Fields
  {
    headerName: 'Ratings',
    children: [
      {
        headerName: 'IMDB Rating',
        valueGetter: (params) => params.data.omdbMetadata,
      },
    ],
  },
]

onMounted(() => {
  client
    .query({
      query: GetMediaDocument,
    })
    .then((res) => {
      data.value = res.data.media.map((data) => {
        const { id, title, year, plexMetadata, radarrMetadata, omdbMetadata, tmdbMetadata } = data

        return {
          id,
          year,
          title,
          plexMetadata: JSON.parse(plexMetadata),
          radarrMetadata: JSON.parse(radarrMetadata),
          omdbMetadata: JSON.parse(omdbMetadata),
          tmdbMetadata: JSON.parse(tmdbMetadata),
        }
      })
    })
    .catch((err) => console.error(err))
})
</script>

<style>
@import '../../node_modules/@ag-grid-community/core/dist/styles/ag-grid.css';
@import '../../node_modules/@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

.permission-grid {
  height: 900px;
  width: 1000px;
}
</style>
