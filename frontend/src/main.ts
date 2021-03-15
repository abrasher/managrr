import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { router } from './router'
import { createPinia } from 'pinia'

import { ModuleRegistry } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { CsvExportModule } from '@ag-grid-community/csv-export'

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule])

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(createPinia())

app.mount('#app')
