<template>
  <el-select v-model="libraryType">
    <el-option value="movies">Movies</el-option>
    <el-option value="tv">Television</el-option>
  </el-select>
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
import { ref, onMounted } from 'vue'

import { client } from '~/graphql/client'
import { GetMediaDocument, PlexMetadata, RadarrMetadata, OmDbMetadata, TmdbMetadata } from '~/hooks/graphql-generated'
import type { IColDef } from '~/typings/ag-grid'


interface IMedia {
  id: string
  title: string
  year: number
  plexMetadata: PlexMetadata[]
  radarrMetadata: RadarrMetadata[]
  omdbMetadata: OmDbMetadata
  tmdbMetadata: TmdbMetadata
}

const data = ref<IMedia[]>()
const libraryType = ref<'tv' | 'movies'>('movies')

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
        headerName: 'IMDb',
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
