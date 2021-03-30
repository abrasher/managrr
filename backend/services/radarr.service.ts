import { EntityManager } from '@mikro-orm/sqlite'
import axios from 'axios'
import { Service } from 'typedi'

import { RadarrInstance } from '../entities'
import { RadarrMovie } from '../modules/radarr/radarr'
import { AddMovieToRadarrInput } from '../resolvers/types/movie.types'

@Service()
export class RadarrService {
  constructor(private em: EntityManager) {}

  async api(url: string) {
    const { apiKey } = await this.em.findOneOrFail(RadarrInstance, { url })

    return axios.create({
      baseURL: `${url}/api/v3`,
      params: {
        apikey: apiKey,
      },
    })
  }

  async getQualityProfile(instanceName: string, id: number) {
    const radarrSettings = await this.em.findOneOrFail(RadarrInstance, {})
  }

  async addMovie(input: AddMovieToRadarrInput): Promise<RadarrMovie> {
    const api = await this.api(input.radarrUrl)

    const lookupResults = await api.get<LookupResult>('/movie/lookup', {
      params: {
        term: `tmdb:${input.movieId}`,
      },
    })

    const { title, year, tmdbId, images } = lookupResults.data[0]

    const { monitored, qualityProfileId, search } = input

    const payload = {
      title,
      year,
      tmdbId,
      monitored,
      qualityProfileId,
      images,
      rootFolderPath: '/storage/media/movies',
      addOptions: {
        searchForMovie: search,
      },
    }

    console.log(payload)

    const result = await api.post<RadarrMovie>('/movie', payload)

    return result.data
  }
}

type LookupResult = Array<RadarrMovie>
