import { Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { Context, RemoveBaseEntity } from '../../types'
import { Media } from './media.entity'

type IMedia = RemoveBaseEntity<Media>

@Service()
@Resolver((of) => Media)
export class MediaResolver {
  @Query((of) => [Media])
  async media(@Ctx() context: Context): Promise<IMedia[]> {
    console.log(context)

    const media = await context.em.find(Media, {})

    return media.map((item) => ({
      id: item.id,
      globalId: item.globalId,
      title: item.title,
      imdbId: item.imdbId,
      year: item.year,
      type: item.type,
      radarrMetadata: item.radarrMetadata,
      plexMetadata: item.plexMetadata,
      tmdbMetadata: item.tmdbMetadata,
      omdbMetadata: item.omdbMetadata,
    }))
  }
}
