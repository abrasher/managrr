import axios from 'axios'
import { defineStore } from 'pinia'

interface State {
  showAdvanced: boolean
  loggedInStatus: boolean
}

interface Storage {
  loggedIn: boolean
  rememberMe: boolean
}

const useStorage = <T>() => {
  return {
    getItem(key: keyof T & string): T[typeof key] | null {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : item
    },
    setItem(key: keyof T & string, value: T[typeof key]) {
      localStorage.setItem(key, JSON.stringify(value))
    },
    removeItem(key: string) {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    },
    clear() {
      localStorage.clear()
      sessionStorage.clear()
    },
  }
}

const storage = useStorage<Storage>()

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    showAdvanced: false,
    plexInstances: [],
    loggedIn: storage.getItem('loggedIn') ?? null,
    rememberMe: false,
  }),
  actions: {
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced
      storage.setItem('showAdvanced', this.showAdvanced)
    },
    login(rememberMe: boolean) {
      this.loggedIn = true
      if (rememberMe) storage.setItem('loggedIn', true)
    },
    logout() {
      this.loggedIn = false
      storage.setItem('loggedIn', false)
    },
    async refreshAuthentication(): Promise<boolean> {
      try {
        await axios.post('/refresh')
        return true
      } catch {
        return false
      }
    },
  },
})
