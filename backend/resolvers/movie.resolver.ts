import { GraphQLResolveInfo } from 'graphql'
import { Info, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { Movie } from '../entities/movie.entity'
import { MovieRepository } from '../repositories/movie.repository'

@Service()
@Resolver((of) => Movie)
export class MovieResolver {
  constructor(private movieRepo: MovieRepository) {}

  @Query((returns) => Movie)
  movies(@Info() info: GraphQLResolveInfo): Movie {
    return {
      cast: [],
      contentRating: '2',
      duration: 222,
      genres: [],
      id: 2,
      producer: [],
      studio: 'few',
      title: 'a movie',
      writers: [],
      totalFileSize: 2,
      files: [],
      year: 2100,
      plexCollections: [],
    }
  }
}
