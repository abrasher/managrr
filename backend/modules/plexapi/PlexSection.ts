import { AxiosInstance } from 'axios'

import { PlexLibrary } from './PlexLibrary'
import { PlexMovie, PlexShow } from './PlexMedia'
import { LibraryType } from './types'

export abstract class PlexSection<T> {
  api: AxiosInstance
  abstract type: LibraryType

  constructor(public library: PlexLibrary, public key: string) {
    this.api = library.api
  }

  abstract mapMedia(data: Root<T>): T[]

  async getAllMedia(): Promise<T[]> {
    const res = await this.api.get<Root<T>>(`/library/sections/${this.key}/all`)

    return this.mapMedia(res.data)
  }
}

export class MovieSection extends PlexSection<PlexMovie> {
  type = LibraryType.MOVIE

  constructor(public library: PlexLibrary, public key: string) {
    super(library, key)
  }

  mapMedia(data: Root<PlexMovie>): PlexMovie[] {
    return data.MediaContainer.Metadata.flatMap((item) => new PlexMovie(this, item.ratingKey))
  }
}

export class ShowSection extends PlexSection<PlexShow> {
  type = LibraryType.MOVIE

  constructor(public library: PlexLibrary, public key: string) {
    super(library, key)
  }

  mapMedia(data: Root<PlexShow>): PlexShow[] {
    return data.MediaContainer.Metadata.flatMap((item) => new PlexShow(this, item.ratingKey))
  }
}

interface Root<T> {
  MediaContainer: {
    size: number
    allowSync: boolean
    art: string
    identifier: string
    librarySectionID: number
    librarySectionTitle: string
    librarySectionUUID: string
    mediaTagPrefix: string
    mediaTagVersion: number
    nocache: boolean
    thumb: string
    title1: string
    title2: string
    viewGroup: string
    viewMode: number
    Metadata: T[]
  }
}

export interface IPlexSection {
  allowSync: boolean
  art: string
  composite: string
  filters: boolean
  refreshing: boolean
  thumb: string
  key: string
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
  contentChangedAt: number
  hidden: number
  Location?: Location[] | null
  Preferences: SectionPreferences
}
interface Location {
  id: number
  path: string
}

interface SectionPreferences {
  Setting: SectionSetting[]
}

export interface SectionSetting {
  id: string
  label: string
  summary: string
  type: string
  default: string
  value: string
  hidden: boolean
  advanced: boolean
  group: string
  enumValues?: string | null
}
