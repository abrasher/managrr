import { AxiosInstance, AxiosResponse } from 'axios'
import { IPlexMedia, PlexMedia } from './PlexMedia'

export type LibraryType = 'movie' | 'music' | 'photo' | 'show'
interface LibraryPath {
  path: string
}

export class PlexLibrary {
  private constructor(api: AxiosInstance, public sections: PlexSection[]) {}

  static async build(api: AxiosInstance): Promise<PlexLibrary> {
    const res: LibraryResponse = await api.get('/library/sections')

    const sectionPromises = res.data.mediaContainer.directory.map((dir) => {
      return PlexSection.build(api, dir)
    })
    const sections = await Promise.all(sectionPromises)

    return new PlexLibrary(api, sections)
  }
}

export class PlexSection {
  private constructor(
    public api: AxiosInstance,
    public allowSync: boolean,
    public refreshing: boolean,
    public key: number,
    public type: LibraryType,
    public title: string,
    public agent: string,
    public scanner: string,
    public language: string,
    public uuid: string,
    public location: LibraryPath[],
    public media: PlexMedia[]
  ) {}

  static async build(
    api: AxiosInstance,
    data: IPlexSection
  ): Promise<PlexSection> {
    const {
      allowSync,
      refreshing,
      key,
      type,
      title,
      agent,
      scanner,
      language,
      uuid,
      location,
    } = data

    const res: MediaResponse = await api.get(`/library/sections/${key}/all`)
    const media = res.data.mediaContainer.metadata.map((data) => {
      return new PlexMedia(data)
    })

    return new PlexSection(
      api,
      allowSync,
      refreshing,
      key,
      type,
      title,
      agent,
      scanner,
      language,
      uuid,
      location,
      media
    )
  }
}

type LibraryResponse = AxiosResponse<{
  mediaContainer: {
    // Array of server libraries
    directory: IPlexSection[]
  }
}>

export type MediaResponse = AxiosResponse<{
  mediaContainer: {
    metadata: IPlexMedia[]
  }
}>

interface IPlexSection {
  allowSync: boolean
  art: string
  filters: boolean
  refreshing: boolean
  thumb: string
  key: number
  type: LibraryType
  title: string
  agent: string
  scanner: string
  language: string
  uuid: string
  updatedAt: number
  createdAt: number
  scannedAt: number
  content: boolean
  directory: boolean
  location: LibraryPath[]
}
