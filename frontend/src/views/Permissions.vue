<template>
  <el-container>
    <!-- <el-header style="padding: 0px" height="50px">
      <toolbar title="Permission Manager" :buttons="toolbarButtons"></toolbar>
    </el-header> -->
    <el-main>
      <div class="content">
        <div class="header">
          <el-button
            :disabled="hasDataChanged"
            :loading="btnState.loading"
            @click="saveUserData"
            >Save Changes</el-button
          >
        </div>
        <div class="grid-area">
          <ag-grid-vue
            ref="ag-grid"
            class="ag-theme-alpine permissions-grid"
            :row-data="rowData"
            :column-defs="columnDefs"
            @first-data-rendered="firstDataRendered"
          ></ag-grid-vue>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { AgGridVue } from '@ag-grid-community/vue3'
import type { IColDef } from '../types'
import { cloneDeep, isEqual } from 'lodash'
import { onMounted, reactive, ref, computed } from 'vue'
import { client } from '../graphql/client'
import {
  GetUsersDocument,
  UpdateUsersDocument,
} from '../graphql/generated-types'
import type { FirstDataRenderedEvent } from '@ag-grid-community/core'
import CheckboxCellRenderer from '../components/grid/CheckboxCellRenderer'
import { ElMessage } from 'element-plus'

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

const oldRowState = ref<RowData[]>()
const rowData = ref<RowData[]>()
const columnDefs = ref<ColDef[]>()

const btnState = reactive<{
  loading: boolean
}>({
  loading: false,
})

const state = reactive({
  gridLoading: true,
  saveLoading: false,
})

const saveUserData = async () => {
  if (rowData.value === undefined) return

  btnState.loading = true

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

  client
    .mutate({
      mutation: UpdateUsersDocument,
      variables: { data: mutationData },
      fetchPolicy: 'no-cache',
    })
    .then(() => {
      btnState.loading = false
      ElMessage.success('Saved Successfully')
      cacheOldState()
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('An Error Occured While Saving')
      state.saveLoading = false
    })
}

const getUserData = async () => {
  const { data } = await client.query({
    query: GetUsersDocument,
    fetchPolicy: 'network-only',
  })

  rowData.value = data.account.users.map((user) => {
    const row = {
      id: user.id,
      title: user.title,
    }

    data.account.servers.forEach((serv) => {
      const foundServer = user.sharedServers.find(
        (ent) => ent.machineIdentifier === serv.clientIdentifier
      )

      const serverData = {
        allLibraries: foundServer?.allLibraries ?? false,
      }

      serv.libraries.forEach((lib) => {
        const include = foundServer?.libraries
          .map((ent) => ent.id)
          .includes(lib.id)
        const allLibraries = foundServer?.allLibraries ?? false

        Object.assign(serverData, {
          [lib.id]: allLibraries ? true : include ?? false,
        })
      })

      Object.assign(row, { [serv.clientIdentifier]: serverData })
    })
    return row as RowData
  })

  const colDefs: ColDef[] = data.account.servers.map(
    (server): ColDef => {
      const libraryDefs = server.libraries.map(
        (library): ColDef => ({
          cellRenderer: CheckboxCellRenderer,
          headerName: library.title,
          valueGetter: (params) =>
            params.data[server.clientIdentifier][library.id],
          valueSetter: (params) => {
            if (!params.newValue) {
              params.data[server.clientIdentifier].allLibraries = false
            }
            params.data[server.clientIdentifier][library.id] = params.newValue
            return true
          },
        })
      )
      return {
        headerName: server.name,
        children: [
          {
            cellRenderer: CheckboxCellRenderer,
            headerName: 'All Libraries',
            valueGetter: (params) =>
              params.data[server.clientIdentifier]['allLibraries'],
            valueSetter: (params) => {
              if (params.newValue === true) {
                Object.keys(params.data[server.clientIdentifier]).forEach(
                  (key) => {
                    params.data[server.clientIdentifier][key] = true
                  }
                )
              }
              params.data[server.clientIdentifier]['allLibraries'] =
                params.newValue
              return true
            },
          },
          ...libraryDefs,
        ],
      }
    }
  )

  columnDefs.value = [
    {
      field: 'title',
      headerName: 'Title',
    },
    ...colDefs,
  ]
}

const firstDataRendered = ({ columnApi }: FirstDataRenderedEvent) => {
  columnApi.autoSizeAllColumns()
}

const hasDataChanged = computed(() => isEqual(oldRowState.value, rowData.value))

const cacheOldState = () => {
  oldRowState.value = cloneDeep(rowData.value)
}

onMounted(async () => {
  await getUserData()
  cacheOldState()
})
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
