import { AxiosInstance } from 'axios'

import { IPlexSection, MovieSection, ShowSection } from './PlexSection'
import { PlexServer } from './PlexServer'
import { LibraryType } from './types'

export class PlexLibrary {
  api: AxiosInstance

  constructor(public server: PlexServer) {
    this.api = server.api
  }

  async getSections(): Promise<(MovieSection | ShowSection)[]> {
    const res = await this.api.get<Root>('/library/sections')

    const sections = res.data.MediaContainer.Directory.flatMap(({ key, type }) =>
      type === LibraryType.MOVIE
        ? new MovieSection(this, key)
        : type === LibraryType.SHOW
        ? new ShowSection(this, key)
        : []
    )

    return sections.flat()
  }
}

interface Root {
  MediaContainer: {
    size: number
    allowSync: boolean
    identifier: string
    mediaTagPrefix: string
    mediaTagVersion: number
    title1: string
    Directory: IPlexSection[]
  }
}

export interface MediaContainer {
  size: number
  allowSync: boolean
  identifier: string
  mediaTagPrefix: string
  mediaTagVersion: number
  title1: string
  Directory: IPlexSection[]
}
