import {
  BaseEntity,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { RadarrFile } from './movie.entity'

@Entity()
@ObjectType()
export class Settings extends BaseEntity<Settings, 'id'> {
  @PrimaryKey()
  id: number = 1

  @Property()
  @Field()
  language?: string = 'eng'

  @OneToMany(() => PlexSettings, (plex) => plex.settings)
  @Field((type) => [PlexSettings])
  plex = new Collection<PlexSettings>(this)

  @OneToMany(() => RadarrInstance, (radarr) => radarr.settings)
  radarrInstances = new Collection<RadarrInstance>(this)
}

@Entity()
@ObjectType()
export class PlexSettings extends BaseEntity<
  PlexSettings,
  'machineIdentifier'
> {
  @PrimaryKey()
  @Field()
  machineIdentifier!: string

  @Property()
  @Field({ description: 'Server name set by the owner', nullable: true })
  friendlyName!: string

  @Property()
  @Field()
  url!: string

  @Property()
  @Field()
  token!: string

  @ManyToOne(() => Settings)
  settings!: Settings
}

@Entity()
@ObjectType()
export class RadarrInstance extends BaseEntity<RadarrInstance, 'url'> {
  @PrimaryKey()
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

  @ManyToOne(() => Settings)
  settings!: Settings
}
