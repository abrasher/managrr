import { BaseEntity, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core'
import { Node } from 'entities'
import { Field, ObjectType } from 'type-graphql'

import { Movie } from '../movie.entity'
import { PlexSectionEntity } from './plexSection.entity'

@Entity()
@ObjectType('PlexMedia', { implements: Node })
export class PlexMediaEntity extends Node<PlexMediaEntity> {
  @Field()
  ratingKey!: number

  @ManyToOne(() => Movie)
  movie!: Movie

  @ManyToOne(() => PlexSectionEntity)
  @Field(() => PlexSectionEntity)
  section!: PlexSectionEntity
}
