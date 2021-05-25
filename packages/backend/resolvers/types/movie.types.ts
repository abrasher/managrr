import { Field, ID, InputType } from 'type-graphql'

import { RadarrFile } from '../../entities/movie.entity'
import { Availability } from '../../entities/radarr.type'
import { AddRadarrPayload } from '../../modules/radarr/radarr'

@InputType()
export class UpdateMovieInput {
  @Field(() => ID)
  id!: string

  @Field()
  year!: number

  @Field(() => [UpdateRadarrFileInput])
  radarrs!: UpdateRadarrFileInput[]
}

@InputType()
class UpdateRadarrFileInput {
  @Field(() => ID)
  id!: number

  @Field({ nullable: true })
  monitored?: boolean

  @Field({ nullable: true })
  search?: boolean
}

@InputType()
export class AddMovieToRadarrInput {
  @Field()
  movieId!: number

  @Field()
  radarrUrl!: string

  @Field()
  monitored!: boolean

  @Field()
  qualityProfileId!: number

  @Field()
  search!: boolean

  @Field(() => Availability)
  minimumAvailablity!: Availability

  @Field(() => [Number])
  tags!: number[]
}
