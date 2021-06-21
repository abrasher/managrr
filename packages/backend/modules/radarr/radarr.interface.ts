import { Availability } from '../../entities/radarr.type'
// export interface RadarrMovie {
//   id: number
//   title: string
//   sortTitle: string
//   sizeOnDisk: number
//   overview: string
//   year: number
//   hasFile: boolean
//   qualityProfileId: number
//   monitored: boolean
//   isAvailable: boolean
//   minimumAvailablitity: Availability
//   imdbId: string
//   tmdbId: number
//   images: Record<string, unknown>
// }

export interface DeleteRadarrPayload {
  id: number
  addImportExclusion?: boolean
  deleteFiles?: boolean
}

export interface UpdateRadarrPayload extends RadarrPayloadOptions {
  id: number
}

export interface AddRadarrPayload extends RadarrPayloadOptions {
  tmdbId: number
  search?: boolean
}

interface RadarrPayloadOptions {
  monitored?: boolean
  qualityProfileId?: number
  tags?: number[]
  minimumAvailablity?: Availability
}

export interface RadarrMovie {
  title: string
  originalTitle: string
  alternateTitles?: AlternateTitles[]
  secondaryYearSourceId: number
  sortTitle: string
  sizeOnDisk: number
  status: string
  overview: string
  inCinemas: string
  physicalRelease: string
  digitalRelease: string
  images?: Images[]
  website: string
  year: number
  hasFile: boolean
  youTubeTrailerId: string
  studio: string
  path: string
  qualityProfileId: number
  monitored: boolean
  minimumAvailability: string
  isAvailable: boolean
  folderName: string
  runtime: number
  cleanTitle: string
  imdbId: string
  tmdbId: number
  titleSlug: string
  certification: string
  genres?: string[]
  tags?: null[]
  added: string
  ratings: Ratings
  movieFile: MovieFile
  id: number
}

interface AlternateTitles {
  sourceType: string
  movieId: number
  title: string
  sourceId: number
  votes: number
  voteCount: number
  language: Language
  id: number
}

export interface Language {
  id: number
  name: string
}

interface Images {
  coverType: string
  url: string
  remoteUrl: string
}

interface Ratings {
  votes: number
  value: number
}

interface MovieFile {
  movieId: number
  relativePath: string
  path: string
  size: number
  dateAdded: string
  indexerFlags: number
  quality: Quality
  mediaInfo: MediaInfo
  qualityCutoffNotMet: boolean
  languages?: Language[]
  releaseGroup?: string
  edition: string
  id: number
}
interface Quality {
  quality: {
    id: number
    name: string
    source: string
    resolution: number
    modifier: string
  }
  revision: {
    version: number
    real: number
    isRepack: boolean
  }
}

interface MediaInfo {
  audioAdditionalFeatures: string
  audioBitrate: number
  audioChannels: number
  audioCodec: string
  audioLanguages: string
  audioStreamCount: number
  videoBitDepth: number
  videoBitrate: number
  videoCodec: string
  videoFps: number
  resolution: string
  runTime: string
  scanType: string
  subtitles: string
}
