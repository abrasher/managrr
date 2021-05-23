import { AxiosError, AxiosInstance } from 'axios'

import { getPlex } from './common/axios'
import { PlexLibrary } from './PlexLibrary'

export class PlexServer {
  api: AxiosInstance
  library: PlexLibrary

  constructor(public url: string, public token: string) {
    this.api = getPlex(url, token)
    this.library = new PlexLibrary(this)
  }

  async getDetails(): Promise<IPlexServer> {
    const res = await this.api.get<Root>('/').catch((error: AxiosError) => {
      console.log(error)
      if (error.response?.status === 401) {
        throw new Error(`Plex Error: Unauthorized, is your token correct?`)
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error(`Plex Error: Server not found, is your URL correct?`)
      } else {
        throw new Error(`Plex Error: Unknown ${error.message}`)
      }
    })
    if (res.data.MediaContainer === undefined) {
      throw new Error(`Plex Error: Couldn't parse response, is the URL correct?`)
    }

    return res.data.MediaContainer
  }

  uploadPoster(ratingKey: string | number, poster: Buffer): void {
    this.api.post(`/library/metadata/${ratingKey}/posters`, poster).catch(() => {
      throw new Error(`Plex Error: Unable to Upload Poster for ${ratingKey}`)
    })
  }
}

interface Root {
  MediaContainer: IPlexServer
}

interface IPlexServer {
  size: number
  allowCameraUpload: boolean
  allowChannelAccess: boolean
  allowMediaDeletion: boolean
  allowSharing: boolean
  allowSync: boolean
  allowTuners: boolean
  backgroundProcessing: boolean
  certificate: boolean
  companionProxy: boolean
  countryCode: string
  diagnostics: string
  eventStream: boolean
  friendlyName: string
  hubSearch: boolean
  itemClusters: boolean
  livetv: number
  machineIdentifier: string
  mediaProviders: boolean
  multiuser: boolean
  myPlex: boolean
  myPlexMappingState: string
  myPlexSigninState: string
  myPlexSubscription: boolean
  myPlexUsername: string
  offlineTranscode: number
  ownerFeatures: string
  photoAutoTag: boolean
  platform: string
  platformVersion: string
  pluginHost: boolean
  pushNotifications: boolean
  readOnlyLibraries: boolean
  requestParametersInCookie: boolean
  streamingBrainABRVersion: number
  streamingBrainVersion: number
  sync: boolean
  transcoderActiveVideoSessions: number
  transcoderAudio: boolean
  transcoderLyrics: boolean
  transcoderPhoto: boolean
  transcoderSubtitles: boolean
  transcoderVideo: boolean
  transcoderVideoBitrates: string
  transcoderVideoQualities: string
  transcoderVideoResolutions: string
  updatedAt: number
  updater: boolean
  version: string
  voiceSearch: boolean
  Directory?: Directory[] | null
}

interface Directory {
  count: number
  key: string
  title: string
}
