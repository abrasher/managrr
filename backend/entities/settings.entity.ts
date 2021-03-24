import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { RadarrFile } from './movie.entity'
import { PlexSectionEntity } from './Plex/plexSection.entity'

@Entity()
@ObjectType()
export class Settings extends BaseEntity<Settings, 'id'> {
  @PrimaryKey()
  id?: number = 1

  @Property()
  @Field()
  language?: string = 'eng'

  @Property({ nullable: true })
  plexAccountToken!: string | null
}

@Entity()
@ObjectType()
export class PlexInstance extends BaseEntity<PlexInstance, 'machineIdentifier'> {
  @PrimaryKey()
  @Field()
  id?: number

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

  @Unique()
  @Property()
  @Field()
  instanceName!: string

  @OneToMany(() => RadarrFile, (radarr) => radarr.instance)
  files = new Collection<RadarrFile>(this)
}
