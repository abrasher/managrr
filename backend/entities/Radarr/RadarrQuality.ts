import { ObjectType, Field, Int } from 'type-graphql'
import { RadarrMovieFile } from './RadarrMovieFile'

@ObjectType()
export class RadarrQuality {
  @Field((type) => Int, {
    nullable: false,
  })
  id!: number

  @Field((type) => String, {
    nullable: false,
  })
  name!: string

  @Field((type) => String, {
    nullable: false,
  })
  source!: string

  @Field((type) => Int, {
    nullable: false,
  })
  resolution!: number

  @Field((type) => String, {
    nullable: false,
  })
  modifier!: string

  movieFile?: RadarrMovieFile[]
}
