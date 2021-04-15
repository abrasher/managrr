import 'element-plus/lib/theme-chalk/index.css'

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ModuleRegistry } from '@ag-grid-community/core'
import { CsvExportModule } from '@ag-grid-community/csv-export'
import { devtoolsExchange } from '@urql/devtools'
import urql, { createClient, defaultExchanges } from '@urql/vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule])

const app = createApp(App)
const client = createClient({
  url: '/graphql',
  exchanges: [devtoolsExchange, ...defaultExchanges],
  maskTypename: true,
})

app.use(urql, client)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())

app.mount('#app')
