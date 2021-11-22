import { AxiosInstance } from 'axios'

import { PlexMovie, PlexShow } from './PlexMedia'
import { IPlexSection, MovieSection, ShowSection } from './PlexSection'
import { PlexServer } from './PlexServer'
import { LibraryType } from './types'

export class PlexLibrary {
  api: AxiosInstance

  constructor(public server: PlexServer) {
    this.api = server.client
  }

  async getRecentlyAdded(): Promise<(PlexShow | PlexMovie)[]> {
    const res = await this.api.get<{ mediaContainer: { metadata: RecentlyAddedMedia[] } }>(
      '/library/recentlyAdded'
    )

    const metadata = res.data.mediaContainer.metadata

    return metadata.flatMap((item) => {
      if (item.type === 'movie') {
        return new PlexMovie(this.api, item.ratingKey)
      } else {
        return new PlexShow(this.api, item.ratingKey)
      }
    })
  }

  async getSections(): Promise<(MovieSection | ShowSection)[]> {
    const res = await this.api.get<Root>('/library/sections')

    const sections = res.data.MediaContainer.Directory.flatMap(({ key, type, uuid }) =>
      type === LibraryType.MOVIE
        ? new MovieSection(this, key, uuid)
        : type === LibraryType.SHOW
        ? new ShowSection(this, key, uuid)
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

export interface RecentlyAddedMedia {
  allowSync: boolean
  librarySectionID: number
  librarySectionTitle: string
  librarySectionUUID: string
  ratingKey: string
  key: string
  parentRatingKey?: string
  guid: string
  parentGuid?: string
  parentStudio?: string
  type: 'movie' | 'show' | 'season' | 'episode'
  title: string
  parentKey?: string
  parentTitle?: string
  parentSummary?: string
  summary: string
  index?: number
  parentIndex?: number
  year?: number
  thumb: string
  art: string
  parentThumb?: string
  parentTheme?: string
  leafCount?: number
  viewedLeafCount?: number
  addedAt: number
  updatedAt: number
  studio?: string
  titleSort?: string
  contentRating?: string
  rating?: number
  audienceRating?: number
  skipCount?: number
  tagline?: string
  duration?: number
  originallyAvailableAt?: string
  audienceRatingImage?: string
  chapterSource?: string
  primaryExtraKey?: string
  ratingImage?: string
  parentYear?: number
  viewOffset?: number
  lastViewedAt?: number
  viewCount?: number
  originalTitle?: string
}
