import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  EventArgs,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core'
import { Field, InputType, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { PlexServer } from '@/backend/modules/externalAPI/plex'
import { ThumbnailOptions } from '@/backend/modules/library/PosterGenerator'
import { BlendMode } from '@/backend/modules/system/system.input'

import { RadarrAPI } from '../externalAPI/radarr/RadarrAPI'
import { Node } from '../graphql/node.entity'

@InputType('PosterGenerationSettingsInput')
@Entity()
@ObjectType()
export class PosterGenerationSettings implements ThumbnailOptions {
  @PrimaryKey()
  id = 1

  @Property()
  @Field()
  SOURCE_OPACITY!: number

  @Property()
  @Field()
  DESTINATION_OPACITY!: number

  @Property()
  @Field(() => BlendMode)
  BLEND_MODE!: BlendMode

  @Property()
  @Field()
  SPACING!: number

  @Property()
  @Field()
  GLOBAL_ICON_SCALE!: number

  @Property()
  @Field()
  RATING_SCALE!: number

  @Property()
  @Field()
  FONT_COLOUR!: 'white' | 'black'

  @Property()
  @Field()
  IMAGE_HEIGHT!: number

  @Property()
  @Field()
  IMAGE_WIDTH!: number

  @Property()
  @Field()
  JPEG_QUALITY!: number

  @Property()
  @Field()
  BOX_COLOUR!: string

  // @OneToOne({ mappedBy: 'posterSettings' })
  // settings!: Settings
}

@Entity()
@ObjectType({ implements: Node })
export class Settings extends Node<Settings> {
  @PrimaryKey()
  id: string = 'main'

  @Property()
  @Field()
  language?: string = 'eng'

  @Property({ nullable: true })
  @Field()
  password?: string = ''

  @Property()
  @Field()
  port!: number

  @Property()
  @Field(() => String)
  apiKey = v4()

  @Field({ nullable: true })
  @Property({ nullable: true })
  plexAccountToken?: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  omdbKey?: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  tmdbKey?: string

  @Field(() => PosterGenerationSettings)
  @OneToOne()
  posterSettings!: PosterGenerationSettings
}

@Entity()
@ObjectType({ implements: Node })
export class PlexInstance extends Node<PlexInstance> {
  @Unique()
  @Property()
  @Field()
  machineIdentifier?: string

  @Property()
  @Field({ description: 'Server name set by the owner', nullable: false })
  friendlyName?: string

  @Property()
  @Field()
  url!: string

  @Property()
  @Field()
  token!: string

  get api() {
    return new PlexServer(this.url, this.token)
  }

  @BeforeCreate()
  @BeforeUpdate()
  async before({ entity }: EventArgs<PlexInstance>): Promise<void> {
    entity.url = entity.url.endsWith('/') ? entity.url.slice(0, -1) : entity.url

    const plexServer = new PlexServer(entity.url, entity.token)

    const { friendlyName, machineIdentifier } = await plexServer.getDetails()
    entity.friendlyName = friendlyName
    entity.machineIdentifier = machineIdentifier
  }
}

@Entity()
@ObjectType({ implements: Node })
export class RadarrInstance extends Node<RadarrInstance> {
  @Unique()
  @Property()
  @Field()
  url!: string

  @Property()
  @Field()
  apiKey!: string

  @Property()
  @Field()
  instanceName!: string

  get api() {
    return new RadarrAPI(this.url, this.apiKey)
  }

  @BeforeCreate()
  @BeforeUpdate()
  async testConnection({ entity }: EventArgs<RadarrInstance>): Promise<void> {
    const api = new RadarrAPI(entity.url, entity.apiKey)
    await api.testConnection()
  }
}
