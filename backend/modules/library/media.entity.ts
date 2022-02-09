import {
  Collection,
  Entity,
  JsonType,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { Node } from '@/backend/modules/graphql/node.entity'

import { OMDbMetadata } from './metadatas/omdbMetadata.entity'
import { PlexMetadata } from './metadatas/plexMetadata.entity'
import { RadarrMetadata } from './metadatas/radarrMetadata.entity'
import { TMDBMetadata } from './metadatas/tmdbMetadata.entity'

@Entity()
@ObjectType({ implements: Node })
export class Media extends Node<Media> {
  @Property() @Field() title!: string
  @Property() @Field() year!: number
  @Unique() @Property() @Field() imdbId?: string
  @Property() @Field() type!: 'movie' | 'show'

  // Program Connections
  @OneToMany(() => PlexMetadata, (item) => item.media)
  @Field(() => [PlexMetadata])
  plexMetadata = new Collection<PlexMetadata>(this)

  @OneToMany(() => RadarrMetadata, (item) => item.media)
  @Field(() => RadarrMetadata)
  radarrMetadata = new Collection<RadarrMetadata>(this)

  // Data Connections
  @Property({ type: JsonType })
  @Field(() => OMDbMetadata)
  omdbMetadata!: OMDbMetadata

  @OneToOne(() => TMDBMetadata)
  @Field(() => String)
  tmdbMetadata!: TMDBMetadata
}
