import { AxiosInstance } from 'axios'

import { LibraryType } from '.'
import { MediaResponse } from './PlexLibrary'
import { PlexMedia } from './PlexMedia'
import { IPlexPath } from './types'

export class PlexSection implements IPlexSection {
  art!: string
  allowSync!: boolean
  refreshing!: boolean
  key!: number
  type!: LibraryType
  title!: string
  agent!: string
  scanner!: string
  language!: string
  uuid!: string
  filters!: boolean
  thumb!: string
  updatedAt!: number
  createdAt!: number
  scannedAt!: number
  content!: boolean
  directory!: boolean
  media!: PlexMedia[]
  location!: IPlexPath[]

  private constructor(
    public api: AxiosInstance,
    data: Omit<PlexSection, 'api'>
  ) {
    Object.assign(this, data)
  }

  static async build(
    api: AxiosInstance,
    data: IPlexSection
  ): Promise<PlexSection> {
    const res: MediaResponse = await api.get(
      `/library/sections/${data.key}/all`
    )
    const media = res.data.mediaContainer.metadata.map((data) => {
      return new PlexMedia(api, data)
    })

    return new PlexSection(api, {
      ...data,
      media,
    })
  }
}

export interface IPlexSection {
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
  location: IPlexPath[]
}
