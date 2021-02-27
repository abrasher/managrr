import { AxiosInstance, AxiosResponse } from 'axios'
import { getPlex } from './common/axios'

import { PlexLibrary } from './PlexLibrary'

export class PlexServer {
  private constructor(
    public api: AxiosInstance,
    public url: string,
    public token: string,
    public friendlyName: string,
    public machineIdentifier: string,
    public library?: PlexLibrary
  ) {}

  /**
   * Create an instance of Plex Server
   * @param baseURL url of server with http and port
   * @param token  plex token
   * @param initialize whether or not to preload all data (default is false)
   */
  static async build(
    baseURL: string,
    token: string,
    initialize: boolean = false
  ): Promise<PlexServer> {
    const api = getPlex(baseURL, token)
    const res: RPlexServer = await api.get('/')
    const { friendlyName, machineIdentifier } = res.data.mediaContainer

    return new PlexServer(
      api,
      baseURL,
      token,
      friendlyName,
      machineIdentifier,
      initialize ? await PlexLibrary.build(api) : undefined
    )
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
}

interface IPlexServer {
  friendlyName: string
  machineIdentifier: string
}

type RPlexServer = AxiosResponse<{
  mediaContainer: IPlexServer
}>
