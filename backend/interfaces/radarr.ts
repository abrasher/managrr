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
