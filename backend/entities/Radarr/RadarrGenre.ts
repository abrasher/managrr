import { ObjectType, Field, Int } from 'type-graphql'
import { RadarrMovie } from './RadarrMovie'

@ObjectType()
export class RadarrGenre {
  @Field((type) => Int, {
    nullable: false,
  })
  id!: number

  @Field((type) => String, {
    nullable: false,
  })
  name!: string

  movie?: RadarrMovie[]
}
