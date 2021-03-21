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
    try {
      const api = getPlex(baseURL, token)
      const res: RPlexServer = await api.get('/')
      const { friendlyName, machineIdentifier } = res.data.mediaContainer

      return new PlexServer(
        api,
        baseURL,
        token,
        friendlyName,
        machineIdentifier
      )
    } catch (err) {
      throw new Error('Unable to connect to plex server')
    }
  }

  async getLibrary(): Promise<PlexLibrary> {
    if (this._library) {
      return this._library
    }
    this._library = await PlexLibrary.build(this.api)
    return this._library
  }

  static isValid(api: AxiosInstance): Promise<boolean> {
    return api
      .get('/')
      .then((resp) => {
        return true
      })
      .catch((err) => {
        return false
      })
  }
  static testConnection(baseURL: string, token: string): Promise<boolean> {
    const api = getPlex(baseURL, token)

    return api
      .get('/')
      .then((resp) => {
        return true
      })
      .catch((err: AxiosError) => {
        switch (err.code) {
          case 'ENOTFOUND':
            console.error('ERROR: Unable to connect to address')
            break

          default:
            console.error('ERROR: Invalid Plex Token')
            break
        }
        return false
      })
  }
}

interface IPlexServer {
  friendlyName: string
  machineIdentifier: string
}

type RPlexServer = AxiosResponse<{
  mediaContainer: IPlexServer
}>
