import { existsSync, readFileSync, writeFileSync } from 'fs'
import { merge } from 'lodash'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

interface ISystemSettings {
  instanceId: string
  port: number
  apiKey: string
}

const SETTINGS_FILE = path.join(process.cwd(), 'settings.json')

const defaultSettings: ISystemSettings = {
  instanceId: uuidv4(),
  apiKey: uuidv4(),
  port: 9549,
}

export const getSystemSettings = (): SystemSettings => {
  const settings = new SystemSettings()
  return settings
}

class SystemSettings {
  private _instance: SystemSettings | null = null

  data!: ISystemSettings

  constructor() {
    if (this._instance) {
      return this._instance
    }

    this.data = defaultSettings
    this.loadSettings()
    this._instance = this
    this.saveSettings()
  }

  loadSettings() {
    if (!existsSync(SETTINGS_FILE)) return
    const rawFile = readFileSync(SETTINGS_FILE, 'utf8')
    const fileData = JSON.parse(rawFile)

    this.data = merge(this.data, fileData)
  }

  get instanceId() {
    return this.data.instanceId
  }

  get port() {
    return this.data.port
  }

  setSetting<K extends keyof ISystemSettings>(key: K, value: ISystemSettings[K]) {
    this.data[key] = value
    this.saveSettings()
  }

  saveSettings() {
    writeFileSync(SETTINGS_FILE, JSON.stringify(this.data, null, 2))
  }
}
