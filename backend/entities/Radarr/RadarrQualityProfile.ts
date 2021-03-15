import { RadarrMovie } from './RadarrMovie'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class RadarrQualityProfile {
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
