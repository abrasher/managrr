import { EntityManager } from '@mikro-orm/sqlite'
import { RadarrMovie } from '@prisma/client'
import { Service } from 'typedi'

import { RadarrInstance } from '../entities'
import { AddMovieToRadarrInput } from '../resolvers/types/movie.types'

export class RadarrAPI {
  constructor(private url: string, private apikey: string) {}

  async addMovie() {
    console.log(await this.getSettings())
  }

  // async addMovie(input: AddMovieToRadarrInput): Promise<RadarrMovie> {
  //   const api = await this.api(input.radarrUrl)

  //   const lookupResults = await api.get<LookupResult>('/movie/lookup', {
  //     params: {
  //       term: `tmdb:${input.movieId}`,
  //     },
  //   })

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
