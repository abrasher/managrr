import { resolveSelections } from '@jenyus-org/graphql-utils'
import { EntityManager } from '@mikro-orm/sqlite'
import { GraphQLResolveInfo } from 'graphql'
import { Arg, Ctx, FieldResolver, Info, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'

import { RadarrInstance } from '../entities'
import { Movie } from '../entities/movie.entity'
import { RadarrAPI } from '../lib/RadarrAPI'
import { RadarrService } from '../services/radarr.service'
import { ContextType, EntityData } from '../types'
import { createBaseResolver } from './base.resolver'
import { AddMovieToRadarrInput, UpdateMovieInput } from './types/movie.types'

const MovieBaseResolver = createBaseResolver(Movie)

@Service()
@Resolver((of) => Movie)
export class MovieResolver extends MovieBaseResolver {
  constructor(private radarrService: RadarrService, private em: EntityManager) {
    super()
  }

  @Mutation(() => Movie)
  async addMovie(@Ctx() ctx: ContextType): Promise<Movie> {
    const id = Math.floor(Math.random() * 10000)

    const movieData: EntityData<Movie> = {
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

  @Mutation(() => Movie)
  async updateMovie(@Arg('data') { id, year }: UpdateMovieInput, @Ctx() ctx: ContextType): Promise<Movie> {
    const movie = await ctx.em.findOneOrFail(Movie, { id })

    movie.year = year

    await ctx.em.flush()

    return movie
  }

  @Mutation(() => String)
  async addMovieToRadarr(@Ctx() ctx: ContextType, @Arg('data') input: AddMovieToRadarrInput): Promise<string> {
    const { url, apiKey } = await ctx.em.findOneOrFail(RadarrInstance, { url: input.radarrUrl })

    const test = new RadarrAPI(url, apiKey)

    await test.addMovie()
    // const movie = await ctx.em.findOneOrFail(Movie, { tmdbId: input.movieId })

    // const result = await this.radarrService.addMovie(input)

    return 'added movie'
  }
}
