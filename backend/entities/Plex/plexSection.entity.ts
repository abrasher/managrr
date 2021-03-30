import { Collection, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'
import { OneToMany } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { LibraryType } from '../../modules/plexapi/types'
import { Node } from '../node.entity'
import { PlexInstance } from '../settings.entity'
import { PlexMediaEntity } from './plexMedia.entity'

@Entity()
@ObjectType('PlexSection', { implements: Node })
export class PlexSectionEntity extends Node<PlexSectionEntity> {
  @Field()
  uuid!: string

  @Property()
  @Field()
  title!: string

  @Property()
  @Field()
  key!: number

  @ManyToOne(() => PlexInstance)
  @Field(() => PlexInstance)
  server!: PlexInstance

  @Enum(() => LibraryType)
  @Field(() => LibraryType)
  type!: LibraryType

  @OneToMany(() => PlexMediaEntity, (media) => media.section)
  media = new Collection<PlexMediaEntity>(this)
}
