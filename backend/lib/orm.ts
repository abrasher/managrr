import { MikroORM } from '@mikro-orm/core'

export const initORM = (orm: MikroORM): ORM => {
  const ormClass = new ORM(orm)
  state.orm = ormClass
  console.log('runs')
  return ormClass
}

export const getORM = (): ORM => {
  return state
}

const state = {
  orm: {},
}

class ORM {
  private static _instance: ORM
  private static _orm: MikroORM
  test!: string
  static getInstance() {
    return this._instance
  }

  constructor(orm: MikroORM) {
    this.test = 'test'
    ORM._orm = orm
    ORM._instance = this
  }
}
