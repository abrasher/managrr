import 'reflect-metadata'

import { MikroORM } from '@mikro-orm/core'
import mikroOrmConfig from 'mikro-orm.config'
void (async () => {
  const orm = await MikroORM.init(mikroOrmConfig)
  const generator = orm.getSchemaGenerator()

  // or you can run those queries directly, but be sure to check them first!
  await generator.dropSchema()
  await generator.createSchema()
  // await generator.updateSchema()

  await orm.close(true)
})()
