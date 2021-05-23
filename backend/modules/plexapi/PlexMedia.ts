import { AxiosInstance } from 'axios'

import { MovieSection, PlexSection, ShowSection } from './PlexSection'
import { LibraryType } from './types'

export class PlexMedia<T> {
  api: AxiosInstance
  constructor(public section: PlexSection<unknown>, public ratingKey: string) {
    this.api = section.api
  }

  async getDetails(): Promise<T> {
    const res = await this.api.get<Root<T>>(`/library/metadata/${this.ratingKey}`)
    return res.data.MediaContainer.Metadata[0]
  }
}

export class PlexMovie extends PlexMedia<IPlexMovieDetailed> {
  constructor(public section: MovieSection, public ratingKey: string) {
    super(section, ratingKey)
  }
}

export class PlexShow extends PlexMedia<IPlexShowDetailed> {
  constructor(public section: ShowSection, public ratingKey: string) {
    super(section, ratingKey)
  }
}

interface Root<T> {
  MediaContainer: {
    size: number
    allowSync: boolean
    identifier: string
    librarySectionID: number
    librarySectionTitle: string
    librarySectionUUID: string
    mediaTagPrefix: string
    mediaTagVersion: number
    Metadata: [T]
  }
}

export interface IPlexMediaBase {
  ratingKey: string
  key: string
  guid: string
  studio: string
  type: LibraryType
  title: string
  contentRating: string
  summary: string
  audienceRating: number
  year: number
  thumb: string
  art: string
  duration: number
  originallyAvailableAt: string
  addedAt: number
  updatedAt: number
  audienceRatingImage: string
  Genre: Genre[]
  Role: Role[]
}

export type IPlexMediaMetadata = IPlexMovieDetailed | IPlexShowDetailed

export interface IPlexMovie extends IPlexMediaBase {
  rating: number
  tagline: string
  chapterSource: string
  primaryExtraKey: string
  ratingImage: string
  Media: Media[]
  Director: Director[]
  Writer: Writer[]
  Country: Country[]
}

interface IPlexMovieDetailed extends IPlexMovie {
  librarySectionTitle: string
  librarySectionID: number
  librarySectionKey: string
  Producer: Producer[]
  Guid?: Guid[]
  Field: Field[]
}

export interface IPlexShow extends IPlexMediaBase {
  skipChildren?: boolean | undefined
  index: number
  theme: string
  leafCount: number
  viewedLeafCount: number
  childCount: number
}

interface IPlexShowDetailed extends IPlexShow {
  librarySectionTitle: string
  librarySectionID: number
  librarySectionKey: string
  Guid?: Guid[]
  Similar: Similar[]
  Location: Location[]
}

interface Field {
  locked: boolean
  name: string
}

interface Role {
  tag: string
}

interface Guid {
  id: string
}

interface Media {
  id: number
  duration?: number
  bitrate?: number
  width?: number
  height?: number
  aspectRatio: number
  audioChannels: number
  audioCodec: string
  videoCodec: string
  videoResolution: number
  container: string
  videoFrameRate: string
  part: MediaPart[]
}

interface Genre {
  id: number
  filter: string
  tag: string
}

interface Director {
  id: number
  filter: string
  tag: string
}

interface Writer {
  id: number
  filter: string
  tag: string
}

interface Producer {
  id: number
  filter: string
  tag: string
}

interface Country {
  id: number
  filter: string
  tag: string
}

interface Similar {
  id: number
  filter: string
  tag: string
}

interface Location {
  path: string
}

interface MediaPart {
  id: number
  key: string
  duration: number
  file: string
  size: number
  audioProfile: string
  container: string
  indexes: string
  videoProfile: string
  stream?: MediaStream[]
}

interface MediaStream {
  id: number
  streamType: number
  default?: boolean | null
  codec: string
  index: number
  bitrate: number
  bitDepth: number
  chromaLocation?: string | null
  chromaSubsampling?: string | null
  codedHeight?: number | null
  codedWidth?: number | null
  colorPrimaries?: string | null
  colorRange?: string | null
  colorSpace?: string | null
  colorTrc?: string | null
  frameRate?: number | null
  hasScalingMatrix?: boolean | null
  headerCompression: boolean
  height?: number | null
  level?: number | null
  profile: string
  refFrames?: number | null
  scanType?: string | null
  width?: number | null
  displayTitle: string
  extendedDisplayTitle: string
  channels?: number | null
  language?: string | null
  languageCode?: string | null
  audioChannelLayout?: string | null
  samplingRate?: number | null
  selected?: boolean | null
}
