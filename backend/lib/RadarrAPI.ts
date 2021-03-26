import { EntityManager } from '@mikro-orm/sqlite'
import { AxiosInstance } from 'axios'
import axios from 'axios'
import { Service } from 'typedi'

import { RadarrInstance } from '../entities'
import { AddRadarrPayload, RadarrMovie, UpdateRadarrPayload } from '../interfaces/radarr'
import { AddMovieToRadarrInput } from '../resolvers/types/movie.types'
import { logger } from './logger'

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

  async addMovie({
    tmdbId,
    minimumAvailablity,
    monitored,
    qualityProfileId,
    tags,
    search = false,
  }: AddRadarrPayload): Promise<RadarrMovie | null> {
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

  // async addMovie(input: AddMovieToRadarrInput): Promise<RadarrMovie> {
  //   const api = await this.api(input.radarrUrl)

  //

  //   const { title, year, tmdbId, images } = lookupResults.data[0]

  //   const { monitored, qualityProfileId, search } = input

  //   const payload = {
  //     title,
  //     year,
  //     tmdbId,
  //     monitored,
  //     qualityProfileId,
  //     images,
  //     rootFolderPath: '/storage/media/movies',
  //     addOptions: {
  //       searchForMovie: search,
  //     },
  //   }

  //   console.log(payload)

  //   const result = await api.post<RadarrMovie>('/movie', payload)

  //   return result.data
  // }
}
