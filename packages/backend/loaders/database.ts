import { MikroORM } from '@mikro-orm/core'

import mikroOrmConfig from '@/backend/mikro-orm.config'

let orm: Promise<MikroORM> | undefined

export const getOrm = (): Promise<MikroORM> => {
  if (orm) {
    return orm
  }

  orm = MikroORM.init(mikroOrmConfig)

  return orm
}
