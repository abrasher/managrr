import { Field, ID, InputType } from 'type-graphql'

import { PosterGenerationSettings } from '@/backend/modules/system/settings.entity'

@InputType()
export class UpdateSettingsInput {
  @Field({ nullable: true })
  port?: number

  @Field({ nullable: true })
  plexAccountToken?: string

  @Field({ nullable: true })
  language?: string

  @Field(() => PosterGenerationSettings, { nullable: true })
  posterSettings?: PosterGenerationSettings
}

// Plex Instance Types

@InputType()
export class AddPlexInstanceInput {
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
export class UpdatePlexInstanceInput {
  @Field(() => ID)
  id!: string

  @Field()
  url!: string

  @Field()
  token!: string

  @Field()
  port!: number
}

// RadarrInstance Types

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
export class UpdateRadarrInstanceInput {
  @Field(() => ID)
  id!: string

  @Field()
  url!: string

  @Field()
  apiKey!: string

  @Field()
  instanceName!: string
}
