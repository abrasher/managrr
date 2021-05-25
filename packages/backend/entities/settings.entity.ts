import {
  BaseEntity,
  BeforeCreate,
  BeforeUpdate,
  Entity,
  EventArgs,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { ThumbnailOptions } from '@/backend/lib/PosterGenerator'
import { PlexServer } from '@/backend/modules/plexapi'
import { BlendMode } from '@/backend/modules/system/system.input'

import { RadarrAPI } from '../modules/radarr/RadarrAPI'
import { Node } from './node.entity'
import { User } from './user.entity'

@Entity()
@ObjectType()
export class PosterGenerationSettings
  extends BaseEntity<PosterGenerationSettings, 'id'>
  implements ThumbnailOptions {
  @PrimaryKey()
  id: string = v4()

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

  @OneToOne(() => Settings, (settings) => settings.posterSettings)
  settings!: SettingsAlias
}

@Entity()
@ObjectType({ implements: Node })
export class Settings extends Node<Settings> {
  @PrimaryKey()
  id: string = 'main'

  @Property()
  @Field()
  language?: string = 'eng'

  @Field({ nullable: true })
  @Property({ nullable: true })
  plexAccountToken?: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  omdbKey!: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  tmdbKey!: string

  @Field(() => PosterGenerationSettings)
  @OneToOne()
  posterSettings!: PosterGenerationSettings
}

type SettingsAlias = typeof Settings

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

  @ManyToOne(() => User)
  user!: User

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

  @ManyToOne(() => User)
  user!: User

  @BeforeCreate()
  @BeforeUpdate()
  async testConnection({ entity }: EventArgs<RadarrInstance>): Promise<void> {
    const api = new RadarrAPI(entity.url, entity.apiKey)
    await api.testConnection()
  }
}
