import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { RadarrFile } from './movie.entity'
import { Node } from './node.entity'
import { PlexSectionEntity } from './Plex/plexSection.entity'
import { User } from './user.entity'

@Entity()
@ObjectType()
export class Settings extends Node<Settings> {
  @PrimaryKey()
  id: string = 'main'

  @Property()
  @Field()
  language?: string = 'eng'

  @Property({ nullable: true })
  plexAccountToken!: string | null
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
}

@Entity()
@ObjectType({ implements: Node })
export class RadarrInstance extends Node<RadarrInstance> {
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

  @ManyToOne(() => User)
  user!: User
}
