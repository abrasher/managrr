import { AxiosInstance } from 'axios'
import axios from 'axios'

import { logger } from '../../lib/logger'
import { AddRadarrPayload, DeleteRadarrPayload, RadarrMovie, UpdateRadarrPayload } from './radarr.interface'

export class RadarrAPI {
  api: AxiosInstance

  constructor(url: string, apikey: string) {
    this.api = axios.create({
      baseURL: url,
      headers: {
        'x-api-key': apikey,
      },
    })
  }

  async addMovie(input: AddRadarrPayload): Promise<RadarrMovie | null> {
    const { tmdbId, minimumAvailablity, monitored, qualityProfileId, tags, search = false } = input

    logger.info(`Radarr API: Adding Movie`)

    const lookupRes = await this.api.get<RadarrMovie[]>('/movie/lookup', {
      params: {
        term: `tmdb:${tmdbId}`,
      },
    })

    if (lookupRes.data.length === 0) {
      logger.error(`Radarr API: No Movies Found`)
      return null
    } else if (lookupRes.data.length > 1) {
      logger.warn(`Radarr API: Found ${lookupRes.data.length} Movies, Adding ${lookupRes.data[0].title}`)
    }

    const { title, year, images } = lookupRes.data[0]

    const payload = {
      title,
      year,
      tmdbId,
      monitored,
      qualityProfileId,
      minimumAvailablity,
      tags,
      images,
      rootFolderPath: '/storage/media/movies',
      addOptions: {
        searchForMovie: search,
      },
    }

    const addRes = await this.api.post<RadarrMovie>('/movie', payload)

    return addRes.data
  }

  async updateMovie(input: UpdateRadarrPayload): Promise<RadarrMovie> {
    logger.debug(`Radarr API: Updating Movie ${input.id}`)
    const res = await this.api.put<RadarrMovie>('/movie', input)

    return res.data
  }

  async removeMovie(input: DeleteRadarrPayload): Promise<void> {
    const { id, addImportExclusion = false, deleteFiles = false } = input

    await this.api.delete(`/movie/${id}`, {
      params: {
        addImportExclusion,
        deleteFiles,
      },
    })
  }

  /**
   * Tell Radarr to Search Movies
   * @param movieIds Array of Movie IDs To Search For
   */
  async searchMovies(movieIds: number[]): Promise<void> {
    await this.api.post('/command', {
      name: 'MoviesSearch',
      movieIds,
    })
  }
}
