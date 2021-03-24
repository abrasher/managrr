import { IsUrl } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

import { PlexInstance, RadarrInstance, Settings } from '../../entities'
import { EntityInput } from '../../types'

@InputType()
export class RadarrSettingsInput implements EntityInput<RadarrInstance> {
  @IsUrl()
  @Field()
  url!: string

  @Field()
  apiKey!: string

  @Field()
  instanceName!: string
}

@InputType()
export class AddPlexInstanceInput implements EntityInput<PlexInstance> {
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
export class UpdatePlexInstanceInput {
  @Field((type) => ID)
  id!: number

  @Field()
  url!: string

  @Field()
  token!: string
}

@InputType()
export class RemoveRadarrInstanceInput {
  @Field((type) => ID)
  id!: number
}

@InputType()
export class UpdateSettingsInput implements Omit<EntityInput<Settings>, 'id'> {
  @Field({ nullable: true })
  port?: number

  @Field({ nullable: true })
  plexAccountToken!: string

  @Field({ nullable: true })
  language?: string
}

@InputType()
export class AddRadarrInstanceInput implements EntityInput<RadarrInstance> {
  @Field()
  url!: string

  @Field()
  apiKey!: string

  @Field()
  instanceName!: string
}

@InputType()
export class UpdateRadarrInstanceInput implements EntityInput<RadarrInstance> {
  @Field()
  url!: string

  @Field()
  apiKey!: string

  @Field()
  instanceName!: string
}

@InputType()
export class DeleteRadarrInstanceInput {
  @Field()
  url!: string
}
