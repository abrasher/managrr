import { AxiosInstance, AxiosResponse } from 'axios'

import { IPlexMedia } from './PlexMedia'
import { IPlexSection, PlexSection } from './PlexSection'

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
