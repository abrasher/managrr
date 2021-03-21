import { Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql'

import { Movie } from '../entities/movie.entity'
import { createBaseResolver } from '../lib/helpers'
import { Columns, ContextType } from '../types'

const MovieBaseResolver = createBaseResolver(Movie)

@Resolver((of) => Movie)
export class MovieResolver extends MovieBaseResolver {
  @Mutation(() => Movie)
  async addMovie(@Ctx() ctx: ContextType): Promise<Movie> {
    const id = Math.floor(Math.random() * 10000)

    const movieData: Columns<Movie> = {
      id,
      contentRating: 'R',
      duration: 222,
      studio: 'A Studio',
      title: 'The Movie ' + id.toString(),
      year: 2009,
    }

    const newMovie = ctx.em.create(Movie, movieData)

    await ctx.em.persistAndFlush(newMovie)

    return newMovie
  }

  @FieldResolver(() => Number)
  async totalFileSize(@Root() root: Movie): Promise<number> {
    const radarrs = await root.radarrs.loadItems()
    const totalSize = radarrs.reduce((accum, value) => value.id + accum, 0)
    return totalSize
  }
}
