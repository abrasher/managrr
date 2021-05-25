import { Collection, Entity, OneToMany, OneToOne, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { Settings } from '@/backend/entities'
import { Node } from '@/backend/entities/node.entity'

import { PlexInstance, RadarrInstance } from './settings.entity'

@Entity()
@ObjectType({ implements: Node })
export class User extends Node<User> {
  @Property()
  @Field()
  username!: string

  @Property()
  password!: string

  @Property({ nullable: true })
  accessToken!: string | null

  @Property({ nullable: true })
  refreshToken!: string | null

  @OneToOne(() => Settings)
  @Field(() => Settings)
  settings!: Settings

  @OneToMany(() => PlexInstance, (instance) => instance.user)
  plexInstances = new Collection<PlexInstance>(this)

  @OneToMany(() => RadarrInstance, (instance) => instance.user)
  radarrInstances = new Collection<RadarrInstance>(this)
}
