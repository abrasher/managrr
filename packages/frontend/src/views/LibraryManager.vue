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

import type {
  OMDbMetadata,
  PlexMetadata,
  RadarrMetadata,
  TMDbMetadata,
} from '@/backend/typings/common'
import { client } from '@/frontend/graphql/client'
import { GetMediaDocument } from '@/frontend/graphql/generated-types'
import type { IColDef } from '@/frontend/typings/ag-grid'

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
        headerName: 'IMDB',
        valueGetter: (params) => params.data.omdbMetadata.imdbRating,
      },
      {
        headerName: 'RottenTomatoes',
        valueGetter: (params) => params.data.omdbMetadata.ratings.rottenTomatoes,
      },
      {
        headerName: 'Metacritic',
        valueGetter: (params) => params.data.omdbMetadata.ratings.metacritic,
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
        console.log(data)
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

<style lang="scss">
.permission-grid {
  height: 900px;
  width: 1000px;
}
</style>
