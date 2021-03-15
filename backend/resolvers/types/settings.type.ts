import { Field, ArgsType, InputType } from 'type-graphql'
import { PlexSettings, Settings } from '@generated/type-graphql'
import { IsUrl } from 'class-validator'

@ArgsType()
@InputType()
export class PlexSettingsInput implements Partial<PlexSettings> {
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

@ArgsType()
@InputType()
export class SettingsInput implements Omit<Settings, 'id'> {
  @Field({ nullable: true })
  plexAccountToken!: string

  @Field({ nullable: true })
  port!: number

  @Field({ nullable: true })
  language!: string

  @Field((type) => [PlexSettingsInput], { nullable: true })
  plex?: PlexSettings[]
}
