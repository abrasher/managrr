import { defineStore } from 'pinia'

const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    showAdvanced: false,
  }),
  actions: {
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced
    },
  },
})
