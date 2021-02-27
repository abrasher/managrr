import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Settings {
  readonly id?: number = 1

  @Field()
  language?: string = 'eng'

  @Field((type) => [PlexSettings])
  plex?: PlexSettings[]
}

@ObjectType()
export class PlexSettings {
  readonly id?: number

  @Field({ description: 'Server name set by the owner', nullable: true })
  friendlyName!: string

  @Field({ nullable: true })
  machineIdentifier!: string

  @Field()
  url!: string

  @Field()
  token!: string
}
