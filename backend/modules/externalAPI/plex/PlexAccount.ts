import { AxiosInstance } from 'axios'

import { getPlex } from './common/axios'
import { LibraryType } from './types'

const ENDPOINTS = {
  SHARED_SERVER: (serverId: string = '') => `/api/v2/shared_servers${serverId}`,
}

interface IPlexAccountDetails {
  id: string
  uuid: string
  username: string
  email: string
  token: string
}

export class PlexAccount {
  private api: AxiosInstance

  constructor(token: string) {
    this.api = getPlex('https://plex.tv', token)
  }

  async getAccountDetails(): Promise<IPlexAccountDetails> {
    const res = await this.api.get<AccountData>('/users/account')

    return res.data.user
  }

  /**
   * Get all users associated with the account
   * @returns PlexUser
   */
  async getUsers(): Promise<PlexUser[]> {
    const usersData = await this.api
      .get<APIUsers>('/api/users')
      .then((res) => res.data.mediaContainer.user)

    return await Promise.all(usersData.map((userData) => new PlexUser(this.api, userData)))
  }

  /**
   * Update a Plex User attached to the account
   */
  async updateUser(userData: UpdateUserInput): Promise<PlexUser> {
    const user = await this.getUserById(userData.id)

    await user.updateSharing(userData.servers)

    return user
  }

  /**
   * Get a Plex user by their id
   * @param id Plex User UUID
   * @returns PlexUser
   */

  async getUserById(id: string): Promise<PlexUser> {
    const users = await this.getUsers()

    const user = users.find((user) => user.id === id)

    if (user === undefined) throw new Error(`User ID: ${id} does not exist`)

    return user
  }

  async inviteUser(userData: {
    id: string
    servers: Array<{
      machineIdentifier: string
      librarySectionIds: number[]
    }>
  }): Promise<void> {
    await Promise.all(
      userData.servers.map((server) =>
        this.api
          .post<IPlexSharedServerDetails>(ENDPOINTS.SHARED_SERVER(), {
            invitedId: userData.id,
            machineIdentifier: server.machineIdentifier,
            librarySectionIds: server.librarySectionIds ?? [],
          })
          .then((res) => new PlexSharedServer(this.api, res.data))
      )
    )
  }

  /**
   * Returns all devices registered to the account
   */
  async getDevices(): Promise<PlexDevice[]> {
    const { data } = await this.api.get<PlexDeviceData>('/devices.xml')
    return data.mediaContainer.device.map((deviceData) => new PlexDevice(this.api, deviceData))
  }

  /**
   * Returns all media servers registered to the account
   */
  async getServers(): Promise<PlexDeviceServer[]> {
    const { data } = await this.api.get<PlexDeviceData>('/devices.xml')
    return data.mediaContainer.device
      .filter((data) => data.product === 'Plex Media Server')
      .map((data) => new PlexDeviceServer(this.api, data))
  }
}

interface UpdateUserInput {
  id: string
  servers: Array<{
    machineIdentifier: string
    allLibraries: boolean
    librarySectionIds: string[]
  }>
}

type AccountData = {
  user: IPlexAccount
}
type APIUsers = {
  mediaContainer: {
    friendlyName: string
    identifier: string
    machineIdentifier: string
    user: IPlexUser[]
  }
}

class PlexUser implements IPlexUser {
  id: string
  title: string
  username: string
  email: string
  recommendationsPlaylistId: string
  thumb: string
  protected: boolean
  home: boolean
  allowTuners: boolean
  allowSync: boolean
  allowChannels: boolean
  allowCameraUpload: boolean
  allowSubtitleAdmin: boolean
  filterAll: boolean
  filterMovies: boolean
  filterMusic: boolean
  filterPhotos: boolean
  filterTelevision: boolean
  server: IPlexSharedServer[]

  constructor(private api: AxiosInstance, data: IPlexUser) {
    this.id = data.id
    this.title = data.title
    this.username = data.username
    this.email = data.email
    this.recommendationsPlaylistId = data.recommendationsPlaylistId
    this.thumb = data.thumb
    this.protected = data.protected
    this.home = data.home
    this.allowTuners = data.allowTuners
    this.allowSync = data.allowSync
    this.allowChannels = data.allowChannels
    this.allowCameraUpload = data.allowCameraUpload
    this.allowSubtitleAdmin = data.allowSubtitleAdmin
    this.filterAll = data.filterAll
    this.filterMovies = data.filterMovies
    this.filterMusic = data.filterMusic
    this.filterPhotos = data.filterPhotos
    this.filterTelevision = data.filterTelevision
    this.server = data.server
  }

  async getSharedServers(): Promise<PlexSharedServer[]> {
    const sharedServers = this.server.map(async ({ id }) => {
      const res = await this.api.get<IPlexSharedServerDetails>(`/api/v2/shared_servers/${id}`)
      return new PlexSharedServer(this.api, res.data)
    })

    return await Promise.all(sharedServers)
  }

  async updateSharing(
    servers: Array<{
      machineIdentifier: string
      librarySectionIds: string[]
      allLibraries: boolean
    }>
  ) {
    const updates = servers.map(async ({ allLibraries, machineIdentifier, librarySectionIds }) => {
      const sharedServers = await this.getSharedServers()

      const sharedServer = sharedServers.find(
        (server) => server.machineIdentifier === machineIdentifier
      )
      if (allLibraries === false && librarySectionIds.length === 0) {
        if (sharedServer) {
          return this.deleteServerShare(sharedServer.id)
        }
        // if there is no server to delete, then do nothing
        return
      }

      if (sharedServer) {
        // To share all libraries you send an empty librarySectionIds array
        const sectionIds = allLibraries ? [] : librarySectionIds
        return this.updateServerShare(sharedServer.id, sectionIds)
      }
      return this.createServerShare(machineIdentifier, librarySectionIds)
    })

    await Promise.all(updates)
  }

  private async updateServerShare(
    serverShareId: string,
    librarySectionIds: string[]
  ): Promise<void> {
    const sharedServers = await this.getSharedServers()

    const serverShare = sharedServers.find(
      (server) => server.id === serverShareId
    ) as PlexSharedServer

    try {
      const res = await this.api.post<IPlexSharedServerDetails>(
        ENDPOINTS.SHARED_SERVER(serverShare.id),
        {
          machineIdentifier: serverShare.machineIdentifier,
          librarySectionIds,
        }
      )
      serverShare.numLibraries = res.data.numLibraries
      serverShare.libraries = res.data.libraries
      serverShare.allLibraries = res.data.allLibraries
    } catch (err) {
      console.error(err)
    }
  }

  private async createServerShare(
    machineIdentifier: string,
    librarySectionIds: string[]
  ): Promise<void> {
    try {
      await this.api.post<IPlexSharedServerDetails>(ENDPOINTS.SHARED_SERVER(), {
        machineIdentifier,
        librarySectionIds,
        invitedId: this.id,
      })
    } catch (err) {
      console.error(err)
    }
  }

  private async deleteServerShare(sharedServerId: string): Promise<void> {
    try {
      await this.api.delete(ENDPOINTS.SHARED_SERVER(sharedServerId))
    } catch (err) {
      console.error(err)
    }
  }
}

class PlexSharedServer implements IPlexSharedServerDetails {
  api: AxiosInstance
  id: string
  serverId!: number
  name: string
  lastSeenAt: Date
  numLibraries: number
  allLibraries: boolean
  machineIdentifier: string
  libraries?: IPlexSharedLibrary[]
  key: string
  pending!: boolean
  owned!: boolean
  ownerId: number
  invitedId: number
  invitedEmail: string
  accepted: boolean
  acceptedAt: Date
  deletedAt: Date
  leftAt: Date
  inviteToken: string

  constructor(api: AxiosInstance, data: IPlexSharedServerDetails) {
    this.api = api
    this.id = data.id
    this.name = data.name
    this.lastSeenAt = data.lastSeenAt
    this.numLibraries = data.numLibraries
    this.allLibraries = data.allLibraries
    this.machineIdentifier = data.machineIdentifier
    this.ownerId = data.ownerId
    this.invitedId = data.invitedId
    this.inviteToken = data.inviteToken
    this.invitedEmail = data.invitedEmail
    this.accepted = data.accepted
    this.deletedAt = data.deletedAt
    this.acceptedAt = data.acceptedAt
    this.leftAt = data.leftAt
    this.key = `/api/v2/shared_servers/${this.id}`
  }

  async updateSharing(data: {
    allLibraries: boolean
    librarySectionIds: number[]
  }): Promise<boolean> {
    const payload = {
      machineIdentifier: this.machineIdentifier,
      librarySectionIds: [...data.librarySectionIds],
    }
    const res = await this.api.post<IPlexSharedServerDetails>(this.key, payload)
    this.libraries = res.data.libraries
    this.numLibraries = res.data.numLibraries
    this.allLibraries = res.data.allLibraries
    return true
  }

  get librarySectionIds(): string[] | undefined {
    return this.libraries?.map(({ id }) => id)
  }
}

class PlexDevice implements IPlexDevice {
  api: AxiosInstance
  name: string
  publicAddress: string
  product: string
  productVersion: string
  platform: string
  platformVersion: string
  device: string
  model: string
  vendor: string
  provides: string
  clientIdentifier: string
  version: string
  id: string
  token: string
  createdAt: Date
  lastSeenAt: Date
  connection?: { uri: string }[]

  constructor(api: AxiosInstance, data: IPlexDevice) {
    this.api = api
    this.name = data.name
    this.publicAddress = data.publicAddress
    this.product = data.product
    this.productVersion = data.productVersion
    this.platform = data.platform
    this.platformVersion = data.productVersion
    this.device = data.device
    this.model = data.model
    this.vendor = data.vendor
    this.provides = data.provides
    this.clientIdentifier = data.clientIdentifier
    this.version = data.version
    this.id = data.id
    this.token = data.token
    this.createdAt = data.createdAt
    this.lastSeenAt = data.lastSeenAt
    this.connection = data.connection
  }
}

class PlexDeviceServer extends PlexDevice {
  product = 'Plex Media Server'

  async getLibraries(): Promise<IPlexSharedLibrary[]> {
    const { data } = await this.api.get<PlexDeviceServerData>(
      `/api/servers/${this.clientIdentifier}`
    )
    return data.mediaContainer.server[0].section
  }
}

export interface IPlexAccount {
  id: string
  uuid: string
  username: string
  email: string
  token: string
}

export interface IPlexUser {
  id: string
  title: string
  username: string
  email: string
  recommendationsPlaylistId: string
  thumb: string
  protected: boolean
  home: boolean
  allowTuners: boolean
  allowSync: boolean
  allowChannels: boolean
  allowCameraUpload: boolean
  allowSubtitleAdmin: boolean
  filterAll: boolean
  filterMovies: boolean
  filterMusic: boolean
  filterPhotos: boolean
  filterTelevision: boolean
  server: IPlexSharedServer[]
}

export interface IPlexSharedServer {
  id: string
  serverId: number
  machineIdentifier: string
  name: string
  lastSeenAt: Date
  numLibraries: number
  allLibraries: boolean
  owned: boolean
  pending: boolean
}

export interface IPlexSharedServerDetails extends IPlexSharedServer {
  id: string
  name: string
  ownerId: number
  invitedId: number
  invitedEmail: string
  serverId: number
  accepted: boolean
  acceptedAt: Date
  deletedAt: Date
  leftAt: Date
  owned: boolean
  inviteToken: string
  machineIdentifier: string
  lastSeenAt: Date
  numLibraries: number
  allLibraries: boolean
  libraries?: IPlexSharedLibrary[]
}

export interface IPlexSharedLibrary {
  id: string
  key: number
  title: string
  type: LibraryType
}

export interface IPlexDevice {
  name: string
  publicAddress: string
  product: string
  productVersion: string
  platform: string
  platformVersion: string
  device: string
  model: string
  vendor: string
  provides: string
  clientIdentifier: string
  version: string
  id: string
  token: string
  createdAt: Date
  lastSeenAt: Date
  connection?: Array<{ uri: string }>
}

interface PlexDeviceData {
  mediaContainer: {
    device: IPlexDevice[]
  }
}

interface PlexDeviceServerData {
  mediaContainer: {
    server: [
      {
        section: Array<IPlexSharedLibrary>
      }
    ]
  }
}
