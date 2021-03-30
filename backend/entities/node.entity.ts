import { BaseEntity, PrimaryKey } from '@mikro-orm/core'
import { Field, ID, InterfaceType } from 'type-graphql'
import { v4 } from 'uuid'

interface INode {
  id: string
}

@InterfaceType({ isAbstract: true })
export abstract class Node<T extends INode> extends BaseEntity<T, 'id'> {
  @Field(() => ID, { name: 'id' })
  globalId!: string

  @PrimaryKey()
  id: string = v4()
}
