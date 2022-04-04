import 'virtual:windi.css'
import 'virtual:windi-devtools'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ModuleRegistry } from '@ag-grid-community/core'
import { CsvExportModule } from '@ag-grid-community/csv-export'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule])

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.mount('#app')
