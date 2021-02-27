import { AxiosInstance, AxiosResponse } from 'axios'

import { getPlex } from './common/axios'
import { IPlexAccount, LibraryType } from './types'

export class PlexAccount implements IPlexAccount {
  private constructor(
    private api: AxiosInstance,
    public id: number,
    public uuid: string,
    public username: string,
    public email: string
  ) {}

  static async build(token: string): Promise<PlexAccount> {
    const api = getPlex('https://plex.tv', token)
    const response: AccountResponse = await api.get('/users/account')
    const { id, uuid, username, email } = response.data.user

    return new PlexAccount(api, id, uuid, username, email)
  }

  inviteUser(): void {
    return
  }

  removeUser(): void {
    return
  }

  updateUser(): void {
    return
  }

  getUser(email: string): Promise<PlexUser | undefined> {
    return this.getUsers()
      .then((users) => users.find((value) => value.email === email))
      .catch((err) => {
        throw err
      })
  }

  async getUsers(): Promise<PlexUser[]> {
    const res: UserResponse = await this.api.get('/api/users')
    const users = res.data.MediaContainer.User

    return users.map((user) => new PlexUser(this.api, user))
  }
  // TODO
  getDevices(): void {
    return
  }
}

type AccountResponse = AxiosResponse<{
  user: IPlexAccount
}>

type UserResponse = AxiosResponse<{
  MediaContainer: {
    friendlyName: string
    identifier: string
    machineIdentifier: string
    User: PlexUser[]
  }
}>

class PlexUser {
  id: number
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
  filterAll: unknown
  filterMovies: unknown
  filterMusic: unknown
  filterPhotos: unknown
  filterTelevision: unknown
  server: PlexUserServer[]
  constructor(private api: AxiosInstance, data: PlexUser) {
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
    this.server = data.Server
  }

  async getSharedLibraries() {
    const servers = await this.getSharedServers()
    return servers.map((server) => server.libraries)
  }

  getSharedServerByName(serverName: string) {
    const serverId = this.server.find((serv) => serv.name === serverName)?.id
    if (serverId !== undefined) {
      return this.getSharedServer(serverId)
    }
  }

  getSharedServers() {
    const serverIDs = this.server.map((val) => val.id)
    return Promise.all(serverIDs.map((id) => this.getSharedServer(id)))
  }

  private getSharedServer(id: number) {
    return this.api
      .get(`/api/v2/shared_servers/${id}`)
      .then(
        (response: SharedServerResponse) =>
          new PlexSharedServer(this.api, response.data)
      )
      .catch((err) => {
        console.error(err)
        throw err
      })
  }
}

class PlexSharedServer {
  api: AxiosInstance
  id: number
  name: string
  ownerId: number
  invitedId: number
  invitedEmail: string | null
  serverId: number
  accepted: boolean
  acceptedAt: string | null
  deletedAt: string | null
  leftAt: unknown
  owned: boolean
  inviteToken: string
  machineIdentifier: string
  lastSeenAt: string
  numLibraries: number
  allLibraries: boolean
  libraries: TPlexSharedLibrary[]
  key: string
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

  update(data: { shareAll?: boolean; libraryIDs?: number[] }) {
    this.api
      .post(this.key, {
        machineIdentifier: this.machineIdentifier,
        allLibraries: data.shareAll ?? this.allLibraries,
        librarySectionIds: data.libraryIDs || this.getLibraryIds(),
      })
      .catch((err) => {
        throw err
      })
  }

  private getLibraryIds() {
    return this.libraries.map((library) => library.id)
  }

  updateLibraries(libraryIDs: number[]) {
    this.update({ libraryIDs })
  }
}

type SharedServerResponse = AxiosResponse<IPlexSharedServer>

interface IPlexSharedServer {
  id: number
  name: string
  ownerId: number
  invitedId: number
  invitedEmail: string | null
  serverId: number
  accepted: boolean
  acceptedAt: string | null
  deletedAt: string | null
  leftAt: unknown
  owned: boolean
  inviteToken: string
  machineIdentifier: string
  lastSeenAt: string
  numLibraries: number
  allLibraries: boolean
  libraries: TPlexSharedLibrary[]
}

interface PlexUser {
  id: number
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
  filterAll: unknown
  filterMovies: unknown
  filterMusic: unknown
  filterPhotos: unknown
  filterTelevision: unknown
  Server: PlexUserServer[]
}

interface PlexUserServer {
  id: number
  serverId: number
  machineIdentifier: string
  name: string
  lastSeenAt: number
  numLibraries: number
  allLibraries: boolean
  owned: boolean
  pending: boolean
}

interface TPlexSharedLibrary {
  id: number
  key: number
  title: string
  type: LibraryType
}
