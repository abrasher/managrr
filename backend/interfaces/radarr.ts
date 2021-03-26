import { Availablity } from '../entities/radarr.entity'
export interface RadarrMovie {
  id: number
  title: string
  sortTitle: string
  sizeOnDisk: number
  overview: string
  year: number
  hasFile: boolean
  qualityProfileId: number
  monitored: boolean
  isAvailable: boolean
  minimumAvailablitity: Availablity
  imdbId: string
  tmdbId: number
  images: Record<string, unknown>
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
  minimumAvailablity?: Availablity
}
