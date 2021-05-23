import { AxiosInstance } from 'axios'
import { setup } from 'axios-cache-adapter'
import { CamelCasedPropertiesDeep } from 'type-fest'

import { camelizeKeys } from '@/lib/utils'

export class TMDbMetadataAgent {
  readonly agentName = 'TMDb'

  api?: AxiosInstance

  constructor(tmdbKey: string | null) {
    if (tmdbKey) {
      this.api = setup({
        baseURL: 'https://api.themoviedb.org/3',
        params: {
          api_key: tmdbKey,
        },
      })
    }
  }

  async getMetadata(imdbId: string): Promise<TMDbMetadata | undefined> {
    if (!this.api) return
    const { data } = await this.api.get<TMDBFindResult>(`/find/${imdbId}`, {
      params: {
        external_source: 'imdb_id',
      },
    })

    if (data.movie_results.length === 1) {
      const res = await this.api.get<TMDbMetadataSnake>(`/movie/${data.movie_results[0].id}`)
      return camelizeKeys(res.data)
    } else if (data.tv_results.length === 1) {
      const res = await this.api.get<TMDbMetadataSnake>(`/tv/${data.tv_results[0].id}`)
      return camelizeKeys(res.data)
    }
  }
}

interface TMDBFindResult {
  movie_results: { id: number }[]
  tv_results: { id: number }[]
}

export type TMDbMetadata = CamelCasedPropertiesDeep<TMDbMetadataSnake>

export interface TMDbMetadataSnake {
  adult: boolean
  backdrop_path: string
  belongs_to_collection: BelongsToCollection
  budget: number
  genres: Genre[]
  homepage: string
  id: number
  imdb_id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: string
  revenue: number
  runtime: number
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface BelongsToCollection {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}
