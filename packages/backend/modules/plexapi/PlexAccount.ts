import { AxiosInstance } from 'axios'
import { getPlex } from './common/axios'
import { LibraryType } from './types'

const ENDPOINTS = {
  SHAREDSERVER: '/api/v2/shared_servers',
}

export class PlexAccount implements IPlexAccount {
  private constructor(
    private api: AxiosInstance,
    public id: string,
    public uuid: string,
    public username: string,
    public email: string,
    public users: PlexUser[],
    public token: string
  ) {}

  static async build(token: string): Promise<PlexAccount> {
    const api = getPlex('https://plex.tv', token)
    const { id, uuid, username, email } = await api
      .get<AccountData>('/users/account')
      .then((res) => res.data.user)

    const users = await this.fetchUsers(api)

    return new PlexAccount(api, id, uuid, username, email, users, token)
  }

  static async fetchUsers(api: AxiosInstance): Promise<PlexUser[]> {
    const usersData = await api
      .get<APIUsers>('/api/users')
      .then((res) => res.data.mediaContainer.user)

    return await Promise.all(
      usersData.map((userData) => PlexUser.build(api, userData))
    )
  }

  /**
   * Update a Plex User attached to the account
   */
  async updateUser(userData: UpdateUserInput): Promise<PlexUser> {
    const user = this.getUserById(userData.id)

    await user.updateSharing(userData.servers)

    //const otherUsers = this.users.filter((user) => user.id !== userData.id)
    //this.users = [...otherUsers, user]

    return user
  }

  private getUserById(id: string): PlexUser {
    const user = this.users.find((user) => user.id === id)

    if (user === undefined) throw new Error(`User ID: ${id} does not exist`)

    return user
  }

  async inviteUser(userData: {
    id: string
    servers: Array<{
      machineIdentifier: string
      librarySectionIds: number[]
    }>
  }): Promise<PlexUser> {
    const sharedServers = userData.servers.map((server) =>
      this.api
        .post<IPlexSharedServer>(ENDPOINTS.SHAREDSERVER, {
          invitedId: userData.id,
          machineIdentifier: server.machineIdentifier,
          librarySectionIds: server.librarySectionIds ?? [],
        })
        .then((res) => new PlexSharedServer(this.api, res.data))
    )
    //

    const user = this.getUserById(userData.id)
    user.sharedServers.push(...(await Promise.all(sharedServers)))

    return user
  }

  async refresh(): Promise<void> {
    this.users = await PlexAccount.fetchUsers(this.api)
  }

  /**
   * Returns all devices registered to the account
   */
  async getDevices(): Promise<PlexDevice[]> {
    const { data } = await this.api.get<PlexDeviceData>('/devices.xml')
    return data.mediaContainer.device.map(
      (deviceData) => new PlexDevice(this.api, deviceData)
    )
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
    user: UserData[]
  }
}

class PlexUser implements IPlexUser {
  //#region
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
  //#endregion

  private constructor(
    private api: AxiosInstance,
    data: UserData,
    public sharedServers: PlexSharedServer[] = []
  ) {
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
  }

  static async build(api: AxiosInstance, data: UserData): Promise<PlexUser> {
    const sharedServersRes = data.server?.map(async (share) => {
      const res = await api.get<IPlexSharedServer>(
        `/api/v2/shared_servers/${share.id}`
      )
      return new PlexSharedServer(api, res.data)
    })

    const sharedServers = sharedServersRes
      ? await Promise.all(sharedServersRes)
      : []

    return new PlexUser(api, data, sharedServers)
  }

  async updateSharing(
    servers: Array<{
      machineIdentifier: string
      librarySectionIds: string[]
      allLibraries: boolean
    }>
  ) {
    const updates = servers.map(
      async ({ allLibraries, machineIdentifier, librarySectionIds }) => {
        const sharedServer = this.sharedServers.find(
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
      }
    )

    await Promise.all(updates)
  }

  private async updateServerShare(
    serverShareId: string,
    librarySectionIds: string[]
  ): Promise<void> {
    console.log('Updating Server')
    const serverShare = this.sharedServers.find(
      (server) => server.id === serverShareId
    ) as PlexSharedServer
    const uri = `${ENDPOINTS.SHAREDSERVER}/${serverShare.id}`
    try {
      const res = await this.api.post<IPlexSharedServer>(uri, {
        machineIdentifier: serverShare.machineIdentifier,
        librarySectionIds,
      })
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
    console.log('Creating Server')
    try {
      const res = await this.api.post<IPlexSharedServer>(
        ENDPOINTS.SHAREDSERVER,
        {
          machineIdentifier,
          librarySectionIds,
          invitedId: this.id,
        }
      )
      const newSharedServer = new PlexSharedServer(this.api, res.data)
      this.sharedServers.push(newSharedServer)
    } catch (err) {
      console.error(err)
    }
  }

  private async deleteServerShare(sharedServerId: string): Promise<void> {
    console.log('Deleting Server')
    try {
      await this.api.delete(`${ENDPOINTS.SHAREDSERVER}/${sharedServerId}`)
      this.sharedServers = this.sharedServers.filter(
        (share) => share.id !== sharedServerId
      )
    } catch (err) {
      console.error(err)
    }
  }
}

class PlexSharedServer implements IPlexSharedServer {
  //#region
  api: AxiosInstance
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
  key: string
  //#endregion
  constructor(api: AxiosInstance, data: IPlexSharedServer) {
    this.api = api
    this.id = data.id
    this.name = data.name
    this.ownerId = data.ownerId
    this.invitedId = data.invitedId
    this.invitedEmail = data.invitedEmail
    this.serverId = data.serverId
    this.accepted = data.accepted
    this.acceptedAt = data.acceptedAt
    this.deletedAt = data.deletedAt
    this.leftAt = data.leftAt
    this.owned = data.owned
    this.inviteToken = data.inviteToken
    this.machineIdentifier = data.machineIdentifier
    this.lastSeenAt = data.lastSeenAt
    this.numLibraries = data.numLibraries
    this.allLibraries = data.allLibraries
    this.libraries = data.libraries
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
    const res = await this.api.post<IPlexSharedServer>(this.key, payload)
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
}

interface UserData extends IPlexUser {
  server?: Array<{
    id: number
    serverId: number
    machineIdentifier: string
    name: string
    lastSeenAt: Date
    numLibraries: number
    allLibraries: boolean
    owned: boolean
    pending: boolean
  }>
}

export interface IPlexSharedServer {
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
