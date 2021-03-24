import { BaseEntity, Collection, Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { OneToMany } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { LibraryType } from '../../plexapi/types'
import { PlexInstance } from '../settings.entity'
import { PlexMediaEntity } from './plexMedia.entity'

@Entity()
@ObjectType('PlexSection')
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

  @ManyToOne(() => PlexInstance)
  @Field(() => PlexInstance)
  server!: PlexInstance

  @Enum(() => LibraryType)
  @Field(() => LibraryType)
  type!: LibraryType

  @OneToMany(() => PlexMediaEntity, (media) => media.section)
  media = new Collection<PlexMediaEntity>(this)
}
