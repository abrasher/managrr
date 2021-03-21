import {
  BaseEntity,
  Collection,
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { OneToMany } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { LibraryType } from '../../plexapi/types'
import { PlexMediaEntity } from './plexMedia.entity'

@Entity()
@ObjectType()
export class PlexSectionEntity extends BaseEntity<PlexSectionEntity, 'uuid'> {
  @PrimaryKey()
  @Field()
  uuid!: string

  @Property()
  @Field()
  title!: string

  @Property()
  @Field()
  key!: number

  @Enum(() => LibraryType)
  @Field(() => LibraryType)
  type!: LibraryType

  @OneToMany(() => PlexMediaEntity, (media) => media.section)
  media = new Collection<PlexMediaEntity>(this)
}
