import { defineStore } from 'pinia'

const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    showAdvanced: false,
    plexInstances: [],
  }),
  actions: {
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced
    },
    loadServerData() {},
  },
})
