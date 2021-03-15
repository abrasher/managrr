import { ObjectType, Field, Int, Float } from 'type-graphql'
import { RadarrMovie } from './RadarrMovie'

@ObjectType()
export class RadarrRating {
  @Field((type) => Int, {
    nullable: false,
  })
  id!: number

  @Field((type) => Int, {
    nullable: false,
  })
  votes!: number

  @Field((type) => Float, {
    nullable: false,
  })
  value!: number

  movie?: RadarrMovie | null

  @Field((type) => Int, {
    nullable: true,
  })
  movieId?: number | null
}
