import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { RadarrInstance } from '../entities'
import { Movie, RadarrFile } from '../entities/movie.entity'
import { RadarrAPI } from '../modules/radarr/RadarrAPI'
import { ContextType, EntityData } from '../types'
import { createBaseResolver } from './base.resolver'
import { AddMovieToRadarrInput, UpdateMovieInput } from './types/movie.types'

const MovieBaseResolver = createBaseResolver(Movie)

@Service()
@Resolver((of) => Movie)
export class MovieResolver extends MovieBaseResolver {
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

  @Mutation(() => Movie)
  async addMovieToRadarr(@Ctx() ctx: ContextType, @Arg('data') input: AddMovieToRadarrInput): Promise<Movie> {
    const instance = await ctx.em.findOneOrFail(RadarrInstance, { url: input.radarrUrl })

    const test = new RadarrAPI(instance.url, instance.apiKey)

    const newRadarr = await test.addMovie({ ...input, tmdbId: input.movieId })

    if (newRadarr === null) {
      throw new Error('Unable to Add Movie')
    }

    const { id, hasFile, monitored, qualityProfileId, tmdbId } = newRadarr

    const fileEntity = ctx.em.create(RadarrFile, {
      id,
      hasFile,
      instance,
      monitored,
      qualityProfileId,
      tmdbId,
    })

    const movie = await ctx.em.findOneOrFail(Movie, { tmdbId: input.movieId })
    movie.radarrs.add(fileEntity)

    await ctx.em.flush()

    return movie
  }

  @Mutation((returns) => String)
  async searchMovieRadarr(
    @Ctx() ctx: ContextType,
    @Arg('id') id: number,
    @Arg('radarrUrl') url: string
  ): Promise<string> {
    const instance = await ctx.em.findOneOrFail(RadarrInstance, { url })

    const radarrApi = new RadarrAPI(instance.url, instance.apiKey)

    await radarrApi.searchMovies([id])
  }
}
