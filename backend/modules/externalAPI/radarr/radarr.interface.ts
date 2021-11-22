import { Availability } from '../../../entities/radarr.type'

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
  minimumAvailability?: Availability
}

export interface IRadarrMovie {
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
  movieFile: IRadarrMovieFile
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

export interface Images {
  coverType: string
  url: string
  remoteUrl: string
}

interface Ratings {
  votes: number
  value: number
}

export interface IRadarrMovieFile {
  movieId: number
  relativePath: string
  path: string
  size: number
  dateAdded: string
  indexerFlags: number
  quality: IRadarrQuality
  mediaInfo: IRadarrMediaInfo
  qualityCutoffNotMet: boolean
  languages?: Language[]
  releaseGroup?: string
  edition: string
  id: number
}
interface IRadarrQuality {
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

interface IRadarrMediaInfo {
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
