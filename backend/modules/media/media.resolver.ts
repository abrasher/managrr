import { Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { ContextType, RemoveBaseEntity } from '@/types'

import { Media } from './media.entity'

type IMedia = RemoveBaseEntity<Media>

@Service()
@Resolver((of) => Media)
export class MediaResolver {
  @Query((of) => [Media])
  async media(@Ctx() context: ContextType): Promise<IMedia[]> {
    const media = await context.em.find(Media, {})

    return media.map((item) => ({
      id: item.id,
      globalId: item.globalId,
      title: item.title,
      imdbId: item.imdbId,
      year: item.year,
      type: item.type,
      radarrMetadata: JSON.stringify(item.radarrMetadata),
      plexMetadata: JSON.stringify(item.plexMetadata),
      tmdbMetadata: JSON.stringify(item.tmdbMetadata),
      omdbMetadata: JSON.stringify(item.omdbMetadata),
    }))
  }
}
