import { BaseEntity, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { Movie } from '../movie.entity'
import { PlexSectionEntity } from './plexSection.entity'

@Entity()
@ObjectType()
export class PlexMediaEntity extends BaseEntity<PlexMediaEntity, 'ratingKey'> {
  @PrimaryKey()
  @Field()
  ratingKey!: number

  @ManyToOne(() => Movie)
  movie!: Movie

  @ManyToOne(() => PlexSectionEntity)
  @Field(() => PlexSectionEntity)
  section!: PlexSectionEntity
}
