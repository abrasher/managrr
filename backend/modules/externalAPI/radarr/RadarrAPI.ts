import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'

import { logger } from '../../../common/logger'
import {
  AddRadarrPayload,
  DeleteRadarrPayload,
  IRadarrMovie,
  UpdateRadarrPayload,
} from './radarr.interface'

type ITestResponse = AxiosResponse<{ osName: string | undefined }>

export class RadarrAPI {
  api: AxiosInstance

  constructor(url: string, apikey: string) {
    this.api = axios.create({
      baseURL: `${url}/api/v3`,
      headers: {
        'x-api-key': apikey,
      },
    })
  }

  async testConnection(): Promise<boolean> {
    return await this.api
      .get('/system/status')
      .then((res: ITestResponse) => {
        if (res?.data?.osName === undefined) {
          throw new Error(`Radarr Error: Couldn't parse response, is your URL correct?`)
        }
        return true
      })
      .catch((error: AxiosError): never => {
        if (error.response?.status === 401) {
          throw new Error(`Radarr Error: Unauthorized, is your API Key correct?`)
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new Error(`Radarr Error: Server not found, is your URL correct?`)
        }
        throw new Error(`Radarr Error: Unknown ${error.message}`)
      })
  }

  async getMovies(): Promise<IRadarrMovie[]> {
    const res = await this.api.get<IRadarrMovie[]>('/movie')

    return res.data
  }

  async addMovie(input: AddRadarrPayload): Promise<IRadarrMovie | null> {
    const { tmdbId, minimumAvailability, monitored, qualityProfileId, tags, search = false } = input

    logger.info(`Radarr API: Adding Movie`)

    const lookupRes = await this.api.get<IRadarrMovie[]>('/movie/lookup', {
      params: {
        term: `tmdb:${tmdbId}`,
      },
    })

    if (lookupRes.data.length === 0) {
      logger.error(`Radarr API: No Movies Found`)
      return null
    } else if (lookupRes.data.length > 1) {
      logger.warn(
        `Radarr API: Found ${lookupRes.data.length} Movies, Adding ${lookupRes.data[0].title}`
      )
    }

    const { title, year, images } = lookupRes.data[0]

    const payload = {
      title,
      year,
      tmdbId,
      monitored,
      qualityProfileId,
      minimumAvailability,
      tags,
      images,
      rootFolderPath: '/storage/media/movies',
      addOptions: {
        searchForMovie: search,
      },
    }

    const addRes = await this.api.post<IRadarrMovie>('/movie', payload)

    return addRes.data
  }

  async updateMovie(input: UpdateRadarrPayload): Promise<IRadarrMovie> {
    logger.debug(`Radarr API: Updating Movie ${input.id}`)
    const res = await this.api.put<IRadarrMovie>('/movie', input)

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
