import { ObjectType, Field, Int } from 'type-graphql'
import { Settings } from '../settings.entity'

@ObjectType()
export class RadarrSettings {
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
  url!: string

  @Field((type) => String, {
    nullable: false,
  })
  apiKey!: string

  settings?: Settings

  @Field((type) => Int, {
    nullable: false,
  })
  settingsId!: number
}
