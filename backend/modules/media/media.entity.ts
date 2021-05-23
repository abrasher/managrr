import { Entity, JsonType, Property, Unique } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { Node } from '@/entities'

@Entity()
@ObjectType({ implements: Node })
export class Media extends Node<Media> {
  @Property()
  @Field()
  title!: string

  @Property()
  @Field()
  year!: number

  @Unique()
  @Property()
  @Field()
  imdbId?: string

  @Property()
  @Field()
  type!: string

  @Property({ type: JsonType })
  @Field(() => String)
  radarrMetadata!: string

  @Property({ type: JsonType })
  @Field(() => String)
  plexMetadata!: string

  @Property({ type: JsonType })
  @Field(() => String)
  omdbMetadata!: string

  @Property({ type: JsonType })
  @Field(() => String)
  tmdbMetadata!: string
}
