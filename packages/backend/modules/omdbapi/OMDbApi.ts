import axios, { AxiosInstance } from 'axios'

export class OMDbApi {
  api: AxiosInstance

  constructor(apiKey: string) {
    this.api = axios.create({
      baseURL: 'https://www.omdbapi.com/',
      params: {
        apiKey,
      },
    })
  }

  private parseRatings(ratings: Array<{ Source: RatingsSource; Value: string }>) {
    const ratingObj: MovieRatings = {
      rottenTomatoes: undefined,
      imdb: undefined,
      metacritic: undefined,
    }
    for (const { Source, Value } of ratings) {
      switch (Source) {
        case 'Internet Movie Database':
          ratingObj.imdb = Number(Value.replace('/10', ''))
          break
        case 'Metacritic':
          ratingObj.metacritic = Number(Value.replace('/100', ''))
          break
        case 'Rotten Tomatoes':
          ratingObj.rottenTomatoes = Number(Value.replace('%', ''))
          break
        default:
          ratingObj[Source] = Number(Value)
      }
    }

    return ratingObj
  }

  async search(
    title: string,
    year: number | string,
    type: 'movie' | 'series' | 'episode'
  ): Promise<OMDbMovie | undefined> {
    const { data } = await this.api.get<ApiResponse>('', {
      params: {
        t: title,
        y: year,
        type,
      },
    })

    if (data.Response === 'False') {
      return
    }

    const { Response, ...movieData } = data

    return {
      ...movieData,
      Ratings: this.parseRatings(data.Ratings),
      Year: Number(data.Year),
      Metascore: Number(data.Metascore),
      imdbRating: Number(data.imdbRating),
      imdbVotes: Number(data.imdbVotes.replace(',', '')),
    }
  }

  async findByIMDbId(imdbId: string): Promise<OMDbMovie | undefined> {
    const { data } = await this.api.get<ApiResponse>('', {
      params: {
        i: imdbId,
      },
    })

    if (data.Response === 'False') {
      return
    }

    const { Response, ...movieData } = data

    return {
      ...movieData,
      Ratings: this.parseRatings(data.Ratings),
      Year: Number(data.Year),
      Metascore: Number(data.Metascore),
      imdbRating: Number(data.imdbRating),
      imdbVotes: Number(data.imdbVotes.replace(',', '')),
    }
  }
}

type ApiResponse = OMDbMovieResponse | OMDbErrorResponse

interface OMDbResponse {
  Response: 'True' | 'False'
}

interface OMDbErrorResponse extends OMDbResponse {
  Error: string
  Response: 'False'
}

export interface OMDbMovieResponse extends OMDbResponse {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: {
    Source: RatingsSource
    Value: string
  }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: 'True'
}

type RatingsSource = 'Internet Movie Database' | 'Rotten Tomatoes' | 'Metacritic'

type MovieRatings = {
  rottenTomatoes: number | undefined
  imdb: number | undefined
  metacritic: number | undefined
  [p: string]: number | undefined
}

export interface OMDbMovie
  extends Omit<
    OMDbMovieResponse,
    'Year' | 'Metascore' | 'imdbVotes' | 'imdbRating' | 'Ratings' | 'Response'
  > {
  Year: number
  Metascore: number
  imdbRating: number
  imdbVotes: number
  Ratings: MovieRatings
}
