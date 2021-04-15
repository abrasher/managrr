import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Cookie } from 'express-session'

@Entity()
export class Session {
  @PrimaryKey()
  id!: string

  @Property({ type: 'json' })
  session!: { cookie: Cookie }

  @Property()
  expiredAt!: number
}
