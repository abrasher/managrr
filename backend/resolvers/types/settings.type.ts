import { IsUrl } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

import { BaseInput } from './base.type'

@InputType()
export class AddPlexInstanceInput {
  @IsUrl()
  @Field({
    description: 'URL of the Plex Server',
  })
  url!: string

  @Field({
    description: 'Token for the Plex Server',
  })
  token!: string
}

@InputType()
export class UpdatePlexInstanceInput extends BaseInput {
  @Field((type) => ID)
  id!: string

  @Field()
  url!: string

  @Field()
  token!: string
}

@InputType()
export class UpdateSettingsInput extends BaseInput {
  @Field({ nullable: true })
  port?: number

  @Field({ nullable: true })
  plexAccountToken!: string

  @Field({ nullable: true })
  language?: string
}

@InputType()
export class AddRadarrInstanceInput {
  @Field()
  url!: string

  @Field()
  apiKey!: string

  @Field()
  instanceName!: string
}

@InputType()
export class UpdateRadarrInstanceInput extends BaseInput {
  @Field()
  url!: string

  @Field()
  apiKey!: string

  @Field()
  instanceName!: string
}
