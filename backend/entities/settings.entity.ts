import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  EventArgs,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core'
import { PlexServer } from 'modules/plexapi'
import { Field, ObjectType } from 'type-graphql'

import { RadarrAPI } from '../modules/radarr/RadarrAPI'
import { RadarrFile } from './movie.entity'
import { Node } from './node.entity'
import { PlexSectionEntity } from './Plex/plexSection.entity'
import { User } from './user.entity'

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
  plexAccountToken!: string
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

  @OneToMany(() => PlexSectionEntity, (section) => section.server)
  @Field(() => [PlexSectionEntity])
  sections = new Collection<PlexSectionEntity>(this)

  @ManyToOne(() => User)
  user!: User

  @BeforeCreate()
  @BeforeUpdate()
  async before({ entity }: EventArgs<PlexInstance>): Promise<void> {
    const { friendlyName, machineIdentifier } = await PlexServer.build(entity.url, entity.token)
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

  @OneToMany(() => RadarrFile, (radarr) => radarr.instance)
  files = new Collection<RadarrFile>(this)

  @ManyToOne(() => User)
  user!: User

  @BeforeCreate()
  @BeforeUpdate()
  async testConnection({ entity }: EventArgs<RadarrInstance>): Promise<void> {
    const api = new RadarrAPI(entity.url, entity.apiKey)
    await api.testConnection()
  }
}
