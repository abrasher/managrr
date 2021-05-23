import { LibraryType } from '../plexapi'

export type MediaUID = string

export type MetadataMap = Map<MediaUID, BaseMetadata>

export interface BaseMetadata {
  imdbId: string
  title: string
  year: number
  type: LibraryType
}

export interface MetadataAgent {
  getMetadata: <T>(tmdbId: string) => Promise<T | T[] | undefined>
  agentName: string
}

export interface ImporterAgent {
  getMedia(): Promise<Map<MediaUID, BaseMetadata>>
}

export interface Media {
  tmdbId: number
  title: string
  year: number
  type: MediaType
  imdbId: string
}

export enum MediaType {
  TV,
  MOVIE,
}
