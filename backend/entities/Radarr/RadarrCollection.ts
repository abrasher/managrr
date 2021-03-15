import { RadarrMovie } from './RadarrMovie'
import { Field, Int, ObjectType } from 'type-graphql'

ObjectType()
export class RadarrCollection {
  @Field((type) => String, {
    nullable: false,
  })
  name!: string

  @Field((type) => Int, {
    nullable: false,
  })
  tmdbId!: number

  movie?: RadarrMovie[]
}
