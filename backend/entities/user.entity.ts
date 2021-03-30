import { Collection, Entity, OneToMany, OneToOne, Property } from '@mikro-orm/core'
import { Settings } from 'entities'
import { Node } from 'entities/node.entity'
import { Field, ObjectType } from 'type-graphql'

import { PlexInstance, RadarrInstance } from './settings.entity'

@Entity()
@ObjectType({ implements: Node })
export class User extends Node<User> {
  @Property()
  @Field()
  name!: string

  @OneToOne(() => Settings)
  @Field()
  settings!: Settings

  @OneToMany(() => PlexInstance, (instance) => instance.user)
  plexInstances = new Collection<PlexInstance>(this)

  @OneToMany(() => RadarrInstance, (instance) => instance.user)
  radarrInstances = new Collection<RadarrInstance>(this)
}
