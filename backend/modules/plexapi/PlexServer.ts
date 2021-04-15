import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

import { getPlex } from './common/axios'
import { PlexLibrary } from './PlexLibrary'

export class PlexServer {
  private _library?: PlexLibrary

  private constructor(
    public api: AxiosInstance,
    public url: string,
    public token: string,
    public friendlyName: string,
    public machineIdentifier: string
  ) {}

  /**
   * Create an instance of Plex Server
   * @param baseURL url of server with http and port
   * @param token  plex token
   * @param initialize whether or not to preload all data (default is false)
   */
  static async build(baseURL: string, token: string): Promise<PlexServer> {
    const api = getPlex(baseURL, token)
    const res: RPlexServer = await api.get('/').catch((error: AxiosError) => {
      console.log(error)
      if (error.response?.status === 401) {
        throw new Error(`Plex Error: Unauthorized, is your token correct?`)
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error(`Plex Error: Server not found, is your URL correct?`)
      } else {
        throw new Error(`Plex Error: Unknown ${error.message}`)
      }
    })
    if (res.data.mediaContainer === undefined) {
      throw new Error(`Plex Error: Couldn't parse response, is the URL correct?`)
    }

    const { friendlyName, machineIdentifier } = res.data.mediaContainer

    return new PlexServer(api, baseURL, token, friendlyName, machineIdentifier)
  }

  async getLibrary(): Promise<PlexLibrary> {
    if (this._library) {
      return this._library
    }
    this._library = await PlexLibrary.build(this.api)
    return this._library
  }
}

interface IPlexServer {
  friendlyName: string
  machineIdentifier: string
}

type RPlexServer = AxiosResponse<{
  mediaContainer: IPlexServer
}>
