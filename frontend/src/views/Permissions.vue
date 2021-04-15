<template>
  <el-container>
    <el-main>
      <div class="content">
        <div class="header">
          <el-button :loading="isSaving" @click="saveUserData"> Save Changes </el-button>
        </div>
        <div class="grid-area">
          <ag-grid-vue
            ref="ag-grid"
            class="ag-theme-alpine permissions-grid"
            :row-data="rowData"
            :column-defs="columnDefs"
            :grid-options="gridOptions"
            :first-data-rendered="firstDataRendered"
          />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import type { FirstDataRenderedEvent, GridOptions } from '@ag-grid-community/core'
import { AgGridVue } from '@ag-grid-community/vue3'
import { useClient, useQuery } from '@urql/vue'
import { ref } from 'vue'

import CheckboxCellRenderer from '../components/grid/CheckboxCellRenderer'
import type { GetUsersQuery } from '../graphql/generated-types'
import { GetUsersDocument, UpdateUsersDocument } from '../graphql/generated-types'
import { displayMutationMessage } from '../lib/helpers'
import type { IColDef } from '../types'

const getUsers = useQuery({ query: GetUsersDocument })
const client = useClient()

const columnDefs = ref<ColDef[]>([])
const rowData = ref<RowData[] | null>(null)

const isSaving = ref(false)

const gridOptions: GridOptions = {
  // Required for auto-size columns to affect offscreen columns
  suppressColumnVirtualisation: true,
}

const firstDataRendered = ({ columnApi }: FirstDataRenderedEvent) => columnApi.autoSizeAllColumns()

void getUsers.then((result) => {
  const queryData = result.data.value

  const colDefs: ColDef[] = []

  colDefs.push({
    field: 'title',
    headerName: 'Title',
  })

  rowData.value = transformRows(queryData)

  if (queryData) {
    for (const server of queryData.account.servers) {
      const libraryDefs = server.libraries.map(
        (library): ColDef => ({
          cellRenderer: CheckboxCellRenderer,
          headerName: library.title,
          valueGetter: (params) => params.data[server.clientIdentifier][library.id],
          valueSetter: (params) => {
            if (!params.newValue) {
              params.data[server.clientIdentifier].allLibraries = false
            }
            params.data[server.clientIdentifier][library.id] = params.newValue
            return true
          },
        })
      )
      colDefs.push({
        headerName: server.name,
        children: [
          {
            cellRenderer: CheckboxCellRenderer,
            headerName: 'All Libraries',
            valueGetter: (params) => params.data[server.clientIdentifier]['allLibraries'],
            valueSetter: (params) => {
              if (params.newValue === true) {
                Object.keys(params.data[server.clientIdentifier]).forEach((key) => {
                  params.data[server.clientIdentifier][key] = true
                })
              } else if (params.newValue === false) {
                params.data[server.clientIdentifier]['allLibraries'] = params.newValue
              }

              return true
            },
          },
          ...libraryDefs,
        ],
      })
    }
  }
  columnDefs.value = colDefs
})

const transformRows = (queryData: GetUsersQuery | undefined) => {
  const rows: RowData[] = []

  if (queryData) {
    for (const user of queryData.account.users) {
      const row = {
        id: user.id,
        title: user.title,
      }

      for (const server of queryData.account.servers) {
        const foundServer = user.sharedServers.find(
          (ent) => ent.machineIdentifier === server.clientIdentifier
        )

        const serverData = {
          allLibraries: foundServer?.allLibraries ?? false,
        }

        server.libraries.forEach((lib) => {
          const include = foundServer?.libraries.map((ent) => ent.id).includes(lib.id)
          const allLibraries = foundServer?.allLibraries ?? false

          Object.assign(serverData, {
            [lib.id]: allLibraries ? true : include ?? false,
          })
        })

        Object.assign(row, { [server.clientIdentifier]: serverData })
      }
      rows.push(row as RowData)
    }
  }
  return rows.length === 0 ? null : rows
}

type RowData = {
  id: string
  title: string
} & Record<
  string,
  {
    allLibraries: boolean
    [key: string]: boolean
  }
>

type ColDef = IColDef<RowData>

const saveUserData = () => {
  if (!rowData.value) return
  isSaving.value = true

  const mutationData = rowData.value.map((row) => {
    const { id, title, ...serversObjects } = row

    // Transform add back after being modified for grid
    const servers = Object.entries(serversObjects).map(([key, value]) => {
      const { allLibraries, ...librariesObj } = value
      const librarySectionIds = Object.entries(librariesObj)
        .filter(([, val]) => val)
        .map(([key]) => key)

      return {
        machineIdentifier: key,
        allLibraries,
        librarySectionIds,
      }
    })

    return {
      id,
      servers,
    }
  })

  void client
    .mutation(UpdateUsersDocument, { input: mutationData })
    .toPromise()
    .then((result) => {
      displayMutationMessage(result)
      isSaving.value = false
    })
}
</script>

<style>
@import '../../node_modules/@ag-grid-community/core/dist/styles/ag-grid.css';
@import '../../node_modules/@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

.permissions-grid {
  height: 100%;
}
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.content > .header {
  margin-bottom: 10px;
}
.grid-area {
  flex-grow: 1;
}
.el-message {
  transform: translateX(-36px);
  left: auto;
  right: 0;
}
</style>
