import { Entity, ManyToOne } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { Movie } from '../movie.entity'
import { Node } from '../node.entity'
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
